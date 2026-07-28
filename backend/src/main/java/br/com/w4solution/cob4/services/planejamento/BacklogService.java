package br.com.w4solution.cob4.services.planejamento;

import br.com.w4solution.cob4.domain.BacklogItem;
import br.com.w4solution.cob4.dto.planejamento.BacklogItemDTO;
import br.com.w4solution.cob4.repositories.BacklogItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BacklogService {
	private final BacklogItemRepository repository;
	public BacklogService(BacklogItemRepository repository) { this.repository = repository; }

	@Transactional(readOnly = true)
	public List<BacklogItemDTO> listar() {
		return repository.findAllByOrderByPrioridadeAscOrdemAsc().stream().map(this::dto).toList();
	}

	@Transactional
	public BacklogItemDTO atualizar(Long id, BacklogItemDTO dados) {
		var item = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Item do backlog não encontrado"));
		if (!item.getCodigo().equals(dados.codigo())) throw new IllegalArgumentException("O código do backlog é imutável");
		item.setTitulo(dados.titulo().trim()); item.setDescricao(dados.descricao().trim());
		item.setPrioridade(dados.prioridade()); item.setStatus(dados.status());
		item.setResponsavel(limpar(dados.responsavel())); item.setCriterioAceite(dados.criterioAceite().trim());
		item.setOrdem(dados.ordem());
		return dto(repository.save(item));
	}

	private String limpar(String valor) { return valor == null || valor.isBlank() ? null : valor.trim(); }
	private BacklogItemDTO dto(BacklogItem i) {
		return new BacklogItemDTO(i.getId(), i.getCodigo(), i.getTitulo(), i.getDescricao(),
				i.getPrioridade(), i.getStatus(), i.getResponsavel(), i.getCriterioAceite(), i.getOrdem());
	}
}
