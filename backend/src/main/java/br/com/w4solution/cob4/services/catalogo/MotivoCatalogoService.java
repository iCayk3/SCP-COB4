package br.com.w4solution.cob4.services.catalogo;

import br.com.w4solution.cob4.domain.MotivoCatalogo;
import br.com.w4solution.cob4.dto.catalogo.MotivoCatalogoDTO;
import br.com.w4solution.cob4.repositories.MotivoCatalogoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

@Service
public class MotivoCatalogoService {
	private final MotivoCatalogoRepository repository;

	public MotivoCatalogoService(MotivoCatalogoRepository repository) {
		this.repository = repository;
	}

	@Transactional(readOnly = true)
	public List<MotivoCatalogoDTO> listar(MotivoCatalogo.Tipo tipo, boolean somenteAtivos) {
		var motivos = tipo != null && somenteAtivos
				? repository.findByTipoAndAtivoTrueOrderByOrdemAscNomeAsc(tipo)
				: repository.findAllByOrderByTipoAscOrdemAscNomeAsc().stream()
					.filter(m -> tipo == null || m.getTipo() == tipo)
					.filter(m -> !somenteAtivos || m.isAtivo()).toList();
		return motivos.stream().map(this::dto).toList();
	}

	@Transactional
	public List<MotivoCatalogoDTO> salvar(List<MotivoCatalogoDTO> dados) {
		if (dados == null || dados.isEmpty()) {
			throw new IllegalArgumentException("Informe ao menos um motivo");
		}
		for (var entrada : dados) {
			MotivoCatalogo motivo;
			if (entrada.id() == null) {
				motivo = new MotivoCatalogo();
				motivo.setTipo(entrada.tipo());
				motivo.setCodigo(normalizarCodigo(entrada.codigo()));
				if (repository.findByTipoAndCodigo(motivo.getTipo(), motivo.getCodigo()).isPresent()) {
					throw new IllegalArgumentException("Já existe o motivo " + motivo.getCodigo() + " nesse catálogo");
				}
			} else {
				motivo = repository.findById(entrada.id())
						.orElseThrow(() -> new IllegalArgumentException("Motivo não encontrado"));
				if (motivo.getTipo() != entrada.tipo()
						|| !motivo.getCodigo().equals(normalizarCodigo(entrada.codigo()))) {
					throw new IllegalArgumentException("O tipo e o código de um motivo não podem ser alterados");
				}
			}
			motivo.setNome(entrada.nome().trim());
			motivo.setDescricao(limpar(entrada.descricao()));
			motivo.setAtivo(entrada.ativo());
			motivo.setOrdem(entrada.ordem());
			motivo.setExigeObservacao(entrada.exigeObservacao());
			repository.save(motivo);
		}
		return listar(null, false);
	}

	@Transactional(readOnly = true)
	public MotivoCatalogo validarAtivo(MotivoCatalogo.Tipo tipo, String codigo, String observacao) {
		if (codigo == null || codigo.isBlank()) {
			throw new IllegalArgumentException("Selecione um motivo do catálogo " + tipo);
		}
		var motivo = repository.findByTipoAndCodigo(tipo, normalizarCodigo(codigo))
				.filter(MotivoCatalogo::isAtivo)
				.orElseThrow(() -> new IllegalArgumentException("Motivo inexistente ou inativo para " + tipo));
		if (motivo.isExigeObservacao() && (observacao == null || observacao.isBlank())) {
			throw new IllegalArgumentException("O motivo " + motivo.getNome() + " exige uma observação");
		}
		return motivo;
	}

	public MotivoCatalogo.Tipo tipoParaDestino(String destino) {
		return switch (destino) {
			case "VISITA" -> MotivoCatalogo.Tipo.VISITA;
			case "RETIRADA" -> MotivoCatalogo.Tipo.RETIRADA;
			case "JURIDICO" -> MotivoCatalogo.Tipo.JURIDICO;
			case "ENCERRADO" -> MotivoCatalogo.Tipo.ENCERRAMENTO;
			default -> MotivoCatalogo.Tipo.MOVIMENTACAO;
		};
	}

	private String normalizarCodigo(String valor) {
		if (valor == null || valor.isBlank()) throw new IllegalArgumentException("Informe o código do motivo");
		return Normalizer.normalize(valor.trim(), Normalizer.Form.NFD)
				.replaceAll("\\p{M}", "").replaceAll("[^A-Za-z0-9]+", "_")
				.replaceAll("^_+|_+$", "").toUpperCase(Locale.ROOT);
	}

	private String limpar(String valor) {
		return valor == null || valor.isBlank() ? null : valor.trim();
	}

	private MotivoCatalogoDTO dto(MotivoCatalogo m) {
		return new MotivoCatalogoDTO(m.getId(), m.getTipo(), m.getCodigo(), m.getNome(),
				m.getDescricao(), m.isAtivo(), m.getOrdem(), m.isExigeObservacao());
	}
}
