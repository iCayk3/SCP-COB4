package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.ProcessoTimeline;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProcessoTimelineRepository extends JpaRepository<ProcessoTimeline, Long> {
	List<ProcessoTimeline> findByCobrancaReferenciaOrderByCriadoEmAscIdAsc(String referencia);
}
