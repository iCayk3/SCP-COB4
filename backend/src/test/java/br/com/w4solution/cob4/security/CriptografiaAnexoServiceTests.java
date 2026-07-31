package br.com.w4solution.cob4.security;
import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;
import static org.assertj.core.api.Assertions.*;
class CriptografiaAnexoServiceTests {
	@Test void protegeERecuperaComprovante(){var s=new CriptografiaAnexoService("chave-de-teste-segura-e-exclusiva",new MockEnvironment());byte[] claro="comprovante".getBytes();byte[] protegido=s.criptografar(claro);assertThat(protegido).isNotEqualTo(claro);assertThat(s.descriptografar(protegido)).isEqualTo(claro);}
	@Test void recusaChavePadraoEmProducao(){var env=new MockEnvironment();env.setActiveProfiles("prod");assertThatThrownBy(()->new CriptografiaAnexoService("desenvolvimento-chave-anexos-32-caracteres",env)).isInstanceOf(IllegalStateException.class).hasMessageContaining("produção");}
}
