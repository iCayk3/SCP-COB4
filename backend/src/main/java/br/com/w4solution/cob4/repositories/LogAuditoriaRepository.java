package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.LogAuditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.time.OffsetDateTime;

public interface LogAuditoriaRepository extends JpaRepository<LogAuditoria, Long> {
	long countByCriadoEmBefore(OffsetDateTime limite);
	@Modifying @Query("update LogAuditoria l set l.cpf=null,l.clienteNome=null,l.usuarioNome='Usuário anonimizado',l.usuarioIdentificador=null,l.boletoReferencia=null where l.criadoEm < :limite")
	int anonimizarAntesDe(@Param("limite") OffsetDateTime limite);
}
