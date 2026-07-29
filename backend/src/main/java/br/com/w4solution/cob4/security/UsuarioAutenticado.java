package br.com.w4solution.cob4.security;

public record UsuarioAutenticado(Long id, String nome, String identificador, PerfilUsuario perfil) {}
