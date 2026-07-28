package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.FluxoCobranca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FluxoCobrancaRepository extends JpaRepository<FluxoCobranca, Long> {
	Optional<FluxoCobranca> findByCodigo(String codigo);
	List<FluxoCobranca> findAllByOrderByNomeAsc();
}
