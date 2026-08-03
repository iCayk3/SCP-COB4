package br.com.w4solution.cob4.controllers;
import br.com.w4solution.cob4.domain.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import br.com.w4solution.cob4.dto.catalogo.CatalogoOperacionalDTO;
@RestController @RequestMapping("/api/catalogos/operacionais")
public class CatalogoOperacionalController {
	@GetMapping public CatalogoOperacionalDTO listar(){return new CatalogoOperacionalDTO(
			Arrays.stream(Atendimento.Canal.values()).map(Enum::name).toList(),
			Arrays.stream(Atendimento.Resultado.values()).map(Enum::name).toList(),
			Arrays.stream(Cobranca.Prioridade.values()).map(Enum::name).toList(),
			Arrays.stream(Cobranca.FaixaAtraso.values()).map(Enum::name).toList());}
}
