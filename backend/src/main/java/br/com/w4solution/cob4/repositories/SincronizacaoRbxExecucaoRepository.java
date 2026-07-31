package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.SincronizacaoRbxExecucao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SincronizacaoRbxExecucaoRepository extends JpaRepository<SincronizacaoRbxExecucao, Long> {
	List<SincronizacaoRbxExecucao> findTop20ByOrderByIniciadaEmDesc();
	Optional<SincronizacaoRbxExecucao> findFirstByChaveIdempotenciaAndStatusOrderByIdDesc(
			String chaveIdempotencia, SincronizacaoRbxExecucao.Status status);
}
