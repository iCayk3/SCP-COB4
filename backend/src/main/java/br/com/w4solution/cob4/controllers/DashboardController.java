package br.com.w4solution.cob4.controllers;
import br.com.w4solution.cob4.dto.planejamento.DashboardDTO;import br.com.w4solution.cob4.services.planejamento.DashboardService;import org.springframework.web.bind.annotation.*;import org.springframework.security.access.prepost.PreAuthorize;import java.time.*;
@RestController @RequestMapping("/api/dashboards") @PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_SUPERVISOR')")
public class DashboardController{private final DashboardService s;public DashboardController(DashboardService s){this.s=s;}
	@GetMapping("/executivo")public DashboardDTO.Executivo executivo(@RequestParam OffsetDateTime inicio,@RequestParam OffsetDateTime fim){return s.executivo(inicio,fim);}
	@GetMapping("/operacao")public DashboardDTO.Operacao operacao(){return s.operacao();}
	@GetMapping("/equipe")public DashboardDTO.Equipe equipe(@RequestParam OffsetDateTime inicio,@RequestParam OffsetDateTime fim){return s.equipe(inicio,fim);}
	@GetMapping("/sla")public DashboardDTO.Sla sla(){return s.sla();}
	@GetMapping("/integracoes")public DashboardDTO.Integracoes integracoes(){return s.integracoes();}}
