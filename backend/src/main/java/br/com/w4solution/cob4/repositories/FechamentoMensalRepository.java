package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.FechamentoMensal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FechamentoMensalRepository extends JpaRepository<FechamentoMensal, Long> {
	List<FechamentoMensal> findByCompetenciaOrderByVersaoDesc(String competencia);
	Optional<FechamentoMensal> findTopByCompetenciaOrderByVersaoDesc(String competencia);
}
