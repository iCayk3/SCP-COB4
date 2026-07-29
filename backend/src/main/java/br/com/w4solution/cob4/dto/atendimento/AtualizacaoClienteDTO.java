package br.com.w4solution.cob4.dto.atendimento;
import jakarta.validation.constraints.*;
public record AtualizacaoClienteDTO(@Size(max=80) String telefone, @Email @Size(max=254) String email,
	@NotBlank @Size(max=500) String motivo) {}
