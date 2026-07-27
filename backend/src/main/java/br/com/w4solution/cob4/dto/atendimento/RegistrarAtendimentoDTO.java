package br.com.w4solution.cob4.dto.atendimento;

import br.com.w4solution.cob4.domain.Atendimento;
import br.com.w4solution.cob4.domain.AtendimentoMensagem;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record RegistrarAtendimentoDTO(
		@NotNull Atendimento.Canal canal,
		@NotNull Atendimento.Resultado resultado,
		@NotBlank String observacao,
		@NotBlank String proximaAcao,
		@NotBlank String operadorNome,
		@NotBlank String operadorIdentificador,
		@NotEmpty List<@Valid MensagemDTO> mensagens
) {
	public record MensagemDTO(
			@NotNull AtendimentoMensagem.Autor autor,
			@NotBlank String mensagem
	) {}
}
