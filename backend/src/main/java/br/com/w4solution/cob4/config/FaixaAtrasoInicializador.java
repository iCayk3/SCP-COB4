package br.com.w4solution.cob4.config;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.FaixaAtrasoConfig;
import br.com.w4solution.cob4.repositories.FaixaAtrasoConfigRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FaixaAtrasoInicializador implements ApplicationRunner {
	private final FaixaAtrasoConfigRepository repository;
	public FaixaAtrasoInicializador(FaixaAtrasoConfigRepository repository) { this.repository = repository; }

	@Override
	public void run(ApplicationArguments args) {
		if (repository.count() > 0) return;
		repository.saveAll(List.of(
				f("F1_RECENTE", "Recente", 1, 1, 7, Cobranca.Prioridade.BAIXA),
				f("F2_INICIAL", "Inicial", 2, 8, 15, Cobranca.Prioridade.MEDIA),
				f("F3_INTERMEDIARIO", "Intermediário", 3, 16, 30, Cobranca.Prioridade.ALTA),
				f("F4_AVANCADO", "Avançado", 4, 31, 60, Cobranca.Prioridade.ALTA),
				f("F5_CRITICO", "Crítico", 5, 61, 90, Cobranca.Prioridade.CRITICA),
				f("F6_JURIDICO", "Jurídico", 6, 91, null, Cobranca.Prioridade.CRITICA)
		));
	}

	private FaixaAtrasoConfig f(String codigo, String nome, int ordem, int inicio, Integer fim,
								 Cobranca.Prioridade prioridade) {
		var faixa = new FaixaAtrasoConfig();
		faixa.setCodigo(codigo); faixa.setNome(nome); faixa.setOrdem(ordem);
		faixa.setDiasInicio(inicio); faixa.setDiasFim(fim); faixa.setPrioridade(prioridade);
		return faixa;
	}
}
