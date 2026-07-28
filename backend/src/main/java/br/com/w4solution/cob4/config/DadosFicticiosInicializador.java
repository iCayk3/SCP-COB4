package br.com.w4solution.cob4.config;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.repositories.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Component
public class DadosFicticiosInicializador implements ApplicationRunner {
	private final ClienteRepository clienteRepository;
	private final CobrancaRepository cobrancaRepository;
	private final CobrancaBoletoRepository boletoRepository;
	private final HistoricoAtrasoRepository historicoRepository;
	private final ProcessoTimelineRepository timelineRepository;
	private final TarefaCobrancaRepository tarefaRepository;
	private final boolean habilitado;

	public DadosFicticiosInicializador(ClienteRepository clienteRepository,
									   CobrancaRepository cobrancaRepository,
									   CobrancaBoletoRepository boletoRepository,
									   HistoricoAtrasoRepository historicoRepository,
									   ProcessoTimelineRepository timelineRepository,
									   TarefaCobrancaRepository tarefaRepository,
									   @Value("${sgc.demo.dados-ficticios:true}") boolean habilitado) {
		this.clienteRepository = clienteRepository;
		this.cobrancaRepository = cobrancaRepository;
		this.boletoRepository = boletoRepository;
		this.historicoRepository = historicoRepository;
		this.timelineRepository = timelineRepository;
		this.tarefaRepository = tarefaRepository;
		this.habilitado = habilitado;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		if (!habilitado || cobrancaRepository.count() > 0) return;
		OffsetDateTime agora = OffsetDateTime.now();
		List<DadoDemo> demos = List.of(
				new DadoDemo("11122233344", "CLI-DEMO-001", "Mariana Lopes", "(11) 98888-1201",
						"mariana.lopes@example.com", "CTR-DEMO-1001", "DEMO-001", 5,
						new BigDecimal("189.90"), Cobranca.FaixaAtraso.F1_RECENTE, Cobranca.Prioridade.BAIXA),
				new DadoDemo("22233344455", "CLI-DEMO-002", "Carlos Andrade", "(21) 97777-4520",
						"carlos.andrade@example.com", "CTR-DEMO-2044", "DEMO-002", 18,
						new BigDecimal("742.35"), Cobranca.FaixaAtraso.F3_INTERMEDIARIO, Cobranca.Prioridade.ALTA),
				new DadoDemo("33344455566", "CLI-DEMO-003", "Renata Martins", "(31) 96666-9033",
						"renata.martins@example.com", "CTR-DEMO-3098", "DEMO-003", 64,
						new BigDecimal("1280.00"), Cobranca.FaixaAtraso.F5_CRITICO, Cobranca.Prioridade.CRITICA)
		);
		for (DadoDemo demo : demos) {
			criarDemo(demo, agora);
		}
	}

	private void criarDemo(DadoDemo demo, OffsetDateTime agora) {
		Cliente cliente = new Cliente();
		cliente.setCpf(demo.cpf());
		cliente.setRbxCodigo(demo.codigoRbx());
		cliente.setNomeCompleto(demo.nome());
		cliente.setTelefone(demo.telefone());
		cliente.setEmail(demo.email());
		cliente.setAtualizadoEm(agora);
		clienteRepository.save(cliente);

		Cobranca cobranca = new Cobranca();
		cobranca.setReferencia(demo.referencia());
		cobranca.setCliente(cliente);
		cobranca.setCpfAgregador(demo.cpf());
		cobranca.setStatus(Cobranca.Status.ABERTA);
		cobranca.setValorTotal(demo.valor());
		cobranca.setDiasAtraso(demo.diasAtraso());
		cobranca.setFaixaAtraso(demo.faixa());
		cobranca.setContratoReferencia(demo.contrato());
		cobranca.setOperadorNome("Dados ficticios");
		cobranca.setOperadorIdentificador("DEMO");
		cobranca.setResponsavelNome("Fila de Cobranca");
		cobranca.setResponsavelIdentificador("FILA_COBRANCA");
		cobranca.setPrioridade(demo.prioridade());
		cobranca.setSlaHoras(24);
		cobranca.setCriadaEm(agora.minusDays(demo.diasAtraso()));
		cobranca.setAtualizadaEm(agora);
		cobranca.setUltimaMovimentacaoEm(agora.minusHours(2));
		cobrancaRepository.save(cobranca);

		LocalDate vencimento = LocalDate.now().minusDays(demo.diasAtraso());
		CobrancaBoleto boleto = new CobrancaBoleto();
		boleto.setCobranca(cobranca);
		boleto.setRbxDocumento("DEMO:" + demo.referencia() + ":1");
		boleto.setContratoReferencia(demo.contrato());
		boleto.setValor(demo.valor());
		boleto.setVencimento(vencimento);
		boleto.setPrimeiraDeteccaoEm(agora);
		boleto.setUltimaDeteccaoEm(agora);
		boletoRepository.save(boleto);

		HistoricoAtraso historico = new HistoricoAtraso();
		historico.setCpf(demo.cpf());
		historico.setClienteNome(demo.nome());
		historico.setBoletoReferencia(boleto.getRbxDocumento());
		historico.setContratoReferencia(demo.contrato());
		historico.setValor(demo.valor());
		historico.setVencimento(vencimento);
		historico.setDiasAtraso(demo.diasAtraso());
		historico.setSituacao("EM_ATRASO");
		historico.setPrimeiraDeteccaoEm(agora);
		historico.setUltimaDeteccaoEm(agora);
		historicoRepository.save(historico);

		ProcessoTimeline timeline = new ProcessoTimeline();
		timeline.setCobranca(cobranca);
		timeline.setEvento("PROCESSO_DEMO_CRIADO");
		timeline.setDescricao("Dado ficticio criado para uso enquanto a sincronizacao RBX nao retorna dados.");
		timeline.setAutorNome("Sistema");
		timeline.setAutorIdentificador("DEMO");
		timeline.setCriadoEm(agora);
		timelineRepository.save(timeline);

		TarefaCobranca tarefa = new TarefaCobranca();
		tarefa.setCobranca(cobranca);
		tarefa.setTipo("PRIMEIRO_CONTATO_WHATSAPP");
		tarefa.setTitulo("Realizar primeiro contato por WhatsApp");
		tarefa.setPrioridade(demo.prioridade());
		tarefa.setResponsavelNome(cobranca.getResponsavelNome());
		tarefa.setResponsavelIdentificador(cobranca.getResponsavelIdentificador());
		tarefa.setCriadaEm(agora);
		tarefa.setPrazoEm(agora.plusMinutes(30));
		tarefaRepository.save(tarefa);
	}

	private record DadoDemo(String cpf, String codigoRbx, String nome, String telefone, String email,
							String contrato, String referencia, int diasAtraso, BigDecimal valor,
							Cobranca.FaixaAtraso faixa, Cobranca.Prioridade prioridade) {}
}
