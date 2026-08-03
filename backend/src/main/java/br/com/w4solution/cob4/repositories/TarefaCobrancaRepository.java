package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.TarefaCobranca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TarefaCobrancaRepository extends JpaRepository<TarefaCobranca, Long> {
	boolean existsByCobrancaAndTipoAndStatus(Cobranca cobranca, String tipo, TarefaCobranca.Status status);
	boolean existsByCobrancaAndTipo(Cobranca cobranca, String tipo);
	List<TarefaCobranca> findByStatusInOrderByPrazoEmAsc(Collection<TarefaCobranca.Status> statuses);
	List<TarefaCobranca> findByResponsavelIdentificadorAndStatusInOrderByPrazoEmAsc(
			String responsavelIdentificador, Collection<TarefaCobranca.Status> statuses);
	List<TarefaCobranca> findByCobrancaReferenciaOrderByPrazoEmAsc(String referencia);
	Page<TarefaCobranca> findByResponsavelIdentificadorAndStatusIn(
			String responsavelIdentificador, Collection<TarefaCobranca.Status> statuses, Pageable pageable);
}
