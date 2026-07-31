package br.com.w4solution.cob4.config;

import br.com.w4solution.cob4.dto.financeiro.AlcadaDescontoDTO;
import br.com.w4solution.cob4.dto.financeiro.PoliticaFinanceiraDTO;
import br.com.w4solution.cob4.repositories.PoliticaFinanceiraRepository;
import br.com.w4solution.cob4.security.PerfilUsuario;
import br.com.w4solution.cob4.services.financeiro.PoliticaFinanceiraService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

import static br.com.w4solution.cob4.domain.PoliticaFinanceira.*;

@Component
public class PoliticaFinanceiraInicializador implements ApplicationRunner {
	private final PoliticaFinanceiraRepository repository;
	private final PoliticaFinanceiraService service;

	public PoliticaFinanceiraInicializador(PoliticaFinanceiraRepository repository, PoliticaFinanceiraService service) {
		this.repository = repository;
		this.service = service;
	}

	@Override
	public void run(ApplicationArguments args) {
		if (repository.count() > 0) return;
		var alcadas = List.of(
				alcada(PerfilUsuario.OPERADOR, "0", true),
				alcada(PerfilUsuario.SUPERVISOR, "5", false),
				alcada(PerfilUsuario.GERENTE, "10", false),
				alcada(PerfilUsuario.FINANCEIRO, "10", false),
				alcada(PerfilUsuario.ADMINISTRADOR, "100", false));
		service.publicar(new PoliticaFinanceiraDTO(null, null, null,
				TipoJuros.SIMPLES, new BigDecimal("1.00"), PeriodicidadeJuros.MENSAL,
				InicioEncargos.DIA_SEGUINTE, 0, false, null,
				TipoMulta.PERCENTUAL, new BigDecimal("2.00"), null, InicioEncargos.DIA_SEGUINTE,
				0, false, 2, MetodoArredondamento.MEIO_PARA_CIMA, MomentoArredondamento.POR_PARCELA,
				DestinoCentavos.ULTIMA_PARCELA, 12, new BigDecimal("50.00"), 30,
				AjusteDiaNaoUtil.PROXIMO_DIA_UTIL, false, BigDecimal.ZERO, BigDecimal.ZERO, 3, 30,
				true, true, 7, 3, 1, true, true, 3, alcadas, null, null), "SISTEMA");
	}

	private AlcadaDescontoDTO alcada(PerfilUsuario perfil, String percentual, boolean aprovacao) {
		return new AlcadaDescontoDTO(perfil, new BigDecimal(percentual), null, perfil != PerfilUsuario.OPERADOR,
				true, true, aprovacao);
	}
}
