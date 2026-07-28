package br.com.w4solution.cob4.dto.lgpd;

import br.com.w4solution.cob4.security.PerfilUsuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SolicitacaoPrivacidadeDTO(
		@NotBlank String cpf, @NotBlank String motivo, @NotBlank String usuario,
		@NotNull PerfilUsuario perfil, String confirmacao
) {}
