package br.com.w4solution.cob4.services.lgpd;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.lgpd.SolicitacaoPrivacidadeDTO;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.security.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.OffsetDateTime;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PrivacidadeServiceTests {
	@Mock ClienteRepository clienteRepository;
	@Mock CobrancaRepository cobrancaRepository;
	@Mock HistoricoAtrasoRepository historicoRepository;
	@Mock PoliticaLgpdRepository politicaRepository;
	@Mock LogAuditoriaRepository logRepository;
	private final AutorizacaoService autorizacao = new AutorizacaoService();

	@Test void bloqueiaAnonimizacaoComPoliticasPendentes() {
		when(politicaRepository.count()).thenReturn(2L);
		when(politicaRepository.countByStatusAprovacao(PoliticaLgpd.StatusAprovacao.APROVADA)).thenReturn(1L);
		assertThatThrownBy(() -> service().anonimizar(pedido(PerfilUsuario.ADMINISTRADOR, "ANONIMIZAR")))
				.isInstanceOf(IllegalStateException.class).hasMessageContaining("políticas LGPD");
		verifyNoInteractions(clienteRepository);
	}
	@Test void exigeConfirmacaoLiteralParaAnonimizar() {
		assertThatThrownBy(() -> service().anonimizar(pedido(PerfilUsuario.ADMINISTRADOR, "SIM")))
				.isInstanceOf(IllegalArgumentException.class).hasMessageContaining("Confirmação");
	}
	@Test void operadorNaoPodeExportarDadosDoTitular() {
		assertThatThrownBy(() -> service().exportar(pedido(PerfilUsuario.OPERADOR, null)))
				.isInstanceOf(SecurityException.class);
	}
	@Test void anonimizaIdentificadoresESalvaLogSemCpf() {
		when(politicaRepository.count()).thenReturn(2L);
		when(politicaRepository.countByStatusAprovacao(PoliticaLgpd.StatusAprovacao.APROVADA)).thenReturn(2L);
		var cliente = new Cliente(); cliente.setCpf("12345678900"); cliente.setNomeCompleto("Maria");
		cliente.setTelefone("9999"); cliente.setEmail("maria@teste"); cliente.setAtualizadoEm(OffsetDateTime.now());
		when(clienteRepository.findByCpf("12345678900")).thenReturn(Optional.of(cliente));
		String novo = service().anonimizar(pedido(PerfilUsuario.ADMINISTRADOR, "ANONIMIZAR"));
		assertThat(novo).startsWith("ANON-").hasSize(14);
		assertThat(cliente.getNomeCompleto()).isEqualTo("Titular anonimizado");
		assertThat(cliente.getTelefone()).isNull();
		verify(logRepository).save(argThat(log -> log.getCpf() == null
				&& !log.getDescricao().contains("12345678900")));
	}
	private PrivacidadeService service() {
		return new PrivacidadeService(clienteRepository, cobrancaRepository, historicoRepository,
				politicaRepository, logRepository, autorizacao);
	}
	private SolicitacaoPrivacidadeDTO pedido(PerfilUsuario perfil, String confirmacao) {
		return new SolicitacaoPrivacidadeDTO("12345678900", "Solicitação do titular", "admin", perfil, confirmacao);
	}
}
