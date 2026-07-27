package br.com.w4solution.cob4.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "logs_auditoria")
public class LogAuditoria {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false, length = 80)
	private String evento;
	@Column(length = 14)
	private String cpf;
	@Column(name = "cliente_nome")
	private String clienteNome;
	@Column(name = "usuario_nome")
	private String usuarioNome;
	@Column(name = "usuario_identificador")
	private String usuarioIdentificador;
	@Column(name = "cobranca_referencia", length = 50)
	private String cobrancaReferencia;
	@Column(name = "boleto_referencia", length = 120)
	private String boletoReferencia;
	@Column(nullable = false, length = 1000)
	private String descricao;
	@Column(name = "criado_em", nullable = false)
	private OffsetDateTime criadoEm;
}
