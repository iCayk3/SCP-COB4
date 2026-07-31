package br.com.w4solution.cob4.repositories;
import br.com.w4solution.cob4.domain.ParcelaAcordo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ParcelaAcordoRepository extends JpaRepository<ParcelaAcordo, Long> {
	List<ParcelaAcordo> findByAcordoIdOrderByNumeroAsc(Long acordoId);
}
