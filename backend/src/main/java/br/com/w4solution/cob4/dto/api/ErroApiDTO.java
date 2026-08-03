package br.com.w4solution.cob4.dto.api;

import java.time.OffsetDateTime;
import java.util.Map;

public record ErroApiDTO(
		OffsetDateTime timestamp,
		int status,
		String codigo,
		String message,
		Map<String, String> campos,
		String traceId
) {}
