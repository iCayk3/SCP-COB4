package br.com.w4solution.cob4.security;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.spec.*;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.util.Arrays;
import org.springframework.core.env.Environment;

@Service
public class CriptografiaAnexoService {
	private final SecretKeySpec chave; private final SecureRandom random=new SecureRandom();
	public CriptografiaAnexoService(@Value("${sgc.lgpd.anexos.chave}") String segredo,Environment env){try{if(java.util.Arrays.asList(env.getActiveProfiles()).contains("prod")&&segredo.startsWith("desenvolvimento-"))throw new IllegalStateException("SGC_LGPD_ANEXOS_CHAVE exclusiva é obrigatória em produção");chave=new SecretKeySpec(MessageDigest.getInstance("SHA-256").digest(segredo.getBytes(StandardCharsets.UTF_8)),"AES");}catch(IllegalStateException e){throw e;}catch(Exception e){throw new IllegalStateException(e);}}
	public byte[] criptografar(byte[] claro){try{byte[] iv=new byte[12];random.nextBytes(iv);var c=Cipher.getInstance("AES/GCM/NoPadding");c.init(Cipher.ENCRYPT_MODE,chave,new GCMParameterSpec(128,iv));byte[] enc=c.doFinal(claro);byte[] out=new byte[iv.length+enc.length];System.arraycopy(iv,0,out,0,iv.length);System.arraycopy(enc,0,out,iv.length,enc.length);return out;}catch(Exception e){throw new IllegalStateException("Falha ao proteger comprovante",e);}}
	public byte[] descriptografar(byte[] protegido){try{byte[] iv=Arrays.copyOfRange(protegido,0,12);var c=Cipher.getInstance("AES/GCM/NoPadding");c.init(Cipher.DECRYPT_MODE,chave,new GCMParameterSpec(128,iv));return c.doFinal(protegido,12,protegido.length-12);}catch(Exception e){throw new IllegalStateException("Comprovante corrompido ou chave inválida",e);}}
}
