package br.com.w4solution.cob4.dto.fluxo;
import java.util.List;
public record ValidacaoFluxoDTO(Long fluxoId,int versao,boolean valido,List<String> problemas,List<String> estadosAlcancaveis){}
