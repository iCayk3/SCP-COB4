package br.com.w4solution.cob4.dto.usuario;

import jakarta.validation.constraints.NotBlank;

public record LoginDTO(@NotBlank String identificador, @NotBlank String senha) {}
