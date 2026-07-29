package br.com.w4solution.cob4.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
	@ExceptionHandler(BadCredentialsException.class)
	ResponseEntity<Map<String, Object>> credenciais() {
		return resposta(HttpStatus.UNAUTHORIZED, "Credenciais invalidas");
	}

	@ExceptionHandler(AccessDeniedException.class)
	ResponseEntity<Map<String, Object>> acessoNegado() {
		return resposta(HttpStatus.FORBIDDEN, "Acesso negado");
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	ResponseEntity<Map<String, Object>> validacao(MethodArgumentNotValidException erro) {
		String mensagem = erro.getBindingResult().getFieldErrors().stream().findFirst()
				.map(item -> item.getField() + ": " + item.getDefaultMessage())
				.orElse("Dados invalidos");
		return resposta(HttpStatus.BAD_REQUEST, mensagem);
	}

	@ExceptionHandler(IllegalArgumentException.class)
	ResponseEntity<Map<String, Object>> argumento(IllegalArgumentException erro) {
		return resposta(HttpStatus.BAD_REQUEST, erro.getMessage());
	}

	@ExceptionHandler(IllegalStateException.class)
	ResponseEntity<Map<String, Object>> estado(IllegalStateException erro) {
		return resposta(HttpStatus.CONFLICT, erro.getMessage());
	}

	@ExceptionHandler(Exception.class)
	ResponseEntity<Map<String, Object>> inesperado() {
		return resposta(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno");
	}

	private ResponseEntity<Map<String, Object>> resposta(HttpStatus status, String mensagem) {
		return ResponseEntity.status(status).body(Map.of(
				"timestamp", OffsetDateTime.now().toString(),
				"status", status.value(),
				"message", mensagem == null ? status.getReasonPhrase() : mensagem));
	}
}
