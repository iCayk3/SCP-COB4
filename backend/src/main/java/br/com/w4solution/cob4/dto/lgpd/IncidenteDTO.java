package br.com.w4solution.cob4.dto.lgpd;
import br.com.w4solution.cob4.domain.IncidenteSeguranca;
import jakarta.validation.constraints.*;
import java.time.OffsetDateTime;
public record IncidenteDTO(Long id, String protocolo, @NotBlank String titulo, @NotBlank String descricao,
	@NotBlank String dadosAfetados, @PositiveOrZero int titularesAfetados,
	@NotNull IncidenteSeguranca.Severidade severidade, IncidenteSeguranca.Status status,
	String medidasAdotadas, String comunicacaoAnpd, OffsetDateTime comunicadoEm,
	String criadoPor, OffsetDateTime criadoEm, String atualizadoPor, OffsetDateTime atualizadoEm) {}
