package br.com.w4solution.cob4.dto.lgpd;

import br.com.w4solution.cob4.domain.PoliticaLgpd;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PoliticaLgpdDTO(
		Long id, @NotBlank String codigo, @NotBlank String categoria, @NotBlank String dadosPessoais,
		@NotBlank String finalidade, @NotBlank String baseLegal, @NotBlank String origem,
		@NotBlank String perfisAcesso, @Positive Integer retencaoMeses,
		@NotNull PoliticaLgpd.DestinoFinal destinoFinal,
		@NotNull PoliticaLgpd.StatusAprovacao statusAprovacao, String observacaoAprovacao
) {
}
