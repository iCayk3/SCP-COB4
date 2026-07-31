package br.com.w4solution.cob4.domain;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
@Getter @Setter @Entity @Table(name="pagamento_alocacoes")
public class PagamentoAlocacao {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
	@ManyToOne(optional=false,fetch=FetchType.LAZY) @JoinColumn(name="pagamento_id",nullable=false) private PagamentoFinanceiro pagamento;
	@ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="parcela_id") private ParcelaAcordo parcela;
	@Column(nullable=false,precision=19,scale=2) private BigDecimal multa=BigDecimal.ZERO;
	@Column(nullable=false,precision=19,scale=2) private BigDecimal juros=BigDecimal.ZERO;
	@Column(nullable=false,precision=19,scale=2) private BigDecimal principal=BigDecimal.ZERO;
	@Column(nullable=false,precision=19,scale=2) private BigDecimal total=BigDecimal.ZERO;
}
