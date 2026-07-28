package br.com.w4solution.cob4.services.fluxo;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.fluxo.FluxoDTO;
import br.com.w4solution.cob4.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FluxoService {
	private final FluxoCobrancaRepository fluxoRepository;
	private final FluxoEstadoRepository estadoRepository;
	private final FluxoTransicaoRepository transicaoRepository;
	private final CobrancaRepository cobrancaRepository;

	public FluxoService(FluxoCobrancaRepository fluxoRepository, FluxoEstadoRepository estadoRepository,
						FluxoTransicaoRepository transicaoRepository, CobrancaRepository cobrancaRepository) {
		this.fluxoRepository = fluxoRepository;
		this.estadoRepository = estadoRepository;
		this.transicaoRepository = transicaoRepository;
		this.cobrancaRepository = cobrancaRepository;
	}

	@Transactional(readOnly = true)
	public List<FluxoDTO> listar() {
		return fluxoRepository.findAllByOrderByNomeAsc().stream().map(this::dto).toList();
	}

	@Transactional
	public FluxoDTO salvar(Long id, FluxoDTO dados) {
		validar(dados);
		FluxoCobranca fluxo = id == null ? new FluxoCobranca() : fluxoRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Fluxo não encontrado"));
		String codigo = id == null ? codigoUnico(dados.codigo(), dados.nome()) : fluxo.getCodigo();
		if (id != null) {
			Set<String> novos = dados.estados().stream().map(FluxoDTO.EstadoDTO::codigo).collect(Collectors.toSet());
			if (!novos.containsAll(cobrancaRepository.buscarEstadosEmUso(codigo))) {
				throw new IllegalStateException("Não é possível remover um estado utilizado por processos");
			}
		}
		OffsetDateTime agora = OffsetDateTime.now();
		fluxo.setCodigo(codigo);
		fluxo.setNome(dados.nome().trim());
		fluxo.setAtivo(dados.ativo());
		fluxo.setPadrao(dados.padrao());
		if (fluxo.getCriadoEm() == null) fluxo.setCriadoEm(agora);
		fluxo.setAtualizadoEm(agora);
		fluxoRepository.save(fluxo);
		if (dados.padrao()) {
			fluxoRepository.findAll().stream().filter(item -> !item.getId().equals(fluxo.getId()) && item.isPadrao())
					.forEach(item -> { item.setPadrao(false); item.setAtualizadoEm(agora); });
		}
		transicaoRepository.deleteByFluxoId(fluxo.getId());
		estadoRepository.deleteByFluxoId(fluxo.getId());
		estadoRepository.flush();
		List<FluxoEstado> estados = dados.estados().stream().map(item -> {
			FluxoEstado estado = new FluxoEstado();
			estado.setFluxo(fluxo); estado.setCodigo(normalizar(item.codigo())); estado.setNome(item.nome().trim());
			estado.setOrdem(item.ordem()); estado.setInicial(item.inicial()); estado.setTerminal(item.terminal());
			return estado;
		}).toList();
		estadoRepository.saveAll(estados);
		List<FluxoTransicao> transicoes = dados.transicoes().stream().map(item -> {
			FluxoTransicao transicao = new FluxoTransicao();
			transicao.setFluxo(fluxo); transicao.setOrigemCodigo(normalizar(item.origemCodigo()));
			transicao.setDestinoCodigo(normalizar(item.destinoCodigo())); transicao.setNome(item.nome().trim());
			transicao.setAutomatica(item.automatica()); transicao.setHorasSemResposta(item.horasSemResposta());
			return transicao;
		}).toList();
		transicaoRepository.saveAll(transicoes);
		return dto(fluxo);
	}

	private void validar(FluxoDTO dados) {
		long iniciais = dados.estados().stream().filter(FluxoDTO.EstadoDTO::inicial).count();
		if (iniciais != 1) throw new IllegalArgumentException("O fluxo deve possuir exatamente um estado inicial");
		Set<String> codigos = dados.estados().stream().map(e -> normalizar(e.codigo())).collect(Collectors.toSet());
		if (codigos.size() != dados.estados().size()) throw new IllegalArgumentException("Estados duplicados");
		for (FluxoDTO.TransicaoDTO t : dados.transicoes()) {
			if (!codigos.contains(normalizar(t.origemCodigo())) || !codigos.contains(normalizar(t.destinoCodigo()))) {
				throw new IllegalArgumentException("Toda transição deve apontar para estados existentes");
			}
			if (t.automatica() && (t.horasSemResposta() == null || t.horasSemResposta() <= 0)) {
				throw new IllegalArgumentException("Transição automática deve informar as horas sem resposta");
			}
		}
	}

	private FluxoDTO dto(FluxoCobranca fluxo) {
		return new FluxoDTO(fluxo.getId(), fluxo.getCodigo(), fluxo.getNome(), fluxo.isAtivo(), fluxo.isPadrao(),
				estadoRepository.findByFluxoIdOrderByOrdemAsc(fluxo.getId()).stream()
						.map(e -> new FluxoDTO.EstadoDTO(e.getCodigo(), e.getNome(), e.getOrdem(), e.isInicial(), e.isTerminal())).toList(),
				transicaoRepository.findByFluxoIdOrderByIdAsc(fluxo.getId()).stream()
						.map(t -> new FluxoDTO.TransicaoDTO(t.getOrigemCodigo(), t.getDestinoCodigo(), t.getNome(),
								t.isAutomatica(), t.getHorasSemResposta())).toList());
	}

	private String codigoUnico(String informado, String nome) {
		String base = normalizar(informado == null || informado.isBlank() ? nome : informado);
		String codigo = base; int sufixo = 2;
		while (fluxoRepository.findByCodigo(codigo).isPresent()) codigo = base + "_" + sufixo++;
		return codigo;
	}

	static String normalizar(String valor) {
		return java.text.Normalizer.normalize(valor.trim().toUpperCase(Locale.ROOT), java.text.Normalizer.Form.NFD)
				.replaceAll("\\p{M}", "").replaceAll("[^A-Z0-9]+", "_").replaceAll("^_|_$", "");
	}
}
