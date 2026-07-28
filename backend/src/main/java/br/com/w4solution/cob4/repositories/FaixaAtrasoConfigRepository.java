package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.FaixaAtrasoConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FaixaAtrasoConfigRepository extends JpaRepository<FaixaAtrasoConfig, Long> {
	List<FaixaAtrasoConfig> findAllByOrderByOrdemAsc();
}
