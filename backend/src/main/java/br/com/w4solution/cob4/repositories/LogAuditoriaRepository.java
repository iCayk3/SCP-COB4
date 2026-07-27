package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.LogAuditoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogAuditoriaRepository extends JpaRepository<LogAuditoria, Long> {
}
