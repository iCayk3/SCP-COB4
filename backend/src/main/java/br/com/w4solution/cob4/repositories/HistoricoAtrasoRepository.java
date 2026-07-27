package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.HistoricoAtraso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Collection;
import java.util.List;

public interface HistoricoAtrasoRepository extends JpaRepository<HistoricoAtraso, Long> {
	Optional<HistoricoAtraso> findByBoletoReferencia(String boletoReferencia);
	List<HistoricoAtraso> findAllByBoletoReferenciaIn(Collection<String> referencias);
}
