package br.com.w4solution.cob4.dto.cobranca;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import br.com.w4solution.cob4.security.PerfilUsuario;

public record EncerrarProcessoDTO(
		@NotBlank String motivoCodigo,
		String observacao,
		@NotBlank String operadorNome,
		@NotBlank String operadorIdentificador,
		@NotNull PerfilUsuario perfil
) {
}
