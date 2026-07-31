package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;

@Getter @Setter @Entity
@Table(name = "incidentes_seguranca")
public class IncidenteSeguranca {
	public enum Status { ABERTO, EM_INVESTIGACAO, CONTIDO, COMUNICADO, ENCERRADO }
	public enum Severidade { BAIXA, MEDIA, ALTA, CRITICA }
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
	@Column(nullable=false, unique=true, length=40) private String protocolo;
	@Column(nullable=false, length=200) private String titulo;
	@Column(nullable=false, length=4000) private String descricao;
	@Column(name="dados_afetados", nullable=false, length=2000) private String dadosAfetados;
	@Column(name="titulares_afetados", nullable=false) private int titularesAfetados;
	@Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private Severidade severidade;
	@Enumerated(EnumType.STRING) @Column(nullable=false, length=30) private Status status = Status.ABERTO;
	@Column(name="medidas_adotadas", length=4000) private String medidasAdotadas;
	@Column(name="comunicacao_anpd", length=2000) private String comunicacaoAnpd;
	@Column(name="comunicado_em") private OffsetDateTime comunicadoEm;
	@Column(name="criado_por", nullable=false, length=150) private String criadoPor;
	@Column(name="criado_em", nullable=false) private OffsetDateTime criadoEm;
	@Column(name="atualizado_por", nullable=false, length=150) private String atualizadoPor;
	@Column(name="atualizado_em", nullable=false) private OffsetDateTime atualizadoEm;
}
