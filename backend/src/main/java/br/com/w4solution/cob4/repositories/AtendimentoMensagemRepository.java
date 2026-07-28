package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.AtendimentoMensagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AtendimentoMensagemRepository extends JpaRepository<AtendimentoMensagem, Long> {
	List<AtendimentoMensagem> findByAtendimentoIdOrderByEnviadaEmAscIdAsc(Long atendimentoId);
	boolean existsByAtendimentoCobrancaIdAndAutor(Long cobrancaId, AtendimentoMensagem.Autor autor);
}
