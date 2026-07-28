package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.MotivoCatalogo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MotivoCatalogoRepository extends JpaRepository<MotivoCatalogo, Long> {
	List<MotivoCatalogo> findAllByOrderByTipoAscOrdemAscNomeAsc();
	List<MotivoCatalogo> findByTipoAndAtivoTrueOrderByOrdemAscNomeAsc(MotivoCatalogo.Tipo tipo);
	Optional<MotivoCatalogo> findByTipoAndCodigo(MotivoCatalogo.Tipo tipo, String codigo);
}
