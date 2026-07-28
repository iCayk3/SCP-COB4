package br.com.w4solution.cob4.services.lgpd;

import br.com.w4solution.cob4.domain.PoliticaLgpd;
import br.com.w4solution.cob4.dto.lgpd.PoliticaLgpdDTO;
import br.com.w4solution.cob4.repositories.PoliticaLgpdRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PoliticaLgpdServiceTests {
	@Mock PoliticaLgpdRepository repository;
	@Test void naoAprovaSemPrazoDeRetencao() {
		var atual = new PoliticaLgpd(); atual.setId(1L); atual.setCodigo("CONTATO");
		when(repository.findById(1L)).thenReturn(Optional.of(atual));
		var dto = new PoliticaLgpdDTO(1L, "CONTATO", "Contato", "Telefone", "Cobrança",
				"Exercício de direitos", "RBX", "Operador", null, PoliticaLgpd.DestinoFinal.ELIMINAR,
				PoliticaLgpd.StatusAprovacao.APROVADA, "Parecer");
		assertThatThrownBy(() -> new PoliticaLgpdService(repository).atualizar(1L, dto))
				.isInstanceOf(IllegalArgumentException.class).hasMessageContaining("retenção");
	}
	@Test void codigoDaPoliticaEhImutavel() {
		var atual = new PoliticaLgpd(); atual.setId(1L); atual.setCodigo("CONTATO");
		when(repository.findById(1L)).thenReturn(Optional.of(atual));
		var dto = new PoliticaLgpdDTO(1L, "OUTRO", "Contato", "Telefone", "Cobrança",
				"Base", "RBX", "Operador", 12, PoliticaLgpd.DestinoFinal.ELIMINAR,
				PoliticaLgpd.StatusAprovacao.APROVADA, "Parecer");
		assertThatThrownBy(() -> new PoliticaLgpdService(repository).atualizar(1L, dto))
				.isInstanceOf(IllegalArgumentException.class).hasMessageContaining("imutável");
	}
}
