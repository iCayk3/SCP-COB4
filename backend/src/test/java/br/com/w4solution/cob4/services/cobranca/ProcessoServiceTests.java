package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.cobranca.*;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.security.*;
import br.com.w4solution.cob4.services.catalogo.MotivoCatalogoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import java.time.OffsetDateTime;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProcessoServiceTests {
	@Mock CobrancaRepository cobrancaRepository;
	@Mock ProcessoTimelineRepository timelineRepository;
	@Mock MotivoCatalogoService motivoService;
	@Mock UsuarioAtualService usuarioAtual;
	private AutorizacaoService autorizacao;

	@BeforeEach void configurar() {
		autorizacao = new AutorizacaoService(usuarioAtual);
	}

	@Test void encerramentoExigePerfilAutorizado() {
		when(usuarioAtual.atual()).thenReturn(new UsuarioAutenticado(1L, "Op", "op", PerfilUsuario.OPERADOR));
		var service = new ProcessoService(cobrancaRepository, timelineRepository, motivoService, autorizacao);
		var dto = new EncerrarProcessoDTO("PAGAMENTO", null);
		assertThatThrownBy(() -> service.encerrar("P1", dto)).isInstanceOf(AccessDeniedException.class);
		verifyNoInteractions(cobrancaRepository);
	}
	@Test void encerramentoPreservaCodigoENomeDoMotivo() {
		when(usuarioAtual.atual()).thenReturn(new UsuarioAutenticado(2L, "Sup", "sup", PerfilUsuario.SUPERVISOR));
		var c = processoAberto();
		var motivo = motivo(MotivoCatalogo.Tipo.ENCERRAMENTO, "PAGAMENTO", "Pagamento confirmado");
		when(cobrancaRepository.findByReferencia("P1")).thenReturn(Optional.of(c));
		when(motivoService.validarAtivo(MotivoCatalogo.Tipo.ENCERRAMENTO, "PAGAMENTO", "Baixa RBX"))
				.thenReturn(motivo);
		new ProcessoService(cobrancaRepository, timelineRepository, motivoService, autorizacao).encerrar("P1",
				new EncerrarProcessoDTO("PAGAMENTO", "Baixa RBX"));
		assertThat(c.getMotivoEncerramentoCodigo()).isEqualTo("PAGAMENTO");
		assertThat(c.getMotivoEncerramentoNome()).isEqualTo("Pagamento confirmado");
		verify(timelineRepository).save(argThat(t -> t.getDescricao().contains("[PAGAMENTO]")));
	}
	@Test void supervisorReabreComMotivoControlado() {
		when(usuarioAtual.atual()).thenReturn(new UsuarioAutenticado(2L, "Sup", "sup", PerfilUsuario.SUPERVISOR));
		var c = processoAberto(); c.setStatus(Cobranca.Status.ENCERRADA); c.setEncerradaEm(OffsetDateTime.now());
		var motivo = motivo(MotivoCatalogo.Tipo.REABERTURA, "ESTORNO", "Baixa estornada");
		when(cobrancaRepository.findByReferencia("P1")).thenReturn(Optional.of(c));
		when(motivoService.validarAtivo(MotivoCatalogo.Tipo.REABERTURA, "ESTORNO", "Estorno RBX"))
				.thenReturn(motivo);
		new ProcessoService(cobrancaRepository, timelineRepository, motivoService, autorizacao).reabrir("P1",
				new ReabrirProcessoDTO("ESTORNO", "Estorno RBX"));
		assertThat(c.getStatus()).isEqualTo(Cobranca.Status.EM_ANDAMENTO);
		assertThat(c.getEncerradaEm()).isNull();
		assertThat(c.getMotivoReaberturaCodigo()).isEqualTo("ESTORNO");
	}
	private Cobranca processoAberto() {
		var c = new Cobranca(); c.setStatus(Cobranca.Status.ABERTA); c.setEstadoFluxo("NOVO");
		c.setResponsavelNome("Sup"); c.setResponsavelIdentificador("sup"); return c;
	}
	private MotivoCatalogo motivo(MotivoCatalogo.Tipo tipo, String codigo, String nome) {
		var m = new MotivoCatalogo(); m.setTipo(tipo); m.setCodigo(codigo); m.setNome(nome); m.setAtivo(true); return m;
	}
}
