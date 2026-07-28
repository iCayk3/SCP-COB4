package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.PoliticaLgpd;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PoliticaLgpdRepository extends JpaRepository<PoliticaLgpd, Long> {
	List<PoliticaLgpd> findAllByOrderByCategoriaAsc();
	Optional<PoliticaLgpd> findByCodigo(String codigo);
	long countByStatusAprovacao(PoliticaLgpd.StatusAprovacao status);
}
