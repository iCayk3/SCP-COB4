package br.com.w4solution.cob4.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import br.com.w4solution.cob4.dto.api.ErroApiDTO;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;

@RestControllerAdvice
public class ApiExceptionHandler {
	@ExceptionHandler(BadCredentialsException.class)
	ResponseEntity<ErroApiDTO> credenciais() {
		return resposta(HttpStatus.UNAUTHORIZED, "CREDENCIAIS_INVALIDAS", "Credenciais invalidas", Map.of());
	}

	@ExceptionHandler(AccessDeniedException.class)
	ResponseEntity<ErroApiDTO> acessoNegado() {
		return resposta(HttpStatus.FORBIDDEN, "ACESSO_NEGADO", "Acesso negado", Map.of());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	ResponseEntity<ErroApiDTO> validacao(MethodArgumentNotValidException erro) {
		Map<String, String> campos = new LinkedHashMap<>();
		erro.getBindingResult().getFieldErrors().forEach(item ->
				campos.putIfAbsent(item.getField(), item.getDefaultMessage()));
		return resposta(HttpStatus.BAD_REQUEST, "DADOS_INVALIDOS", "Dados invalidos", campos);
	}

	@ExceptionHandler({MissingServletRequestParameterException.class, MethodArgumentTypeMismatchException.class})
	ResponseEntity<ErroApiDTO> parametro(Exception erro) {
		return resposta(HttpStatus.BAD_REQUEST, "PARAMETRO_INVALIDO", erro.getMessage(), Map.of());
	}

	@ExceptionHandler(NoSuchElementException.class)
	ResponseEntity<ErroApiDTO> naoEncontrado() {
		return resposta(HttpStatus.NOT_FOUND, "RECURSO_NAO_ENCONTRADO", "Recurso nao encontrado", Map.of());
	}

	@ExceptionHandler(IllegalArgumentException.class)
	ResponseEntity<ErroApiDTO> argumento(IllegalArgumentException erro) {
		String mensagem = erro.getMessage() == null ? "Dados invalidos" : erro.getMessage();
		if (mensagem.toLowerCase().contains("nao encontrad")) {
			return resposta(HttpStatus.NOT_FOUND, "RECURSO_NAO_ENCONTRADO", mensagem, Map.of());
		}
		return resposta(HttpStatus.BAD_REQUEST, "REGRA_INVALIDA", mensagem, Map.of());
	}

	@ExceptionHandler(IllegalStateException.class)
	ResponseEntity<ErroApiDTO> estado(IllegalStateException erro) {
		return resposta(HttpStatus.CONFLICT, "CONFLITO_DE_ESTADO", erro.getMessage(), Map.of());
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	ResponseEntity<ErroApiDTO> integridade() {
		return resposta(HttpStatus.CONFLICT, "CONFLITO_DE_INTEGRIDADE",
				"A operacao conflita com um registro existente", Map.of());
	}

	@ExceptionHandler(ObjectOptimisticLockingFailureException.class)
	ResponseEntity<ErroApiDTO> concorrencia() {
		return resposta(HttpStatus.CONFLICT, "VERSAO_DESATUALIZADA",
				"O registro foi alterado por outro usuario; recarregue antes de salvar", Map.of());
	}

	@ExceptionHandler(Exception.class)
	ResponseEntity<ErroApiDTO> inesperado() {
		return resposta(HttpStatus.INTERNAL_SERVER_ERROR, "ERRO_INTERNO", "Erro interno", Map.of());
	}

	private ResponseEntity<ErroApiDTO> resposta(HttpStatus status, String codigo, String mensagem,
			Map<String, String> campos) {
		String traceId = java.util.Optional.ofNullable(org.slf4j.MDC.get("traceId")).orElseGet(() -> UUID.randomUUID().toString());
		return ResponseEntity.status(status).header("X-Trace-Id", traceId).body(new ErroApiDTO(
				OffsetDateTime.now(), status.value(), codigo,
				mensagem == null ? status.getReasonPhrase() : mensagem, campos, traceId));
	}
}
