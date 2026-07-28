package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.FaixaAtrasoConfig;
import br.com.w4solution.cob4.dto.cobranca.FaixaAtrasoConfigDTO;
import br.com.w4solution.cob4.repositories.FaixaAtrasoConfigRepository;
import br.com.w4solution.cob4.repositories.CobrancaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FaixaAtrasoConfigService {
	private final FaixaAtrasoConfigRepository repository;
	private final CobrancaRepository cobrancaRepository;

	public FaixaAtrasoConfigService(FaixaAtrasoConfigRepository repository,
									CobrancaRepository cobrancaRepository) {
		this.repository = repository;
		this.cobrancaRepository = cobrancaRepository;
	}

	@Transactional(readOnly = true)
	public List<FaixaAtrasoConfigDTO> listar() {
		return repository.findAllByOrderByOrdemAsc().stream().map(this::dto).toList();
	}

	@Transactional
	public List<FaixaAtrasoConfigDTO> salvar(List<FaixaAtrasoConfigDTO> dados) {
		validar(dados);
		var atuais = repository.findAllByOrderByOrdemAsc();
		for (int i = 0; i < dados.size(); i++) {
			var entrada = dados.get(i);
			var faixa = atuais.get(i);
			if (!faixa.getCodigo().equals(entrada.codigo())) {
				throw new IllegalArgumentException("O código das faixas não pode ser alterado");
			}
			faixa.setNome(entrada.nome().trim());
			faixa.setDiasInicio(entrada.diasInicio());
			faixa.setDiasFim(entrada.diasFim());
			faixa.setPrioridade(entrada.prioridade());
		}
		repository.saveAll(atuais);
		for (var protocolo : cobrancaRepository.findByStatusInOrderByAtualizadaEmDesc(
				List.of(Cobranca.Status.ABERTA, Cobranca.Status.EM_ANDAMENTO))) {
			var faixa = atuais.stream()
					.filter(f -> protocolo.getDiasAtraso() >= f.getDiasInicio()
							&& (f.getDiasFim() == null || protocolo.getDiasAtraso() <= f.getDiasFim()))
					.findFirst().orElseThrow();
			protocolo.setFaixaAtraso(Cobranca.FaixaAtraso.valueOf(faixa.getCodigo()));
			protocolo.setPrioridade(faixa.getPrioridade());
		}
		return listar();
	}

	@Transactional(readOnly = true)
	public FaixaAtrasoConfig classificar(int dias) {
		return repository.findAllByOrderByOrdemAsc().stream()
				.filter(f -> dias >= f.getDiasInicio() && (f.getDiasFim() == null || dias <= f.getDiasFim()))
				.findFirst().orElseThrow(() -> new IllegalStateException("Nenhuma faixa configurada para " + dias + " dias"));
	}

	private void validar(List<FaixaAtrasoConfigDTO> dados) {
		if (dados == null || dados.size() != 6) {
			throw new IllegalArgumentException("As seis faixas operacionais devem ser informadas");
		}
		int inicioEsperado = 1;
		for (int i = 0; i < dados.size(); i++) {
			var faixa = dados.get(i);
			if (faixa.ordem() != i + 1 || faixa.diasInicio() != inicioEsperado) {
				throw new IllegalArgumentException("As faixas devem ser contínuas, ordenadas e começar no dia 1");
			}
			boolean ultima = i == dados.size() - 1;
			if (ultima && faixa.diasFim() != null) {
				throw new IllegalArgumentException("A última faixa deve ser aberta, sem dia final");
			}
			if (!ultima && (faixa.diasFim() == null || faixa.diasFim() < faixa.diasInicio())) {
				throw new IllegalArgumentException("Informe um dia final válido para " + faixa.codigo());
			}
			if (!ultima) inicioEsperado = faixa.diasFim() + 1;
		}
	}

	private FaixaAtrasoConfigDTO dto(FaixaAtrasoConfig f) {
		return new FaixaAtrasoConfigDTO(f.getId(), f.getCodigo(), f.getNome(), f.getOrdem(),
				f.getDiasInicio(), f.getDiasFim(), f.getPrioridade());
	}
}
