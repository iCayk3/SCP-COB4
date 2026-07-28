package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "sincronizacao_rbx_config")
public class SincronizacaoRbxConfig {
	@Id
	private Long id = 1L;
	@Column(name = "horario_primeira", nullable = false)
	private LocalTime horarioPrimeira = LocalTime.of(4, 0);
	@Column(name = "horario_segunda", nullable = false)
	private LocalTime horarioSegunda = LocalTime.of(20, 45);
	@Column(nullable = false, length = 60)
	private String fusoHorario = "America/Sao_Paulo";
	@Column(nullable = false)
	private boolean ativo = true;
	@Column(name = "ultima_primeira")
	private LocalDate ultimaPrimeira;
	@Column(name = "ultima_segunda")
	private LocalDate ultimaSegunda;
}
