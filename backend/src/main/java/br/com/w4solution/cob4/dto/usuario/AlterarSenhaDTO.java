package br.com.w4solution.cob4.dto.usuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AlterarSenhaDTO(
		@NotBlank String senhaAtual,
		@NotBlank @Size(min = 12, max = 72) String novaSenha
) {}
