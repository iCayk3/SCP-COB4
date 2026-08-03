package br.com.w4solution.cob4.security;

import br.com.w4solution.cob4.repositories.CobrancaRepository;
import org.springframework.stereotype.Service;

@Service("carteiraAccess")
public class CarteiraAccessService {
	private final CobrancaRepository repository;
	private final UsuarioAtualService usuarioAtual;

	public CarteiraAccessService(CobrancaRepository repository, UsuarioAtualService usuarioAtual) {
		this.repository = repository;
		this.usuarioAtual = usuarioAtual;
	}

	public boolean podeAcessar(String referencia) {
		var usuario = usuarioAtual.atual();
		if (usuario.perfil() != PerfilUsuario.OPERADOR) return true;
		return repository.findByReferencia(referencia)
				.map(c -> usuario.identificador().equalsIgnoreCase(c.getResponsavelIdentificador()))
				.orElse(false);
	}

	public boolean podeAcessarCliente(String cpf) {
		var usuario = usuarioAtual.atual();
		if (usuario.perfil() != PerfilUsuario.OPERADOR) return true;
		return repository.findByCpfAgregadorOrderByCriadaEmDesc(cpf).stream()
				.anyMatch(c -> usuario.identificador().equalsIgnoreCase(c.getResponsavelIdentificador()));
	}
}
