package br.com.w4solution.cob4.repositories;
import br.com.w4solution.cob4.domain.SolicitacaoAtualizacaoCliente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SolicitacaoAtualizacaoClienteRepository extends JpaRepository<SolicitacaoAtualizacaoCliente, Long> {
	List<SolicitacaoAtualizacaoCliente> findByClienteCpfOrderBySolicitadoEmDesc(String cpf);
	boolean existsByClienteIdAndStatus(Long clienteId, SolicitacaoAtualizacaoCliente.Status status);
}
