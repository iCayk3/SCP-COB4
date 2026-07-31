package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@Entity
@Table(name = "acordos_financeiros", uniqueConstraints = @UniqueConstraint(name = "uk_acordo_protocolo", columnNames = "protocolo"))
public class AcordoFinanceiro {
	public enum Status { RASCUNHO, AGUARDANDO_APROVACAO, APROVADO, REJEITADO, ATIVO, CUMPRIDO, QUEBRADO, CANCELADO }
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
	@Column(nullable = false, length = 50) private String protocolo;
	@ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "politica_id", nullable = false)
	private PoliticaFinanceira politica;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private Status status;
	@Column(name = "principal_original", nullable = false, precision = 19, scale = 2) private BigDecimal principalOriginal;
	@Column(nullable = false, precision = 19, scale = 2) private BigDecimal juros;
	@Column(nullable = false, precision = 19, scale = 2) private BigDecimal multa;
	@Column(nullable = false, precision = 19, scale = 2) private BigDecimal desconto;
	@Column(name = "valor_entrada", nullable = false, precision = 19, scale = 2) private BigDecimal valorEntrada;
	@Column(name = "valor_negociado", nullable = false, precision = 19, scale = 2) private BigDecimal valorNegociado;
	@Column(name = "quantidade_parcelas", nullable = false) private int quantidadeParcelas;
	@Column(name = "criado_em", nullable = false) private OffsetDateTime criadoEm;
	@Column(name = "valido_ate", nullable = false) private OffsetDateTime validoAte;
	@Column(name = "criado_por", nullable = false, length = 150) private String criadoPor;
	@Column(name = "solicitado_em") private OffsetDateTime solicitadoEm;
	@Column(name = "decidido_em") private OffsetDateTime decididoEm;
	@Column(name = "decidido_por", length = 150) private String decididoPor;
	@Column(name = "justificativa", length = 1000) private String justificativa;
	@Column(name = "motivo_decisao", length = 1000) private String motivoDecisao;
	@Column(name = "versao", nullable = false) @Version private long versao;
	@OneToMany(mappedBy = "acordo", cascade = CascadeType.ALL, orphanRemoval = true) private List<AcordoItem> itens = new ArrayList<>();
	@OneToMany(mappedBy = "acordo", cascade = CascadeType.ALL, orphanRemoval = true) @OrderBy("numero asc")
	private List<ParcelaAcordo> parcelas = new ArrayList<>();
}
