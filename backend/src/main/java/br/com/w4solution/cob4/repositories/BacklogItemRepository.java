package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.BacklogItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BacklogItemRepository extends JpaRepository<BacklogItem, Long> {
	List<BacklogItem> findAllByOrderByPrioridadeAscOrdemAsc();
	Optional<BacklogItem> findByCodigo(String codigo);
}
