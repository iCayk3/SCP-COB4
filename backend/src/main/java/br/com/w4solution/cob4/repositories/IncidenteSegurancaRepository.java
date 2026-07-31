package br.com.w4solution.cob4.repositories;
import br.com.w4solution.cob4.domain.IncidenteSeguranca;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface IncidenteSegurancaRepository extends JpaRepository<IncidenteSeguranca,Long> {
	List<IncidenteSeguranca> findAllByOrderByCriadoEmDesc();
}
