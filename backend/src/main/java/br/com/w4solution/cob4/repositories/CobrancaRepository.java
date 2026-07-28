package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.Cobranca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;
import java.util.Collection;

public interface CobrancaRepository extends JpaRepository<Cobranca, Long> {
	List<Cobranca> findByStatusOrderByAtualizadaEmDesc(Cobranca.Status status);
	List<Cobranca> findByStatusInOrderByAtualizadaEmDesc(Collection<Cobranca.Status> statuses);
	List<Cobranca> findByCpfAgregadorAndStatusInOrderByAtualizadaEmDesc(
			String cpf, Collection<Cobranca.Status> statuses);
	List<Cobranca> findByCpfAgregadorInAndStatusIn(
			Collection<String> cpfs, Collection<Cobranca.Status> statuses);
	List<Cobranca> findAllByReferenciaIn(Collection<String> referencias);
	Optional<Cobranca> findByReferencia(String referencia);

	@EntityGraph(attributePaths = "cliente")
	@Query("""
			select c from Cobranca c
			where c.status in :statuses and c.valorTotal > 0
			and (:busca = '' or lower(c.referencia) like lower(concat('%', :busca, '%'))
				or lower(c.cpfAgregador) like lower(concat('%', :busca, '%'))
				or lower(c.cliente.nomeCompleto) like lower(concat('%', :busca, '%')))
			""")
	Page<Cobranca> buscarParaAtendimento(@Param("statuses") Collection<Cobranca.Status> statuses,
										 @Param("busca") String busca, Pageable pageable);

	List<Cobranca> findByEstadoFluxoAndEstadoFluxoDesdeBefore(String estadoFluxo, java.time.OffsetDateTime limite);

	@Query("select distinct c.estadoFluxo from Cobranca c where c.fluxoCodigo = :fluxoCodigo")
	List<String> buscarEstadosEmUso(@Param("fluxoCodigo") String fluxoCodigo);

	@Modifying(clearAutomatically = true, flushAutomatically = true)
	@Query("update Cobranca c set c.cpfAgregador = :novoCpf where c.cpfAgregador = :cpf")
	int anonimizarCpf(@Param("cpf") String cpf, @Param("novoCpf") String novoCpf);
}
