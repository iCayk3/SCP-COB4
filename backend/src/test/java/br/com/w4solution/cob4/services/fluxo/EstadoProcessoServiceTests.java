package br.com.w4solution.cob4.services.fluxo;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.fluxo.AlterarEstadoDTO;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.services.catalogo.MotivoCatalogoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
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

	@Test void visitaEhBloqueadaAntesDaFaixaF4() {
		var c = new Cobranca(); c.setReferencia("P1"); c.setFluxoCodigo("PADRAO"); c.setEstadoFluxo("NOVO");
		c.setFaixaAtraso(Cobranca.FaixaAtraso.F3_INTERMEDIARIO);
		var fluxo = new FluxoCobranca(); fluxo.setId(1L); fluxo.setCodigo("PADRAO");
		when(cobrancaRepository.findByReferencia("P1")).thenReturn(Optional.of(c));
		when(fluxoRepository.findByCodigo("PADRAO")).thenReturn(Optional.of(fluxo));
		var service = new EstadoProcessoService(cobrancaRepository, fluxoRepository, estadoRepository,
				transicaoRepository, timelineRepository, motivoService);
		assertThatThrownBy(() -> service.alterar("P1",
				new AlterarEstadoDTO("VISITA", "Op", "op", "SEM_CONTATO", null)))
				.isInstanceOf(IllegalStateException.class).hasMessageContaining("exige a faixa F4");
		verifyNoInteractions(motivoService);
	}
}
