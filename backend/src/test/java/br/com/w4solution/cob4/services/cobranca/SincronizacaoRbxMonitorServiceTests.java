package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.SincronizacaoRbxExecucao;
import br.com.w4solution.cob4.dto.cobranca.SincronizacaoCobrancaDTO;
import br.com.w4solution.cob4.repositories.SincronizacaoRbxExecucaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SincronizacaoRbxMonitorServiceTests {
	@Mock CobrancaService cobrancaService;
	@Mock SincronizacaoRbxExecucaoRepository repository;
	@Mock FilaFalhasRbxService fila;
	private SincronizacaoRbxMonitorService monitor;

	@BeforeEach
	void preparar() {
		monitor = spy(new SincronizacaoRbxMonitorService(cobrancaService, repository, fila, new ObjectMapper()));
		ReflectionTestUtils.setField(monitor, "maxTentativas", 3);
		ReflectionTestUtils.setField(monitor, "backoffInicialMs", 100L);
		ReflectionTestUtils.setField(monitor, "backoffMaxMs", 1_000L);
		lenient().doNothing().when(monitor).aguardar(anyLong());
	}

	@Test
	void recuperaFalhaTransitoriaComBackoffExponencial() {
		var esperado = new SincronizacaoCobrancaDTO(1, 1, 0, 1, 1, 0, BigDecimal.TEN);
		when(cobrancaService.sincronizarInadimplentes())
				.thenThrow(new IllegalStateException("indisponivel"))
				.thenThrow(new IllegalStateException("timeout"))
				.thenReturn(esperado);

		assertThat(monitor.sincronizar("teste")).isSameAs(esperado);
		verify(monitor).aguardar(100);
		verify(monitor).aguardar(200);
		verifyNoInteractions(fila);
		ArgumentCaptor<SincronizacaoRbxExecucao> captor =
				ArgumentCaptor.forClass(SincronizacaoRbxExecucao.class);
		verify(repository).save(captor.capture());
		assertThat(captor.getValue().getStatus()).isEqualTo(SincronizacaoRbxExecucao.Status.SUCESSO);
	}

	@Test
	void enviaParaFilaPersistenteDepoisDeEsgotarRetries() {
		var erro = new IllegalStateException("RBX fora do ar");
		when(cobrancaService.sincronizarInadimplentes()).thenThrow(erro);

		assertThatThrownBy(() -> monitor.sincronizar("agendada")).isSameAs(erro);
		verify(cobrancaService, times(3)).sincronizarInadimplentes();
		verify(fila).enfileirar("agendada", erro);
		ArgumentCaptor<SincronizacaoRbxExecucao> captor =
				ArgumentCaptor.forClass(SincronizacaoRbxExecucao.class);
		verify(repository).save(captor.capture());
		assertThat(captor.getValue().getStatus()).isEqualTo(SincronizacaoRbxExecucao.Status.FALHA);
	}

	@Test
	void replayComMesmaChaveRetornaResultadoPersistidoSemConsultarRbx() throws Exception {
		var esperado = new SincronizacaoCobrancaDTO(2, 2, 0, 1, 1, 1, BigDecimal.TEN);
		var execucao = new SincronizacaoRbxExecucao();
		execucao.setResultadoJson(new ObjectMapper().writeValueAsString(esperado));
		when(repository.findFirstByChaveIdempotenciaAndStatusOrderByIdDesc(
				"replay-123", SincronizacaoRbxExecucao.Status.SUCESSO)).thenReturn(java.util.Optional.of(execucao));

		assertThat(monitor.sincronizar("manual", " replay-123 ")).isEqualTo(esperado);
		verifyNoInteractions(cobrancaService, fila);
	}
}
