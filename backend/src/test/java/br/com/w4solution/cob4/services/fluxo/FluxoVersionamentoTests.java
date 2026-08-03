package br.com.w4solution.cob4.services.fluxo;
import br.com.w4solution.cob4.repositories.*;import org.junit.jupiter.api.*;import org.springframework.beans.factory.annotation.Autowired;import org.springframework.boot.test.context.SpringBootTest;import org.springframework.test.context.ActiveProfiles;
import static org.assertj.core.api.Assertions.*;
@SpringBootTest @ActiveProfiles("test") class FluxoVersionamentoTests{
	@Autowired FluxoService service;@Autowired FluxoCobrancaRepository repositorio;
	@Test void publicadoFicaImutavelENovaVersaoNasceRascunho(){var atual=service.listar().stream().findFirst().orElseThrow();var publicado=service.publicar(atual.id());assertThat(publicado.statusVersao()).isEqualTo("PUBLICADO");assertThatThrownBy(()->service.salvar(publicado.id(),publicado)).isInstanceOf(IllegalStateException.class);var nova=service.novaVersao(publicado.id());assertThat(nova.versao()).isEqualTo(publicado.versao()+1);assertThat(nova.statusVersao()).isEqualTo("RASCUNHO");assertThat(nova.codigoOrigem()).isEqualTo(publicado.codigoOrigem());}
}
