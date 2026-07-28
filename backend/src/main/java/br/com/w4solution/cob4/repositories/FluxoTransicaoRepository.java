package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.FluxoTransicao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FluxoTransicaoRepository extends JpaRepository<FluxoTransicao, Long> {
	List<FluxoTransicao> findByFluxoIdOrderByIdAsc(Long fluxoId);
	List<FluxoTransicao> findByFluxoIdAndOrigemCodigoOrderByIdAsc(Long fluxoId, String origemCodigo);
	Optional<FluxoTransicao> findByFluxoIdAndOrigemCodigoAndDestinoCodigo(Long fluxoId, String origem, String destino);
	void deleteByFluxoId(Long fluxoId);
}
