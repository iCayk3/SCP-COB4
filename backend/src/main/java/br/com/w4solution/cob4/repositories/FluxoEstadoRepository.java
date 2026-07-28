package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.FluxoEstado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FluxoEstadoRepository extends JpaRepository<FluxoEstado, Long> {
	List<FluxoEstado> findByFluxoIdOrderByOrdemAsc(Long fluxoId);
	Optional<FluxoEstado> findByFluxoIdAndCodigo(Long fluxoId, String codigo);
	void deleteByFluxoId(Long fluxoId);
}
