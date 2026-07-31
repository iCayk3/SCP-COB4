package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;

@Getter @Setter @Entity
@Table(name="execucoes_retencao")
public class ExecucaoRetencao {
	public enum Status { INICIADA, CONCLUIDA, FALHOU }
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
	@Column(name="iniciada_em",nullable=false) private OffsetDateTime iniciadaEm;
	@Column(name="concluida_em") private OffsetDateTime concluidaEm;
	@Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private Status status;
	@Column(name="modo_simulacao",nullable=false) private boolean modoSimulacao;
	@Column(name="itens_avaliados",nullable=false) private int itensAvaliados;
	@Column(name="itens_processados",nullable=false) private int itensProcessados;
	@Column(nullable=false,length=4000) private String detalhes;
}
