package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.PromessaPagamento;
import br.com.w4solution.cob4.domain.TarefaCobranca;
import br.com.w4solution.cob4.dto.cobranca.ClienteVisao360DTO;
import br.com.w4solution.cob4.dto.cobranca.ProcessoDetalheDTO;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.security.PerfilUsuario;
import br.com.w4solution.cob4.security.UsuarioAtualService;
import br.com.w4solution.cob4.services.fluxo.EstadoProcessoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProcessoConsultaService {
	private final CobrancaRepository cobrancas;
	private final CobrancaBoletoRepository boletos;
	private final AtendimentoRepository atendimentos;
	private final ProcessoTimelineRepository timeline;
	private final TarefaCobrancaRepository tarefas;
	private final PromessaPagamentoRepository promessas;
	private final EstadoProcessoService estados;
	private final UsuarioAtualService usuarioAtual;

	public ProcessoConsultaService(CobrancaRepository cobrancas, CobrancaBoletoRepository boletos,
			AtendimentoRepository atendimentos, ProcessoTimelineRepository timeline,
			TarefaCobrancaRepository tarefas, PromessaPagamentoRepository promessas,
			EstadoProcessoService estados, UsuarioAtualService usuarioAtual) {
		this.cobrancas = cobrancas; this.boletos = boletos; this.atendimentos = atendimentos;
		this.timeline = timeline; this.tarefas = tarefas; this.promessas = promessas;
		this.estados = estados; this.usuarioAtual = usuarioAtual;
	}

	@Transactional(readOnly = true)
	public ProcessoDetalheDTO consultar(String referencia) {
		return dto(cobrancas.findByReferencia(referencia)
				.orElseThrow(() -> new java.util.NoSuchElementException("Processo nao encontrado")));
	}

	@Transactional(readOnly = true)
	public ClienteVisao360DTO cliente(String cpf) {
		List<Cobranca> encontrados = cobrancas.findByCpfAgregadorOrderByCriadaEmDesc(cpf);
		if (encontrados.isEmpty()) throw new java.util.NoSuchElementException("Cliente nao encontrado");
		var cliente = encontrados.getFirst().getCliente();
		List<ProcessoDetalheDTO> detalhes = encontrados.stream().map(this::dto).toList();
		BigDecimal total = encontrados.stream().filter(c -> !c.encerrada()).map(Cobranca::getValorTotal)
				.reduce(BigDecimal.ZERO, BigDecimal::add);
		return new ClienteVisao360DTO(cliente.getCpf(), cliente.getNomeCompleto(), cliente.getTelefone(),
				cliente.getEmail(), cliente.getRbxCodigo(), total, detalhes);
	}

	private ProcessoDetalheDTO dto(Cobranca c) {
		var estado = estados.consultar(c.getReferencia());
		var usuario = usuarioAtual.atual();
		List<String> acoes = new ArrayList<>();
		if (!c.encerrada()) {
			acoes.add("REGISTRAR_ATENDIMENTO"); acoes.add("AGENDAR"); acoes.add("ANEXAR");
			acoes.add("REGISTRAR_PROMESSA");
		}
		if (usuario.perfil() == PerfilUsuario.SUPERVISOR || usuario.perfil() == PerfilUsuario.GERENTE
				|| usuario.perfil() == PerfilUsuario.ADMINISTRADOR) {
			acoes.add("REDISTRIBUIR"); acoes.add(c.encerrada() ? "REABRIR" : "ENCERRAR");
		}
		if (usuario.perfil() == PerfilUsuario.FINANCEIRO || usuario.perfil() == PerfilUsuario.GERENTE
				|| usuario.perfil() == PerfilUsuario.ADMINISTRADOR) {
			acoes.add("REGISTRAR_PAGAMENTO"); acoes.add("ESTORNAR_PAGAMENTO");
		}
		List<ProcessoDetalheDTO.BoletoDTO> titulos = boletos.findByCobrancaOrderByVencimentoAsc(c).stream()
				.map(b -> new ProcessoDetalheDTO.BoletoDTO(b.getRbxDocumento(), b.getValor(), b.getVencimento(), b.isAtivo()))
				.toList();
		long pendentes = tarefas.findByCobrancaReferenciaOrderByPrazoEmAsc(c.getReferencia()).stream()
				.filter(t -> t.getStatus() == TarefaCobranca.Status.PENDENTE || t.getStatus() == TarefaCobranca.Status.EM_ANDAMENTO).count();
		long promessasAbertas = promessas.findByCobrancaReferenciaOrderByCriadaEmDesc(c.getReferencia()).stream()
				.filter(p -> p.getStatus() == PromessaPagamento.Status.ABERTA).count();
		return new ProcessoDetalheDTO(c.getReferencia(),
				new ProcessoDetalheDTO.ClienteDTO(c.getCliente().getCpf(), c.getCliente().getNomeCompleto(),
						c.getCliente().getTelefone(), c.getCliente().getEmail(), c.getCliente().getRbxCodigo()),
				c.getContratoReferencia(), c.getStatus().name(), c.getPrioridade().name(), c.getValorTotal(),
				c.getDiasAtraso(), c.getFaixaAtraso().name(),
				new ProcessoDetalheDTO.ResponsavelDTO(c.getResponsavelIdentificador(), c.getResponsavelNome()),
				new ProcessoDetalheDTO.SlaDTO(c.getSlaHoras(), c.getEstadoFluxoDesde(), c.getSlaPausadoEm(),
						c.getSlaEscalonamentoNivel(), c.getSlaAlertadoEm()),
				new ProcessoDetalheDTO.FluxoDTO(estado.fluxoCodigo(), estado.estadoCodigo(), estado.destinos().stream()
						.map(d -> new ProcessoDetalheDTO.DestinoDTO(d.codigo(), d.nome(), d.transicao())).toList()),
				titulos, new ProcessoDetalheDTO.ResumoRelacionadosDTO(
						atendimentos.findByCobrancaReferenciaOrderByRealizadoEmDesc(c.getReferencia()).size(),
						timeline.findByCobrancaReferenciaOrderByCriadoEmAscIdAsc(c.getReferencia()).size(), pendentes, promessasAbertas),
				List.copyOf(acoes), c.getCriadaEm(), c.getAtualizadaEm(), c.getEncerradaEm());
	}
}
