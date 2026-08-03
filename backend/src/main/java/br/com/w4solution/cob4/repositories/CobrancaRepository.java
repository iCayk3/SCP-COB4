package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.Cobranca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;
import java.util.Collection;

public interface CobrancaRepository extends JpaRepository<Cobranca, Long> {
	interface ResumoGrupo { String getChave(); long getQuantidade(); java.math.BigDecimal getValor(); }
	List<Cobranca> findByStatusOrderByAtualizadaEmDesc(Cobranca.Status status);
	List<Cobranca> findByStatusInOrderByAtualizadaEmDesc(Collection<Cobranca.Status> statuses);
	List<Cobranca> findByCpfAgregadorAndStatusInOrderByAtualizadaEmDesc(
			String cpf, Collection<Cobranca.Status> statuses);
	List<Cobranca> findByCpfAgregadorInAndStatusIn(
			Collection<String> cpfs, Collection<Cobranca.Status> statuses);
	List<Cobranca> findByResponsavelIdentificadorAndStatusInOrderByPrioridadeDescAtualizadaEmAsc(
			String responsavelIdentificador, Collection<Cobranca.Status> statuses);
	List<Cobranca> findByStatusInAndResponsavelIdentificadorOrderByPrioridadeDescAtualizadaEmAsc(
			Collection<Cobranca.Status> statuses, String responsavelIdentificador);
	List<Cobranca> findAllByReferenciaIn(Collection<String> referencias);
	Optional<Cobranca> findByReferencia(String referencia);
	List<Cobranca> findByCpfAgregadorOrderByCriadaEmDesc(String cpf);
	List<Cobranca> findByCriadaEmBetween(java.time.OffsetDateTime inicio, java.time.OffsetDateTime fim);
	List<Cobranca> findByEncerradaEmBetween(java.time.OffsetDateTime inicio, java.time.OffsetDateTime fim);
	List<Cobranca> findByCriadaEmBeforeAndStatusIn(java.time.OffsetDateTime fim, Collection<Cobranca.Status> statuses);
	@Query("select c.status as chave,count(c) as quantidade,coalesce(sum(c.valorTotal),0) as valor from Cobranca c group by c.status")
	List<ResumoGrupo> resumirPorStatus();
	@Query("select c.prioridade as chave,count(c) as quantidade,coalesce(sum(c.valorTotal),0) as valor from Cobranca c where c.status in :statuses group by c.prioridade")
	List<ResumoGrupo> resumirPorPrioridade(@Param("statuses") Collection<Cobranca.Status> statuses);
	@Query("select c.faixaAtraso as chave,count(c) as quantidade,coalesce(sum(c.valorTotal),0) as valor from Cobranca c where c.status in :statuses group by c.faixaAtraso")
	List<ResumoGrupo> resumirPorFaixa(@Param("statuses") Collection<Cobranca.Status> statuses);
	@Query("select c.responsavelIdentificador as chave,count(c) as quantidade,coalesce(sum(c.valorTotal),0) as valor from Cobranca c where c.status in :statuses group by c.responsavelIdentificador")
	List<ResumoGrupo> resumirPorResponsavel(@Param("statuses") Collection<Cobranca.Status> statuses);

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

	@EntityGraph(attributePaths = "cliente")
	@Query("""
			select c from Cobranca c
			where c.status in :statuses
			and c.responsavelIdentificador = :responsavel
			and (:prioridade is null or c.prioridade = :prioridade)
			and (:estado is null or c.estadoFluxo = :estado)
			and (:faixa is null or c.faixaAtraso = :faixa)
			and (:diasMin is null or c.diasAtraso >= :diasMin)
			and (:diasMax is null or c.diasAtraso <= :diasMax)
			and (:busca = '' or lower(c.referencia) like lower(concat('%', :busca, '%'))
				or lower(c.cpfAgregador) like lower(concat('%', :busca, '%'))
				or lower(c.cliente.nomeCompleto) like lower(concat('%', :busca, '%')))
			""")
	Page<Cobranca> buscarFila(@Param("statuses") Collection<Cobranca.Status> statuses,
			@Param("responsavel") String responsavel,
			@Param("prioridade") Cobranca.Prioridade prioridade,
			@Param("estado") String estado,
			@Param("faixa") Cobranca.FaixaAtraso faixa,
			@Param("diasMin") Integer diasMin, @Param("diasMax") Integer diasMax,
			@Param("busca") String busca, Pageable pageable);

	List<Cobranca> findByEstadoFluxoAndEstadoFluxoDesdeBefore(String estadoFluxo, java.time.OffsetDateTime limite);

	@Query("select distinct c.estadoFluxo from Cobranca c where c.fluxoCodigo = :fluxoCodigo")
	List<String> buscarEstadosEmUso(@Param("fluxoCodigo") String fluxoCodigo);
	boolean existsByFluxoCodigoAndStatusIn(String fluxoCodigo,Collection<Cobranca.Status> statuses);

	@Modifying(clearAutomatically = true, flushAutomatically = true)
	@Query("update Cobranca c set c.cpfAgregador = :novoCpf where c.cpfAgregador = :cpf")
	int anonimizarCpf(@Param("cpf") String cpf, @Param("novoCpf") String novoCpf);
}
