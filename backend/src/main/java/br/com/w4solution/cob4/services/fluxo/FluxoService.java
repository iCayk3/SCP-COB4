package br.com.w4solution.cob4.services.fluxo;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.fluxo.FluxoDTO;
import br.com.w4solution.cob4.dto.fluxo.ValidacaoFluxoDTO;
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
		if (id != null && fluxo.getStatusVersao() == FluxoCobranca.StatusVersao.PUBLICADO)
			throw new IllegalStateException("Versão publicada é imutável; crie uma nova versão");
		if (id != null && dados.rowVersion()!=null && dados.rowVersion()!=fluxo.getRowVersion())
			throw new IllegalStateException("VERSAO_DESATUALIZADA: recarregue o fluxo antes de salvar");
		String codigo = id == null ? codigoUnico(dados.codigo(), dados.nome()) : fluxo.getCodigo();
		if (id != null) {
			Set<String> novos = dados.estados().stream().map(FluxoDTO.EstadoDTO::codigo).collect(Collectors.toSet());
			if (!novos.containsAll(cobrancaRepository.buscarEstadosEmUso(codigo))) {
				throw new IllegalStateException("Não é possível remover um estado utilizado por processos");
			}
		}
		OffsetDateTime agora = OffsetDateTime.now();
		fluxo.setCodigo(codigo);
		if (fluxo.getCodigoOrigem() == null) fluxo.setCodigoOrigem(dados.codigoOrigem()==null?codigo:dados.codigoOrigem());
		if (dados.versao()!=null && dados.versao()>0) fluxo.setVersao(dados.versao());
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

	@Transactional public FluxoDTO publicar(Long id){
		FluxoCobranca fluxo=fluxoRepository.findById(id).orElseThrow(()->new IllegalArgumentException("Fluxo não encontrado"));
		if(fluxo.getStatusVersao()!=FluxoCobranca.StatusVersao.RASCUNHO)throw new IllegalStateException("Somente rascunho pode ser publicado");
		var resultado=validarVersao(id);if(!resultado.valido())throw new IllegalStateException("Fluxo invalido: "+String.join("; ",resultado.problemas()));
		fluxo.setStatusVersao(FluxoCobranca.StatusVersao.PUBLICADO); fluxo.setPublicadoEm(OffsetDateTime.now());
		fluxo.setAtualizadoEm(OffsetDateTime.now()); return dto(fluxoRepository.save(fluxo));
	}
	@Transactional(readOnly=true) public ValidacaoFluxoDTO validarVersao(Long id){
		FluxoCobranca f=fluxoRepository.findById(id).orElseThrow(()->new IllegalArgumentException("Fluxo não encontrado"));FluxoDTO d=dto(f);var problemas=new ArrayList<String>();
		try{validar(d);}catch(RuntimeException e){problemas.add(e.getMessage());}
		String inicial=d.estados().stream().filter(FluxoDTO.EstadoDTO::inicial).map(FluxoDTO.EstadoDTO::codigo).findFirst().orElse(null);Set<String> alcance=new LinkedHashSet<>();if(inicial!=null){alcance.add(inicial);boolean mudou;do{mudou=false;for(var t:d.transicoes())if(alcance.contains(t.origemCodigo())&&alcance.add(t.destinoCodigo()))mudou=true;}while(mudou);}
		d.estados().stream().filter(e->!alcance.contains(e.codigo())).forEach(e->problemas.add("Estado orfao: "+e.codigo()));
		return new ValidacaoFluxoDTO(id,f.getVersao(),problemas.isEmpty(),List.copyOf(problemas),List.copyOf(alcance));
	}
	@Transactional public FluxoDTO desativar(Long id){FluxoCobranca f=fluxoRepository.findById(id).orElseThrow(()->new IllegalArgumentException("Fluxo não encontrado"));if(cobrancaRepository.existsByFluxoCodigoAndStatusIn(f.getCodigo(),List.of(Cobranca.Status.ABERTA,Cobranca.Status.EM_ANDAMENTO)))throw new IllegalStateException("Fluxo possui processos ativos");f.setAtivo(false);f.setPadrao(false);f.setStatusVersao(FluxoCobranca.StatusVersao.DESATIVADO);f.setAtualizadoEm(OffsetDateTime.now());return dto(fluxoRepository.save(f));}

	@Transactional public FluxoDTO novaVersao(Long id){
		FluxoCobranca origem=fluxoRepository.findById(id).orElseThrow(()->new IllegalArgumentException("Fluxo não encontrado"));
		FluxoDTO atual=dto(origem); FluxoDTO copia=new FluxoDTO(null,origem.getCodigoOrigem(),origem.getNome(),true,false,
				atual.estados(),atual.transicoes(),origem.getVersao()+1,"RASCUNHO",origem.getCodigoOrigem(),null);
		return salvar(null,copia);
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
								t.isAutomatica(), t.getHorasSemResposta())).toList(), fluxo.getVersao(),
				fluxo.getStatusVersao().name(), fluxo.getCodigoOrigem(), fluxo.getRowVersion());
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
