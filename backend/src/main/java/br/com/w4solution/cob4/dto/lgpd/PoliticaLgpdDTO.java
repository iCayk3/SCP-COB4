package br.com.w4solution.cob4.dto.lgpd;

import br.com.w4solution.cob4.domain.PoliticaLgpd;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.OffsetDateTime;

public record PoliticaLgpdDTO(
		Long id, @NotBlank String codigo, @NotBlank String categoria, @NotBlank String dadosPessoais,
		@NotBlank String finalidade, @NotBlank String baseLegal, @NotBlank String origem,
		@NotBlank String perfisAcesso, @Positive Integer retencaoMeses,
		@NotNull PoliticaLgpd.DestinoFinal destinoFinal,
		@NotNull PoliticaLgpd.StatusAprovacao statusAprovacao, String observacaoAprovacao,
		String aprovadaPor, OffsetDateTime aprovadaEm
) {
	public PoliticaLgpdDTO(Long id,String codigo,String categoria,String dadosPessoais,String finalidade,String baseLegal,
			String origem,String perfisAcesso,Integer retencaoMeses,PoliticaLgpd.DestinoFinal destinoFinal,
			PoliticaLgpd.StatusAprovacao statusAprovacao,String observacaoAprovacao){
		this(id,codigo,categoria,dadosPessoais,finalidade,baseLegal,origem,perfisAcesso,retencaoMeses,destinoFinal,statusAprovacao,observacaoAprovacao,null,null);
	}
}
