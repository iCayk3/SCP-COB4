package br.com.w4solution.cob4.services.fluxo;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.fluxo.AlterarEstadoDTO;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.services.catalogo.MotivoCatalogoService;
import br.com.w4solution.cob4.security.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EstadoProcessoServiceTests {
	@Mock CobrancaRepository cobrancaRepository;
	@Mock FluxoCobrancaRepository fluxoRepository;
	@Mock FluxoEstadoRepository estadoRepository;
	@Mock FluxoTransicaoRepository transicaoRepository;
	@Mock ProcessoTimelineRepository timelineRepository;
	@Mock MotivoCatalogoService motivoService;
	@Mock UsuarioAtualService usuarioAtualService;

	@Test void visitaEhBloqueadaAntesDaFaixaF4() {
		when(usuarioAtualService.atual()).thenReturn(new UsuarioAutenticado(1L, "Op", "op", PerfilUsuario.OPERADOR));
		var c = new Cobranca(); c.setReferencia("P1"); c.setFluxoCodigo("PADRAO"); c.setEstadoFluxo("NOVO");
		c.setFaixaAtraso(Cobranca.FaixaAtraso.F3_INTERMEDIARIO);
		var fluxo = new FluxoCobranca(); fluxo.setId(1L); fluxo.setCodigo("PADRAO");
		when(cobrancaRepository.findByReferencia("P1")).thenReturn(Optional.of(c));
		when(fluxoRepository.findByCodigo("PADRAO")).thenReturn(Optional.of(fluxo));
		var service = new EstadoProcessoService(cobrancaRepository, fluxoRepository, estadoRepository,
				transicaoRepository, timelineRepository, motivoService, usuarioAtualService);
		assertThatThrownBy(() -> service.alterar("P1",
				new AlterarEstadoDTO("VISITA", "Op", "op", "SEM_CONTATO", null)))
				.isInstanceOf(IllegalStateException.class).hasMessageContaining("exige a faixa F4");
		verifyNoInteractions(motivoService);
	}

	@Test void visitaEhPermitidaDepoisDeSemContatoMesmoAntesDaFaixaF4() {
		when(usuarioAtualService.atual()).thenReturn(new UsuarioAutenticado(1L, "Op", "op", PerfilUsuario.OPERADOR));
		var c = new Cobranca(); c.setReferencia("P1"); c.setFluxoCodigo("PADRAO"); c.setEstadoFluxo("SEM_CONTATO");
		c.setStatus(Cobranca.Status.ABERTA); c.setFaixaAtraso(Cobranca.FaixaAtraso.F3_INTERMEDIARIO);
		var fluxo = new FluxoCobranca(); fluxo.setId(1L); fluxo.setCodigo("PADRAO");
		var transicao = new FluxoTransicao(); transicao.setOrigemCodigo("SEM_CONTATO"); transicao.setDestinoCodigo("VISITA");
		var motivo = new MotivoCatalogo(); motivo.setCodigo("SEM_CONTATO"); motivo.setNome("Sem contato");
		var estado = new FluxoEstado(); estado.setCodigo("VISITA"); estado.setNome("Visita");
		when(cobrancaRepository.findByReferencia("P1")).thenReturn(Optional.of(c));
		when(fluxoRepository.findByCodigo("PADRAO")).thenReturn(Optional.of(fluxo));
		when(transicaoRepository.findByFluxoIdAndOrigemCodigoAndDestinoCodigo(1L, "SEM_CONTATO", "VISITA"))
				.thenReturn(Optional.of(transicao));
		when(motivoService.tipoParaDestino("VISITA")).thenReturn(MotivoCatalogo.Tipo.VISITA);
		when(motivoService.validarAtivo(MotivoCatalogo.Tipo.VISITA, "SEM_CONTATO", null)).thenReturn(motivo);
		when(estadoRepository.findByFluxoIdAndCodigo(1L, "VISITA")).thenReturn(Optional.of(estado));
		when(transicaoRepository.findByFluxoIdAndOrigemCodigoOrderByIdAsc(1L, "VISITA")).thenReturn(List.of());
		var service = new EstadoProcessoService(cobrancaRepository, fluxoRepository, estadoRepository,
				transicaoRepository, timelineRepository, motivoService, usuarioAtualService);
		var resultado = service.alterar("P1",
				new AlterarEstadoDTO("VISITA", "Op", "op", "SEM_CONTATO", null));
		assertThat(resultado.estadoCodigo()).isEqualTo("VISITA");
		assertThat(c.getEstadoFluxo()).isEqualTo("VISITA");
	}
}
