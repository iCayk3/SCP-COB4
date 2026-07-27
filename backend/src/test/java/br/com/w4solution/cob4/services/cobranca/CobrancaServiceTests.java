package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.Cliente;
import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.CobrancaBoleto;
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
import java.util.concurrent.atomic.AtomicReference;

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

	@Test
	void agregaDoisBoletosDoMesmoCpfEmUmaUnicaCobranca() {
		ClienteRbxDTO clienteRbx = new ClienteRbxDTO(
				"10", "Maria Teste", null, null, "(91) 99999-0000",
				null, null, null, null, null, null, null, null, "B",
				"123.456.789-00", "maria@example.com");
		String ontem = LocalDate.now().minusDays(1).toString();
		when(serviceRbx.buscarTodosClientes()).thenReturn(List.of(clienteRbx));
		when(serviceRbx.buscarTodosBoletosAbertos()).thenReturn(List.of(
				new BoletosAbertos(100, "10", ontem, "DOC-1", "CON-1", "CON-VINC-1",
						"Maria Teste", "12345678900", "(91) 99999-0000", null, null, "1", "1"),
				new BoletosAbertos(200, "10", ontem, "DOC-2", "CON-2", "CON-VINC-2",
						"Maria Teste", "12345678900", "(91) 99999-0000", null, null, "1", "1")));
		when(clienteRepository.findAllByCpfIn(any())).thenReturn(List.of());
		when(cobrancaRepository.findByStatusOrderByAtualizadaEmDesc(Cobranca.Status.ABERTA)).thenReturn(List.of());
		when(boletoRepository.findAllByRbxDocumentoIn(any())).thenReturn(List.of());
		when(historicoRepository.findAllByBoletoReferenciaIn(any())).thenReturn(List.of());

		when(clienteRepository.saveAll(any())).thenAnswer(invocation -> {
			List<Cliente> clientes = copiar(invocation.getArgument(0));
			clientes.forEach(cliente -> cliente.setId(1L));
			return clientes;
		});
		AtomicReference<Cobranca> cobrancaSalva = new AtomicReference<>();
		when(cobrancaRepository.saveAll(any())).thenAnswer(invocation -> {
			List<Cobranca> cobrancas = copiar(invocation.getArgument(0));
			cobrancas.forEach(cobranca -> {
				cobranca.setId(1L);
				cobrancaSalva.set(cobranca);
			});
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
				boletoRepository, historicoRepository, logRepository, timelineRepository, tarefaRepository);
		SincronizacaoCobrancaDTO resultado = service.sincronizarInadimplentes();

		assertThat(resultado.cobrancasCriadas()).isEqualTo(1);
		assertThat(resultado.boletosCriados()).isEqualTo(2);
		assertThat(resultado.valorTotalProcessado()).isEqualByComparingTo("300.00");
		assertThat(cobrancaSalva.get().getValorTotal()).isEqualByComparingTo("300.00");
		assertThat(cobrancaSalva.get().getCpfAgregador()).isEqualTo("12345678900");
	}

	private static <T> List<T> copiar(Iterable<T> valores) {
		List<T> resultado = new ArrayList<>();
		valores.forEach(resultado::add);
		return resultado;
	}
}
