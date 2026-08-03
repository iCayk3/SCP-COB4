package br.com.w4solution.cob4.dto.planejamento;
import java.math.BigDecimal;import java.time.*;import java.util.*;
public final class DashboardDTO { private DashboardDTO(){}
	public record Executivo(long processosAtivos,BigDecimal saldoAtivo,long processosEncerrados,long atendimentos){}
	public record Operacao(List<Item> porStatus,List<Item> porPrioridade,List<Item> porFaixa){}
	public record Equipe(List<Produtividade> operadores){}
	public record Sla(long dentro,long vencidos,long pausados){}
	public record Integracoes(long sucessos,long falhas,long pendentes){}
	public record Item(String chave,long quantidade,BigDecimal valor){}
	public record Produtividade(String operador,long carteira,long atendimentos){}
}
