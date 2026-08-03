package br.com.w4solution.cob4.repositories;
import br.com.w4solution.cob4.domain.AcordoFinanceiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;
public interface AcordoFinanceiroRepository extends JpaRepository<AcordoFinanceiro, Long> {
	Optional<AcordoFinanceiro> findByProtocolo(String protocolo);
	List<AcordoFinanceiro> findByItensCobrancaReferenciaOrderByCriadoEmDesc(String referencia);
	Page<AcordoFinanceiro> findByItensCobrancaReferencia(String referencia, Pageable pageable);
	List<AcordoFinanceiro> findByStatus(AcordoFinanceiro.Status status);
}
