package br.com.w4solution.cob4.dto.usuario;

public record TokenDTO(String token, long expiresIn, UsuarioDTO usuario) {}
