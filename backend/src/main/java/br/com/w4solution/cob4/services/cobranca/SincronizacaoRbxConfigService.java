package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.SincronizacaoRbxConfig;
import br.com.w4solution.cob4.dto.cobranca.SincronizacaoRbxConfigDTO;
import br.com.w4solution.cob4.repositories.SincronizacaoRbxConfigRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;

@Service
public class SincronizacaoRbxConfigService {
	private final SincronizacaoRbxConfigRepository repository;
	public SincronizacaoRbxConfigService(SincronizacaoRbxConfigRepository repository) { this.repository = repository; }

	@Transactional
	public SincronizacaoRbxConfig obterEntidade() {
		return repository.findById(1L).orElseGet(() -> repository.save(new SincronizacaoRbxConfig()));
	}
	@Transactional(readOnly = true)
	public SincronizacaoRbxConfigDTO consultar() {
		var c = repository.findById(1L).orElse(new SincronizacaoRbxConfig());
		return dto(c);
	}
	@Transactional
	public SincronizacaoRbxConfigDTO salvar(SincronizacaoRbxConfigDTO dados) {
		ZoneId.of(dados.fusoHorario());
		if (!dados.horarioPrimeira().isBefore(dados.horarioSegunda())) {
			throw new IllegalArgumentException("O primeiro horário deve ser anterior ao segundo");
		}
		var c = obterEntidade();
		c.setHorarioPrimeira(dados.horarioPrimeira().withSecond(0).withNano(0));
		c.setHorarioSegunda(dados.horarioSegunda().withSecond(0).withNano(0));
		c.setFusoHorario(dados.fusoHorario().trim()); c.setAtivo(dados.ativo());
		return dto(repository.save(c));
	}
	private SincronizacaoRbxConfigDTO dto(SincronizacaoRbxConfig c) {
		return new SincronizacaoRbxConfigDTO(c.getHorarioPrimeira(), c.getHorarioSegunda(),
				c.getFusoHorario(), c.isAtivo());
	}
}
