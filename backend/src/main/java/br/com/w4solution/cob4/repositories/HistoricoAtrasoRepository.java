package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.HistoricoAtraso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HistoricoAtrasoRepository extends JpaRepository<HistoricoAtraso, Long> {
	Optional<HistoricoAtraso> findByBoletoReferencia(String boletoReferencia);
	List<HistoricoAtraso> findAllByBoletoReferenciaIn(Collection<String> referencias);
	List<HistoricoAtraso> findByContratoReferenciaAndCpfAndDataPagamentoIsNull(String contratoReferencia, String cpf);

	@Modifying(clearAutomatically = true, flushAutomatically = true)
	@Query("update HistoricoAtraso h set h.cpf = :novoCpf, h.clienteNome = 'Titular anonimizado' where h.cpf = :cpf")
	int anonimizarCpf(@Param("cpf") String cpf, @Param("novoCpf") String novoCpf);
}
