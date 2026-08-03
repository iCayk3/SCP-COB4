package br.com.w4solution.cob4.dto.catalogo;
import java.util.List;
public record CatalogoOperacionalDTO(List<String> canaisAtendimento,List<String> resultadosAtendimento,
		List<String> prioridades,List<String> faixasAtraso){}
