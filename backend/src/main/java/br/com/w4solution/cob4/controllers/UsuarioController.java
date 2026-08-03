package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.usuario.*;
import br.com.w4solution.cob4.services.usuario.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import br.com.w4solution.cob4.dto.api.PaginaDTO;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
	private final UsuarioService service;
	public UsuarioController(UsuarioService service) { this.service = service; }

	@GetMapping
	@PreAuthorize("hasAuthority('SCOPE_ADMINISTRADOR')")
	public List<UsuarioDTO> listar() { return service.listar(); }

	@GetMapping("/pagina")
	@PreAuthorize("hasAuthority('SCOPE_ADMINISTRADOR')")
	public PaginaDTO<UsuarioDTO> listarPagina(@RequestParam(defaultValue="0") int pagina,
			@RequestParam(defaultValue="20") int tamanho) {
		return service.listarPagina(pagina, Math.min(Math.max(tamanho, 1), 100));
	}

	@PostMapping
	@PreAuthorize("hasAuthority('SCOPE_ADMINISTRADOR')")
	public UsuarioDTO criar(@Valid @RequestBody SalvarUsuarioDTO dados) { return service.criar(dados); }

	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('SCOPE_ADMINISTRADOR')")
	public UsuarioDTO atualizar(@PathVariable Long id, @Valid @RequestBody SalvarUsuarioDTO dados) {
		return service.atualizar(id, dados);
	}

	@PutMapping("/me/presenca")
	public UsuarioDTO presenca(@RequestBody PresencaUsuarioDTO dados) {
		return service.alterarPresenca(dados.presente());
	}
}
