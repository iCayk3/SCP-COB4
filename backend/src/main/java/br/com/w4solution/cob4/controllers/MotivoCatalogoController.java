package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.domain.MotivoCatalogo;
import br.com.w4solution.cob4.dto.catalogo.MotivoCatalogoDTO;
import br.com.w4solution.cob4.services.catalogo.MotivoCatalogoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/catalogos/motivos")
public class MotivoCatalogoController {
	private final MotivoCatalogoService service;

	public MotivoCatalogoController(MotivoCatalogoService service) {
		this.service = service;
	}

	@GetMapping
	public List<MotivoCatalogoDTO> listar(
			@RequestParam(required = false) MotivoCatalogo.Tipo tipo,
			@RequestParam(defaultValue = "true") boolean somenteAtivos) {
		return service.listar(tipo, somenteAtivos);
	}

	@PutMapping
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public List<MotivoCatalogoDTO> salvar(@Valid @RequestBody List<@Valid MotivoCatalogoDTO> motivos) {
		return service.salvar(motivos);
	}
}
