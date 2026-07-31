package br.com.w4solution.cob4.services.lgpd;
import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.services.usuario.AuditoriaSegurancaService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.OffsetDateTime;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RetencaoServiceTests {
	@Mock PoliticaLgpdRepository politicas; @Mock ExecucaoRetencaoRepository execucoes; @Mock AtendimentoAnexoRepository anexos;
	@Mock LogAuditoriaRepository logs; @Mock ClienteRepository clientes; @Mock CobrancaRepository cobrancas; @Mock HistoricoAtrasoRepository historicos; @Mock AuditoriaSegurancaService auditoria;
	@BeforeEach void setup(){when(execucoes.save(any())).thenAnswer(i->i.getArgument(0));}
	@Test void simulacaoNaoRemoveComprovantes(){when(politicas.findAllByOrderByCategoriaAsc()).thenReturn(List.of(politica()));when(anexos.findByClassificacaoAndEnviadoEmBefore(eq(AtendimentoAnexo.Classificacao.COMPROVANTE),any())).thenReturn(List.of(new AtendimentoAnexo()));var e=service().executar(true);assertThat(e.getItensAvaliados()).isEqualTo(1);assertThat(e.getItensProcessados()).isZero();verify(anexos,never()).deleteAllInBatch(any());}
	@Test void execucaoRemoveComprovantesVencidos(){when(politicas.findAllByOrderByCategoriaAsc()).thenReturn(List.of(politica()));var itens=List.of(new AtendimentoAnexo());when(anexos.findByClassificacaoAndEnviadoEmBefore(eq(AtendimentoAnexo.Classificacao.COMPROVANTE),any())).thenReturn(itens);var e=service().executar(false);assertThat(e.getItensProcessados()).isEqualTo(1);verify(anexos).deleteAllInBatch(itens);}
	private PoliticaLgpd politica(){var p=new PoliticaLgpd();p.setCodigo("COMPROVANTES");p.setStatusAprovacao(PoliticaLgpd.StatusAprovacao.APROVADA);p.setRetencaoMeses(12);p.setDestinoFinal(PoliticaLgpd.DestinoFinal.ELIMINAR);return p;}
	private RetencaoService service(){return new RetencaoService(politicas,execucoes,anexos,logs,clientes,cobrancas,historicos,auditoria);}
}
