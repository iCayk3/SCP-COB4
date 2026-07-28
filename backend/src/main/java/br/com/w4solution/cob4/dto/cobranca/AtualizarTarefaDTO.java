package br.com.w4solution.cob4.dto.cobranca;

import br.com.w4solution.cob4.domain.TarefaCobranca;
import jakarta.validation.constraints.NotNull;

public record AtualizarTarefaDTO(@NotNull TarefaCobranca.Status status) {}
