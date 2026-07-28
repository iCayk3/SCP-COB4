package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.TarefaCobranca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface TarefaCobrancaRepository extends JpaRepository<TarefaCobranca, Long> {
	boolean existsByCobrancaAndTipoAndStatus(Cobranca cobranca, String tipo, TarefaCobranca.Status status);
	boolean existsByCobrancaAndTipo(Cobranca cobranca, String tipo);
	List<TarefaCobranca> findByStatusInOrderByPrazoEmAsc(Collection<TarefaCobranca.Status> statuses);
	List<TarefaCobranca> findByResponsavelIdentificadorAndStatusInOrderByPrazoEmAsc(
			String responsavelIdentificador, Collection<TarefaCobranca.Status> statuses);
}
