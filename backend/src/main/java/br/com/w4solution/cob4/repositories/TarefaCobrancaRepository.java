package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.TarefaCobranca;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TarefaCobrancaRepository extends JpaRepository<TarefaCobranca, Long> {
	boolean existsByCobrancaAndTipoAndStatus(Cobranca cobranca, String tipo, TarefaCobranca.Status status);
}
