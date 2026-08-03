package br.com.w4solution.cob4.dto.api;

import org.springframework.data.domain.Page;
import java.util.List;
import java.util.function.Function;

public record PaginaDTO<T>(List<T> itens, int pagina, int tamanho, long totalElementos,
		int totalPaginas, boolean primeira, boolean ultima) {
	public static <S, T> PaginaDTO<T> de(Page<S> pagina, Function<S, T> mapper) {
		return new PaginaDTO<>(pagina.getContent().stream().map(mapper).toList(), pagina.getNumber(),
				pagina.getSize(), pagina.getTotalElements(), pagina.getTotalPages(), pagina.isFirst(), pagina.isLast());
	}
}
