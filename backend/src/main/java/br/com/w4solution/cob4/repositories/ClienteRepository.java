package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Collection;
import java.util.List;
import java.time.OffsetDateTime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
	Optional<Cliente> findByCpf(String cpf);
	List<Cliente> findAllByCpfIn(Collection<String> cpfs);
	@Query("select c from Cliente c where c.atualizadoEm < :limite and not exists (select co.id from Cobranca co where co.cliente=c and co.status in (br.com.w4solution.cob4.domain.Cobranca.Status.ABERTA,br.com.w4solution.cob4.domain.Cobranca.Status.EM_ANDAMENTO))")
	List<Cliente> elegiveisRetencao(@Param("limite") OffsetDateTime limite);
}
