package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.CobrancaBoleto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Collection;
import java.util.List;

public interface CobrancaBoletoRepository extends JpaRepository<CobrancaBoleto, Long> {
	Optional<CobrancaBoleto> findByRbxDocumento(String rbxDocumento);
	List<CobrancaBoleto> findAllByRbxDocumentoIn(Collection<String> referencias);
	List<CobrancaBoleto> findByAtivoTrue();
	long countByCobrancaAndAtivoTrue(Cobranca cobranca);
	List<CobrancaBoleto> findByCobrancaOrderByVencimentoAsc(Cobranca cobranca);

	@Query("select coalesce(sum(b.valor), 0) from CobrancaBoleto b where b.cobranca = :cobranca and b.ativo = true")
	BigDecimal somarPorCobranca(@Param("cobranca") Cobranca cobranca);

	@Query("select b.cobranca.id, count(b) from CobrancaBoleto b where b.ativo = true group by b.cobranca.id")
	List<Object[]> contarAtivosPorCobranca();

	@Query("select b.cobranca.id, count(b) from CobrancaBoleto b where b.ativo = true and b.cobranca.id in :ids group by b.cobranca.id")
	List<Object[]> contarAtivosPorCobrancas(@Param("ids") Collection<Long> ids);

	@Modifying(clearAutomatically = true, flushAutomatically = true)
	@Query("update CobrancaBoleto b set b.ativo = false where b.ativo = true")
	int desativarTodos();
}
