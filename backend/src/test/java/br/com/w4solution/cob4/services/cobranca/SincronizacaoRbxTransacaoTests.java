package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.FaixaAtrasoConfig;
import br.com.w4solution.cob4.dto.cliente.ClienteRbxDTO;
import br.com.w4solution.cob4.dto.rbx.BoletosAbertos;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.services.rbx.ServiceRbx;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
class SincronizacaoRbxTransacaoTests {
	@Autowired CobrancaService service;
	@Autowired ClienteRepository clienteRepository;
	@Autowired CobrancaRepository cobrancaRepository;
	@Autowired CobrancaBoletoRepository boletoRepository;
	@MockitoBean ServiceRbx serviceRbx;
	@MockitoBean FaixaAtrasoConfigService faixaService;
	@MockitoSpyBean LogAuditoriaRepository logRepository;

	@Test
	void falhaParcialFazRollbackIntegralEPermiteReprocessamento() {
		long clientesAntes = clienteRepository.count();
		long cobrancasAntes = cobrancaRepository.count();
		long boletosAntes = boletoRepository.count();
		var cliente = new ClienteRbxDTO("TX-1", "Teste Transacao", null, null, "91999990000",
				null, null, null, null, null, null, null, null, "B", "12345678900", "tx@example.com");
		var boleto = new BoletosAbertos(50, "TX-1", LocalDate.now().minusDays(2).toString(),
				"DOC-TX", "CON-TX", "CON-TX", "Teste Transacao", "12345678900",
				"91999990000", null, null, "99", "1");
		when(serviceRbx.buscarTodosClientes()).thenReturn(List.of(cliente));
		when(serviceRbx.buscarTodosBoletosAbertos()).thenReturn(List.of(boleto));
		var faixa = new FaixaAtrasoConfig();
		faixa.setCodigo("F1_RECENTE");
		faixa.setPrioridade(Cobranca.Prioridade.BAIXA);
		when(faixaService.classificar(anyInt())).thenReturn(faixa);
		doThrow(new IllegalStateException("falha depois das escritas")).when(logRepository).saveAll(any());

		assertThatThrownBy(service::sincronizarInadimplentes).hasMessageContaining("falha depois das escritas");
		assertThat(clienteRepository.count()).isEqualTo(clientesAntes);
		assertThat(cobrancaRepository.count()).isEqualTo(cobrancasAntes);
		assertThat(boletoRepository.count()).isEqualTo(boletosAntes);

		reset(logRepository);
		var reprocessado = service.sincronizarInadimplentes();
		assertThat(reprocessado.boletosCriados()).isEqualTo(1);
	}
}
