package br.com.w4solution.cob4.services.lgpd;

import br.com.w4solution.cob4.domain.PoliticaLgpd;
import br.com.w4solution.cob4.dto.lgpd.PoliticaLgpdDTO;
import br.com.w4solution.cob4.repositories.PoliticaLgpdRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.OffsetDateTime;
import br.com.w4solution.cob4.security.UsuarioAtualService;

@Service
public class PoliticaLgpdService {
	private final PoliticaLgpdRepository repository;
	private final UsuarioAtualService usuarioAtual;
	@org.springframework.beans.factory.annotation.Autowired
	public PoliticaLgpdService(PoliticaLgpdRepository repository, UsuarioAtualService usuarioAtual) {
		this.repository = repository; this.usuarioAtual = usuarioAtual;
	}
	PoliticaLgpdService(PoliticaLgpdRepository repository) { this(repository, null); }

	@Transactional(readOnly = true)
	public List<PoliticaLgpdDTO> listar() {
		return repository.findAllByOrderByCategoriaAsc().stream().map(this::dto).toList();
	}

	@Transactional
	public PoliticaLgpdDTO atualizar(Long id, PoliticaLgpdDTO dados) {
		var politica = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Política LGPD não encontrada"));
		if (!politica.getCodigo().equals(dados.codigo())) throw new IllegalArgumentException("O código da política é imutável");
		if (dados.statusAprovacao() == PoliticaLgpd.StatusAprovacao.APROVADA && dados.retencaoMeses() == null) {
			throw new IllegalArgumentException("Uma política aprovada deve possuir prazo de retenção definido");
		}
		politica.setCategoria(dados.categoria().trim()); politica.setDadosPessoais(dados.dadosPessoais().trim());
		politica.setFinalidade(dados.finalidade().trim()); politica.setBaseLegal(dados.baseLegal().trim());
		politica.setOrigem(dados.origem().trim()); politica.setPerfisAcesso(dados.perfisAcesso().trim());
		politica.setRetencaoMeses(dados.retencaoMeses()); politica.setDestinoFinal(dados.destinoFinal());
		var statusAnterior = politica.getStatusAprovacao();
		politica.setStatusAprovacao(dados.statusAprovacao());
		politica.setObservacaoAprovacao(limpar(dados.observacaoAprovacao()));
		if (dados.statusAprovacao() == PoliticaLgpd.StatusAprovacao.APROVADA
				&& statusAnterior != PoliticaLgpd.StatusAprovacao.APROVADA) {
			if (politica.getObservacaoAprovacao() == null) throw new IllegalArgumentException("A aprovação exige parecer, responsável e referência");
			politica.setAprovadaPor(usuarioAtual == null ? "teste" : usuarioAtual.atual().identificador());
			politica.setAprovadaEm(OffsetDateTime.now());
		} else if (dados.statusAprovacao() != PoliticaLgpd.StatusAprovacao.APROVADA) {
			politica.setAprovadaPor(null); politica.setAprovadaEm(null);
		}
		return dto(repository.save(politica));
	}

	private String limpar(String valor) { return valor == null || valor.isBlank() ? null : valor.trim(); }
	private PoliticaLgpdDTO dto(PoliticaLgpd p) {
		return new PoliticaLgpdDTO(p.getId(), p.getCodigo(), p.getCategoria(), p.getDadosPessoais(),
				p.getFinalidade(), p.getBaseLegal(), p.getOrigem(), p.getPerfisAcesso(), p.getRetencaoMeses(),
				p.getDestinoFinal(), p.getStatusAprovacao(), p.getObservacaoAprovacao(),p.getAprovadaPor(),p.getAprovadaEm());
	}
}
