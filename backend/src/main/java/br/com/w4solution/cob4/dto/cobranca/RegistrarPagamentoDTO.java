package br.com.w4solution.cob4.dto.cobranca;

import br.com.w4solution.cob4.security.PerfilUsuario;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RegistrarPagamentoDTO(
		@NotNull @DecimalMin("0.01") BigDecimal valor,
		@NotNull LocalDate dataPagamento,
		String boletoReferencia,
		@NotBlank String usuarioNome,
		@NotBlank String usuarioIdentificador,
		@NotNull PerfilUsuario perfil,
		String comprovanteReferencia,
		String observacao
) {}
