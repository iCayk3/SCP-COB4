package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.trabalho.AreaTrabalhoDTO;
import br.com.w4solution.cob4.services.trabalho.AreaTrabalhoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/area-trabalho")
public class AreaTrabalhoController {
	private final AreaTrabalhoService service;
	public AreaTrabalhoController(AreaTrabalhoService service){this.service=service;}
	@GetMapping public AreaTrabalhoDTO consultar(){return service.consultar();}
}
