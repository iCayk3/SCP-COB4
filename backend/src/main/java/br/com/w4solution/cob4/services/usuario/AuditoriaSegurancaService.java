package br.com.w4solution.cob4.services.usuario;

import br.com.w4solution.cob4.domain.LogAuditoria;
import br.com.w4solution.cob4.repositories.LogAuditoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class AuditoriaSegurancaService {
	private final LogAuditoriaRepository repository;

	public AuditoriaSegurancaService(LogAuditoriaRepository repository) {
		this.repository = repository;
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void registrar(String evento, String nome, String identificador, String descricao) {
		LogAuditoria log = new LogAuditoria();
		log.setEvento(evento);
		log.setUsuarioNome(nome);
		log.setUsuarioIdentificador(identificador);
		log.setDescricao(descricao);
		log.setCriadoEm(OffsetDateTime.now());
		repository.save(log);
	}
}
