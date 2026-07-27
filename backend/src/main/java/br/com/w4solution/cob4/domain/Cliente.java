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
@Table(name = "clientes")
public class Cliente {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "cpf", nullable = false, unique = true, length = 14)
	private String cpf;

	@Column(name = "rbx_codigo", length = 80)
	private String rbxCodigo;

	@Column(name = "nome_completo", nullable = false)
	private String nomeCompleto;

	@Column(length = 80)
	private String telefone;

	@Column(length = 254)
	private String email;

	@Column(name = "atualizado_em", nullable = false)
	private OffsetDateTime atualizadoEm;
}
