package br.com.w4solution.cob4.dto.usuario;

import br.com.w4solution.cob4.security.PerfilUsuario;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SalvarUsuarioDTO(
		@NotBlank String nome,
		@NotBlank String identificador,
		@Size(min = 12, max = 72) String senha,
		@NotNull PerfilUsuario perfil,
		boolean ativo,
		boolean presente,
		@Min(1) int cargaMaxima
) {}
