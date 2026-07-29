package br.com.w4solution.cob4.dto.atendimento;
import jakarta.validation.constraints.*;
import java.time.OffsetDateTime;
public record AgendaDTO(@NotBlank @Size(max=160) String titulo, @Size(max=1000) String observacao,
	@NotNull OffsetDateTime inicioEm, @NotNull OffsetDateTime fimEm) {}
