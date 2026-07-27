package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.regra.RegraNegocioDTO;
import br.com.w4solution.cob4.services.regra.RegraNegocioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regras")
public class RegraNegocioController {
	private final RegraNegocioService service;

	public RegraNegocioController(RegraNegocioService service) {
		this.service = service;
	}

	@GetMapping
	public List<RegraNegocioDTO> listar() {
		return service.listar();
	}
}
