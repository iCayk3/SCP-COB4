package br.com.w4solution.cob4.dto.usuario;

import br.com.w4solution.cob4.security.PerfilUsuario;

public record UsuarioDTO(Long id, String nome, String identificador, PerfilUsuario perfil,
						 boolean ativo, boolean presente, int cargaMaxima, boolean trocaSenhaObrigatoria) {}
