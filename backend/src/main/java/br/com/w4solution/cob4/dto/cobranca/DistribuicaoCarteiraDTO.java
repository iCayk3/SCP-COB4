package br.com.w4solution.cob4.dto.cobranca;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record DistribuicaoCarteiraDTO(
		@NotEmpty List<@Valid OperadorDistribuicaoDTO> operadores,
		@NotBlank String supervisorNome,
		@NotBlank String supervisorIdentificador,
		String motivo
) {}
