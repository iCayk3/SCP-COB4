package br.com.w4solution.cob4.dto.financeiro;

import br.com.w4solution.cob4.security.PerfilUsuario;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record AlcadaDescontoDTO(
		@NotNull PerfilUsuario perfil,
		@NotNull @DecimalMin("0") @DecimalMax("100") BigDecimal percentualMaximo,
		@DecimalMin("0") BigDecimal valorMaximo,
		boolean permitePrincipal,
		boolean permiteJuros,
		boolean permiteMulta,
		boolean exigeAprovacao
) {}
