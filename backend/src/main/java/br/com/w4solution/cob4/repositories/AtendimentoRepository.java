package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.Atendimento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {
	List<Atendimento> findByCobrancaReferenciaOrderByRealizadoEmDesc(String referencia);
	boolean existsByCobrancaIdAndOperadorIdentificador(Long cobrancaId, String operadorIdentificador);
}
