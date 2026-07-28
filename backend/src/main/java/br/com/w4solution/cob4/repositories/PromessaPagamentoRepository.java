package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.PromessaPagamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;

public interface PromessaPagamentoRepository extends JpaRepository<PromessaPagamento, Long> {
	List<PromessaPagamento> findByCobrancaReferenciaOrderByCriadaEmDesc(String referencia);
	List<PromessaPagamento> findByStatusAndVencimentoBefore(PromessaPagamento.Status status, LocalDate data);
	List<PromessaPagamento> findByCobrancaInAndStatus(Collection<Cobranca> cobrancas, PromessaPagamento.Status status);
	long countByCriadaEmBetween(OffsetDateTime inicio, OffsetDateTime fim);
}
