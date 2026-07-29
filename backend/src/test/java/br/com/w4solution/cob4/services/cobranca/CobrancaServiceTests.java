package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.Cliente;
import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.CobrancaBoleto;
import br.com.w4solution.cob4.domain.FaixaAtrasoConfig;
import br.com.w4solution.cob4.dto.cliente.ClienteRbxDTO;
import br.com.w4solution.cob4.dto.cobranca.SincronizacaoCobrancaDTO;
import br.com.w4solution.cob4.dto.rbx.BoletosAbertos;
import br.com.w4solution.cob4.repositories.ClienteRepository;
import br.com.w4solution.cob4.repositories.CobrancaBoletoRepository;
import br.com.w4solution.cob4.repositories.CobrancaRepository;
import br.com.w4solution.cob4.repositories.HistoricoAtrasoRepository;
import br.com.w4solution.cob4.repositories.LogAuditoriaRepository;
import br.com.w4solution.cob4.repositories.ProcessoTimelineRepository;
import br.com.w4solution.cob4.repositories.TarefaCobrancaRepository;
import br.com.w4solution.cob4.services.rbx.ServiceRbx;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CobrancaServiceTests {
	@Mock ServiceRbx serviceRbx;
	@Mock ClienteRepository clienteRepository;
	@Mock CobrancaRepository cobrancaRepository;
	@Mock CobrancaBoletoRepository boletoRepository;
	@Mock HistoricoAtrasoRepository historicoRepository;
	@Mock LogAuditoriaRepository logRepository;
	@Mock ProcessoTimelineRepository timelineRepository;
	@Mock TarefaCobrancaRepository tarefaRepository;
	@Mock FaixaAtrasoConfigService faixaAtrasoService;

	@Test
	void criaUmProtocoloPorContratoSemDuplicarDocumentoRepetido() {
		ClienteRbxDTO clienteRbx = new ClienteRbxDTO(
				"10", "Maria Teste", null, null, "(91) 99999-0000",
				null, null, null, null, null, null, null, null, "B",
				"123.456.789-00", "maria@example.com");
		String ontem = LocalDate.now().minusDays(1).toString();
		when(serviceRbx.buscarTodosClientes()).thenReturn(List.of(clienteRbx));
		when(serviceRbx.buscarTodosBoletosAbertos()).thenReturn(List.of(
				new BoletosAbertos(100, "10", ontem, "DOC-1", "CON-1", "CON-VINC-1",
						"Maria Teste", "12345678900", "(91) 99999-0000", null, null, "1", "1"),
				new BoletosAbertos(100, "10", ontem, "DOC-1", "CON-1", "CON-VINC-1",
						"Maria Teste", "12345678900", "(91) 99999-0000", null, null, "1", "1"),
				new BoletosAbertos(200, "10", ontem, "DOC-2", "CON-2", "CON-VINC-2",
						"Maria Teste", "12345678900", "(91) 99999-0000", null, null, "1", "1")));
		when(clienteRepository.findAllByCpfIn(any())).thenReturn(List.of());
		when(boletoRepository.findAllByRbxDocumentoIn(any())).thenReturn(List.of());
		when(historicoRepository.findAllByBoletoReferenciaIn(any())).thenReturn(List.of());
		when(faixaAtrasoService.classificar(1)).thenReturn(faixa(
				"F1_RECENTE", Cobranca.Prioridade.BAIXA));

		when(clienteRepository.saveAll(any())).thenAnswer(invocation -> {
			List<Cliente> clientes = copiar(invocation.getArgument(0));
			clientes.forEach(cliente -> cliente.setId(1L));
			return clientes;
		});
		List<Cobranca> cobrancasSalvas = new ArrayList<>();
		when(cobrancaRepository.saveAll(any())).thenAnswer(invocation -> {
			List<Cobranca> cobrancas = copiar(invocation.getArgument(0));
			cobrancas.forEach(cobranca -> {
				if (cobranca.getId() == null) cobranca.setId((long) cobrancasSalvas.size() + 1);
			});
			cobrancasSalvas.clear();
			cobrancasSalvas.addAll(cobrancas);
			return cobrancas;
		});
		when(boletoRepository.saveAll(any())).thenAnswer(invocation -> {
			List<CobrancaBoleto> boletos = copiar(invocation.getArgument(0));
			for (int indice = 0; indice < boletos.size(); indice++) {
				boletos.get(indice).setId((long) indice + 1);
			}
			return boletos;
		});

		CobrancaService service = new CobrancaService(serviceRbx, clienteRepository, cobrancaRepository,
				boletoRepository, historicoRepository, logRepository, timelineRepository, tarefaRepository,
				faixaAtrasoService);
		SincronizacaoCobrancaDTO resultado = service.sincronizarInadimplentes();

		assertThat(resultado.cobrancasCriadas()).isEqualTo(2);
		assertThat(resultado.boletosCriados()).isEqualTo(2);
		assertThat(resultado.documentosRecebidos()).isEqualTo(3);
		assertThat(resultado.valorTotalProcessado()).isEqualByComparingTo("300.00");
		assertThat(cobrancasSalvas).extracting(Cobranca::getContratoReferencia)
				.containsExactlyInAnyOrder("CON-VINC-1", "CON-VINC-2");
		assertThat(cobrancasSalvas).extracting(Cobranca::getValorTotal)
				.containsExactlyInAnyOrder(new java.math.BigDecimal("100.00"), new java.math.BigDecimal("200.00"));
		assertThat(cobrancasSalvas).allMatch(c -> "12345678900".equals(c.getCpfAgregador()));
		assertThat(cobrancasSalvas).allMatch(c -> c.getFaixaAtraso() == Cobranca.FaixaAtraso.F1_RECENTE);
	}

	@Test
	void classificaFaixasPeloTituloMaisAntigo() {
		CobrancaService service = new CobrancaService(serviceRbx, clienteRepository, cobrancaRepository,
				boletoRepository, historicoRepository, logRepository, timelineRepository, tarefaRepository,
				faixaAtrasoService);
		Cobranca protocolo = new Cobranca();

		protocolo.setDiasAtraso(31);
		when(faixaAtrasoService.classificar(31)).thenReturn(faixa(
				"F4_AVANCADO", Cobranca.Prioridade.ALTA));
		service.aplicarPoliticaAtraso(protocolo);
		assertThat(protocolo.getFaixaAtraso()).isEqualTo(Cobranca.FaixaAtraso.F4_AVANCADO);
		assertThat(protocolo.getPrioridade()).isEqualTo(Cobranca.Prioridade.ALTA);

		protocolo.setDiasAtraso(91);
		when(faixaAtrasoService.classificar(91)).thenReturn(faixa(
				"F6_JURIDICO", Cobranca.Prioridade.CRITICA));
		service.aplicarPoliticaAtraso(protocolo);
		assertThat(protocolo.getFaixaAtraso()).isEqualTo(Cobranca.FaixaAtraso.F6_JURIDICO);
		assertThat(protocolo.getPrioridade()).isEqualTo(Cobranca.Prioridade.CRITICA);
	}

	private static FaixaAtrasoConfig faixa(String codigo, Cobranca.Prioridade prioridade) {
		var faixa = new FaixaAtrasoConfig();
		faixa.setCodigo(codigo);
		faixa.setPrioridade(prioridade);
		return faixa;
	}

	private static <T> List<T> copiar(Iterable<T> valores) {
		List<T> resultado = new ArrayList<>();
		valores.forEach(resultado::add);
		return resultado;
	}
}
