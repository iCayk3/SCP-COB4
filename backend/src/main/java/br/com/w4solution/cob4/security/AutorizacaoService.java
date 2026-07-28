package br.com.w4solution.cob4.security;

import org.springframework.stereotype.Service;

import java.util.EnumSet;
import java.util.Map;

@Service
public class AutorizacaoService {
	private static final Map<PerfilUsuario, EnumSet<AcaoSistema>> PERMISSOES = Map.of(
			PerfilUsuario.OPERADOR, EnumSet.of(AcaoSistema.MOVIMENTAR_PROTOCOLO),
			PerfilUsuario.SUPERVISOR, EnumSet.of(AcaoSistema.MOVIMENTAR_PROTOCOLO, AcaoSistema.ENCERRAR_PROTOCOLO,
					AcaoSistema.REABRIR_PROTOCOLO, AcaoSistema.EXECUTAR_CAMPO),
			PerfilUsuario.FINANCEIRO, EnumSet.of(AcaoSistema.CONFIRMAR_PAGAMENTO),
			PerfilUsuario.CAMPO, EnumSet.of(AcaoSistema.EXECUTAR_CAMPO),
			PerfilUsuario.JURIDICO, EnumSet.of(AcaoSistema.ACESSAR_JURIDICO),
			PerfilUsuario.GERENTE, EnumSet.allOf(AcaoSistema.class),
			PerfilUsuario.ADMINISTRADOR, EnumSet.allOf(AcaoSistema.class)
	);

	public void exigir(PerfilUsuario perfil, AcaoSistema acao) {
		if (perfil == null || !PERMISSOES.getOrDefault(perfil, EnumSet.noneOf(AcaoSistema.class)).contains(acao)) {
			throw new SecurityException("Perfil sem permissão para " + acao);
		}
	}

	public void exigirCarteira(String responsavelProtocolo, String usuario, PerfilUsuario perfil) {
		if (perfil == PerfilUsuario.OPERADOR
				&& (usuario == null || !usuario.equalsIgnoreCase(responsavelProtocolo))) {
			throw new SecurityException("Operador não pode acessar protocolo fora da própria carteira");
		}
	}
}
