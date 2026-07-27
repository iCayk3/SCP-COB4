package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.Cobranca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Collection;

public interface CobrancaRepository extends JpaRepository<Cobranca, Long> {
	Optional<Cobranca> findFirstByCpfAgregadorAndStatusOrderByCriadaEmDesc(String cpf, Cobranca.Status status);
	List<Cobranca> findByStatusOrderByAtualizadaEmDesc(Cobranca.Status status);
	List<Cobranca> findByStatusInOrderByAtualizadaEmDesc(Collection<Cobranca.Status> statuses);
	List<Cobranca> findAllByCpfAgregadorInAndStatus(Collection<String> cpfs, Cobranca.Status status);
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
}
