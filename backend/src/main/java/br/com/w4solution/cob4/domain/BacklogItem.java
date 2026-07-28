package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "backlog_itens", uniqueConstraints =
		@UniqueConstraint(name = "uk_backlog_codigo", columnNames = "codigo"))
public class BacklogItem {
	public enum Prioridade { P0, P1, P2, P3 }
	public enum Status { NAO_INICIADO, EM_ANDAMENTO, IMPLEMENTADO, BLOQUEADO }

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false, length = 30)
	private String codigo;
	@Column(nullable = false, length = 200)
	private String titulo;
	@Column(nullable = false, length = 1000)
	private String descricao;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 5)
	private Prioridade prioridade;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 30)
	private Status status;
	@Column(length = 150)
	private String responsavel;
	@Column(name = "criterio_aceite", nullable = false, length = 2000)
	private String criterioAceite;
	@Column(nullable = false)
	private int ordem;
}
