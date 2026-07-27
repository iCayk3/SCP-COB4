package br.com.w4solution.cob4.services.atendimento;

import br.com.w4solution.cob4.domain.Atendimento;
import br.com.w4solution.cob4.domain.AtendimentoMensagem;
import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.dto.atendimento.RegistrarAtendimentoDTO;
import br.com.w4solution.cob4.dto.atendimento.SimulacaoAtendimentoDTO;
import br.com.w4solution.cob4.repositories.AtendimentoRepository;
import br.com.w4solution.cob4.repositories.CobrancaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SimulacaoAtendimentoService {
	private static final String OPERADOR_ID = "IA_SGC_SIMULACAO";
	private final CobrancaRepository cobrancaRepository;
	private final AtendimentoRepository atendimentoRepository;
	private final AtendimentoService atendimentoService;

	public SimulacaoAtendimentoService(CobrancaRepository cobrancaRepository,
									   AtendimentoRepository atendimentoRepository,
									   AtendimentoService atendimentoService) {
		this.cobrancaRepository = cobrancaRepository;
		this.atendimentoRepository = atendimentoRepository;
		this.atendimentoService = atendimentoService;
	}

	@Transactional
	public SimulacaoAtendimentoDTO gerar() {
		List<Cobranca> processos = cobrancaRepository.findByStatusInOrderByAtualizadaEmDesc(
				List.of(Cobranca.Status.ABERTA, Cobranca.Status.EM_ANDAMENTO));
		int criadas = 0;
		for (Cobranca processo : processos) {
			if (atendimentoRepository.existsByCobrancaIdAndOperadorIdentificador(processo.getId(), OPERADOR_ID)) {
				continue;
			}
			atendimentoService.registrar(processo.getReferencia(), conversa(processo));
			criadas++;
		}
		return new SimulacaoAtendimentoDTO(processos.size(), criadas, processos.size() - criadas);
	}

	private RegistrarAtendimentoDTO conversa(Cobranca processo) {
		String primeiroNome = processo.getCliente().getNomeCompleto().split("\\s+")[0];
		String valor = processo.getValorTotal().toPlainString().replace('.', ',');
		List<RegistrarAtendimentoDTO.MensagemDTO> mensagens = new ArrayList<>();
		mensagens.add(msg(AtendimentoMensagem.Autor.OPERADOR,
				"Olá, " + primeiroNome + "! Sou a assistente virtual da SOL. Identificamos uma pendência de R$ "
						+ valor + ". Posso ajudar com a regularização?"));
		int cenario = Math.floorMod(processo.getReferencia().hashCode(), 8);
		Atendimento.Resultado resultado;
		String observacao;
		String proximaAcao;
		switch (cenario) {
			case 0 -> {
				resultado = Atendimento.Resultado.SEM_CONTATO;
				observacao = "Mensagem enviada pela IA, sem resposta do cliente.";
				proximaAcao = "Realizar nova tentativa em 24 horas.";
			}
			case 1 -> {
				mensagens.add(msg(AtendimentoMensagem.Autor.CLIENTE, "Oi, quem está falando?"));
				mensagens.add(msg(AtendimentoMensagem.Autor.OPERADOR, "É a assistente de cobrança da SOL. Posso enviar os dados da pendência?"));
				resultado = Atendimento.Resultado.ATENDEU;
				observacao = "Cliente respondeu, mas ainda não iniciou negociação.";
				proximaAcao = "Retomar o contato e apresentar as opções.";
			}
			case 2 -> {
				mensagens.add(msg(AtendimentoMensagem.Autor.CLIENTE, "Consigo pagar, mas preciso dividir o valor."));
				mensagens.add(msg(AtendimentoMensagem.Autor.OPERADOR, "Certo. Vou encaminhar as opções disponíveis para parcelamento."));
				resultado = Atendimento.Resultado.NEGOCIACAO;
				observacao = "Cliente solicitou parcelamento.";
				proximaAcao = "Operador deve apresentar proposta de negociação.";
			}
			case 3 -> {
				mensagens.add(msg(AtendimentoMensagem.Autor.CLIENTE, "Vou pagar na sexta-feira."));
				mensagens.add(msg(AtendimentoMensagem.Autor.OPERADOR, "Combinado. Registramos sua promessa de pagamento."));
				resultado = Atendimento.Resultado.PROMESSA;
				observacao = "Cliente prometeu efetuar o pagamento na sexta-feira.";
				proximaAcao = "Conferir a baixa após a data prometida.";
			}
			case 4 -> {
				mensagens.add(msg(AtendimentoMensagem.Autor.CLIENTE, "Já fiz o pagamento hoje."));
				mensagens.add(msg(AtendimentoMensagem.Autor.OPERADOR, "Obrigada! Vamos aguardar a compensação bancária."));
				resultado = Atendimento.Resultado.PAGAMENTO;
				observacao = "Cliente informou pagamento realizado.";
				proximaAcao = "Validar compensação no RBX.";
			}
			case 5 -> {
				mensagens.add(msg(AtendimentoMensagem.Autor.CLIENTE, "Não reconheço essa cobrança."));
				mensagens.add(msg(AtendimentoMensagem.Autor.OPERADOR, "Entendi. Vou encaminhar seu caso para análise de um supervisor."));
				resultado = Atendimento.Resultado.SUPERVISOR;
				observacao = "Cliente contestou a cobrança.";
				proximaAcao = "Supervisor deve revisar contrato e boletos.";
			}
			case 6 -> {
				mensagens.add(msg(AtendimentoMensagem.Autor.CLIENTE, "Pode me mandar a segunda via?"));
				mensagens.add(msg(AtendimentoMensagem.Autor.OPERADOR, "Sim. Um operador dará continuidade e enviará a segunda via."));
				resultado = Atendimento.Resultado.ATENDEU;
				observacao = "Cliente solicitou segunda via.";
				proximaAcao = "Enviar segunda via do boleto.";
			}
			default -> {
				mensagens.add(msg(AtendimentoMensagem.Autor.CLIENTE, "Agora não posso falar."));
				mensagens.add(msg(AtendimentoMensagem.Autor.OPERADOR, "Sem problema. Em qual período podemos retornar?"));
				resultado = Atendimento.Resultado.ATENDEU;
				observacao = "Cliente pediu contato em outro momento.";
				proximaAcao = "Tentar contato no próximo período comercial.";
			}
		}
		return new RegistrarAtendimentoDTO(Atendimento.Canal.CHAT, resultado, observacao, proximaAcao,
				"IA SGC (simulação)", OPERADOR_ID, mensagens);
	}

	private RegistrarAtendimentoDTO.MensagemDTO msg(AtendimentoMensagem.Autor autor, String texto) {
		return new RegistrarAtendimentoDTO.MensagemDTO(autor, texto);
	}
}
