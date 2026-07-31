package br.com.w4solution.cob4.repositories;
import br.com.w4solution.cob4.domain.ExecucaoRetencao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ExecucaoRetencaoRepository extends JpaRepository<ExecucaoRetencao,Long> {
	List<ExecucaoRetencao> findTop20ByOrderByIniciadaEmDesc();
}
