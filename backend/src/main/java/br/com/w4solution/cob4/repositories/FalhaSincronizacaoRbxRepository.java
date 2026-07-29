package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.FalhaSincronizacaoRbx;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;

public interface FalhaSincronizacaoRbxRepository extends JpaRepository<FalhaSincronizacaoRbx, Long> {
	List<FalhaSincronizacaoRbx> findTop20ByOrderByCriadaEmDesc();
	List<FalhaSincronizacaoRbx> findTop10ByStatusAndProximaTentativaEmLessThanEqualOrderByProximaTentativaEm(
			FalhaSincronizacaoRbx.Status status, OffsetDateTime agora);
	List<FalhaSincronizacaoRbx> findByStatusAndUltimaTentativaEmLessThan(
			FalhaSincronizacaoRbx.Status status, OffsetDateTime limite);
}
