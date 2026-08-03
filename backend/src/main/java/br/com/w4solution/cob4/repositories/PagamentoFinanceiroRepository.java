package br.com.w4solution.cob4.repositories;
import br.com.w4solution.cob4.domain.PagamentoFinanceiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.*;
public interface PagamentoFinanceiroRepository extends JpaRepository<PagamentoFinanceiro,Long>{
	Optional<PagamentoFinanceiro> findByChaveIdempotencia(String chave);
	List<PagamentoFinanceiro> findByCobrancaReferenciaOrderByRegistradoEmDesc(String referencia);
	Page<PagamentoFinanceiro> findByCobrancaReferencia(String referencia, Pageable pageable);
	List<PagamentoFinanceiro> findByStatusIn(Collection<PagamentoFinanceiro.Status> status);
	List<PagamentoFinanceiro> findByDataPagamentoBetweenAndStatusIn(LocalDate inicio,LocalDate fim,Collection<PagamentoFinanceiro.Status> status);
}
