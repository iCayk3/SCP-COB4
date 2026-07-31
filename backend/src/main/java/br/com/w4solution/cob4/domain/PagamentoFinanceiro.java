package br.com.w4solution.cob4.domain;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
@Getter @Setter @Entity
@Table(name="pagamentos_financeiros", uniqueConstraints=@UniqueConstraint(name="uk_pagamento_chave",columnNames="chave_idempotencia"))
public class PagamentoFinanceiro {
	public enum Status { PENDENTE, CONFIRMADO, CONCILIADO, DIVERGENTE, ESTORNADO }
	public enum Origem { MANUAL, RBX, PIX, BOLETO }
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
	@ManyToOne(optional=false,fetch=FetchType.LAZY) @JoinColumn(name="cobranca_id",nullable=false) private Cobranca cobranca;
	@ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="acordo_id") private AcordoFinanceiro acordo;
	@ManyToOne(optional=false,fetch=FetchType.LAZY) @JoinColumn(name="comprovante_id",nullable=false) private AtendimentoAnexo comprovante;
	@Column(nullable=false,precision=19,scale=2) private BigDecimal valor;
	@Column(name="credito_excedente",nullable=false,precision=19,scale=2) private BigDecimal creditoExcedente=BigDecimal.ZERO;
	@Column(name="data_pagamento",nullable=false) private LocalDate dataPagamento;
	@Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private Status status=Status.PENDENTE;
	@Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private Origem origem=Origem.MANUAL;
	@Column(name="referencia_externa",length=150) private String referenciaExterna;
	@Column(name="chave_idempotencia",nullable=false,length=100) private String chaveIdempotencia;
	@Column(name="registrado_em",nullable=false) private OffsetDateTime registradoEm;
	@Column(name="registrado_por",nullable=false,length=150) private String registradoPor;
	@Column(name="confirmado_em") private OffsetDateTime confirmadoEm;
	@Column(name="confirmado_por",length=150) private String confirmadoPor;
	@Column(length=1000) private String observacao;
	@OneToMany(mappedBy="pagamento",cascade=CascadeType.ALL,orphanRemoval=true) private List<PagamentoAlocacao> alocacoes=new ArrayList<>();
}
