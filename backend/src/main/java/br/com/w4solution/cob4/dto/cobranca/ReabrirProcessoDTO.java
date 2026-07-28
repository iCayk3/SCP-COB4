package br.com.w4solution.cob4.dto.cobranca;

import br.com.w4solution.cob4.security.PerfilUsuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ReabrirProcessoDTO(
		@NotBlank String motivoCodigo, String observacao,
		@NotBlank String operadorNome, @NotBlank String operadorIdentificador,
		@NotNull PerfilUsuario perfil
) {}
