package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.PoliticaFinanceira;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PoliticaFinanceiraRepository extends JpaRepository<PoliticaFinanceira, Long> {
	Optional<PoliticaFinanceira> findByVigenteTrue();
	Optional<PoliticaFinanceira> findTopByOrderByVersaoDesc();
	List<PoliticaFinanceira> findAllByOrderByVersaoDesc();
}
