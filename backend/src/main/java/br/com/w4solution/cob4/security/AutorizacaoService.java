package br.com.w4solution.cob4.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.EnumSet;
import java.util.Map;

@Service
public class AutorizacaoService {
	private final UsuarioAtualService usuarioAtualService;

	public AutorizacaoService(UsuarioAtualService usuarioAtualService) {
		this.usuarioAtualService = usuarioAtualService;
	}

	private static final Map<PerfilUsuario, EnumSet<AcaoSistema>> PERMISSOES = Map.of(
			PerfilUsuario.OPERADOR, EnumSet.of(AcaoSistema.MOVIMENTAR_PROTOCOLO),
			PerfilUsuario.SUPERVISOR, EnumSet.of(AcaoSistema.MOVIMENTAR_PROTOCOLO,
					AcaoSistema.ENCERRAR_PROTOCOLO, AcaoSistema.REABRIR_PROTOCOLO,
					AcaoSistema.EXECUTAR_CAMPO, AcaoSistema.DISTRIBUIR_CARTEIRA),
			PerfilUsuario.FINANCEIRO, EnumSet.of(AcaoSistema.CONFIRMAR_PAGAMENTO),
			PerfilUsuario.CAMPO, EnumSet.of(AcaoSistema.EXECUTAR_CAMPO),
			PerfilUsuario.JURIDICO, EnumSet.of(AcaoSistema.ACESSAR_JURIDICO),
			PerfilUsuario.GERENTE, EnumSet.allOf(AcaoSistema.class),
			PerfilUsuario.ADMINISTRADOR, EnumSet.allOf(AcaoSistema.class)
	);

	public UsuarioAutenticado exigir(AcaoSistema acao) {
		UsuarioAutenticado usuario = usuarioAtualService.atual();
		exigir(usuario.perfil(), acao);
		return usuario;
	}

	public UsuarioAutenticado atual() {
		return usuarioAtualService.atual();
	}

	public void exigir(PerfilUsuario perfil, AcaoSistema acao) {
		if (perfil == null || !PERMISSOES.getOrDefault(
				perfil, EnumSet.noneOf(AcaoSistema.class)).contains(acao)) {
			throw new AccessDeniedException("Perfil sem permissao para " + acao);
		}
	}

	public void exigirCarteira(String responsavelProtocolo, String usuario, PerfilUsuario perfil) {
		if (perfil == PerfilUsuario.OPERADOR
				&& (usuario == null || !usuario.equalsIgnoreCase(responsavelProtocolo))) {
			throw new AccessDeniedException("Operador nao pode acessar protocolo fora da propria carteira");
		}
	}
}
