package br.com.w4solution.cob4.repositories;
import br.com.w4solution.cob4.domain.AgendamentoAtendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AgendamentoAtendimentoRepository extends JpaRepository<AgendamentoAtendimento, Long> {
	List<AgendamentoAtendimento> findByCobrancaReferenciaOrderByInicioEmAsc(String referencia);
}
