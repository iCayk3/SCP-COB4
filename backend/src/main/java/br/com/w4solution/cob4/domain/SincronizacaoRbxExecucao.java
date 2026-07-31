package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "sincronizacoes_rbx_execucoes")
public class SincronizacaoRbxExecucao {
	public enum Status { SUCESSO, FALHA }

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name = "chave_idempotencia", length = 120)
	private String chaveIdempotencia;
	@Column(nullable = false, length = 80)
	private String origem;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
	private Status status;
	@Column(name = "iniciada_em", nullable = false)
	private OffsetDateTime iniciadaEm;
	@Column(name = "finalizada_em", nullable = false)
	private OffsetDateTime finalizadaEm;
	@Column(name = "duracao_ms", nullable = false)
	private long duracaoMs;
	@Column(name = "documentos_recebidos")
	private Integer documentosRecebidos;
	@Column(name = "vencidos")
	private Integer vencidos;
	@Column(name = "cobrancas_criadas")
	private Integer cobrancasCriadas;
	@Column(name = "boletos_criados")
	private Integer boletosCriados;
	@Column(length = 2000)
	private String mensagem;
	@Column(name = "resultado_json", columnDefinition = "text")
	private String resultadoJson;
}
