package br.com.w4solution.cob4.services.regra;

import br.com.w4solution.cob4.dto.regra.RegraNegocioDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegraNegocioService {
	private static final String MODULO = "PROCESSOS";

	public List<RegraNegocioDTO> listar() {
		List<RegraNegocioDTO> processos = List.of(
			regra("RN-001", "Unicidade de processo ativo",
					"Cada contrato possui somente um protocolo ativo por ciclo de inadimplência.", "Automática", "Crítica",
					"Recebimento de inadimplência do RBX",
					List.of("Reutilizar o protocolo do contrato", "Vincular títulos sem duplicação"), List.of()),
			regra("RN-008", "Visão consolidada do cliente",
					"O atendimento exibe todos os protocolos ativos do cliente e a soma dos valores.",
					"Automática", "Alta", "Abertura do atendimento",
					List.of("Listar protocolos por CPF", "Totalizar valores"), List.of()),
			regra("RN-009", "Movimentação multiprotocolo",
					"Protocolos do mesmo cliente podem ser movimentados conjuntamente de forma atômica, mantendo fluxos individuais.",
					"Automática", "Crítica", "Negociação conjunta",
					List.of("Validar todos antes da alteração", "Atualizar todos ou nenhum", "Auditar em cada timeline"), List.of()),
			regra("RN-002", "Identificador único",
					"Cada processo possuirá identificador único no padrão COB-AAAA-NNNNNN.", "Automática", "Alta",
					"Criação do processo", List.of("Gerar identificador sequencial"), List.of()),
			regra("RN-003", "Dados obrigatórios",
					"Todo processo deve possuir cliente, contrato, operador, status, prioridade, SLA e abertura.",
					"Validação", "Crítica", "Criação ou alteração do processo",
					List.of("Rejeitar processo incompleto"), List.of()),
			regra("RN-004", "Responsável obrigatório",
					"Nenhum processo poderá ficar sem responsável.", "Validação", "Crítica",
					"Criação, atribuição ou alteração", List.of("Atribuir à fila padrão", "Rejeitar remoção do responsável"),
					List.of()),
			regra("RN-005", "Controle de SLA",
					"Nenhum processo poderá permanecer sem movimentação por tempo superior ao SLA.",
					"Automática", "Crítica", "Verificação periódica de SLA",
					List.of("Criar alerta na timeline", "Criar tarefa de SLA", "Elevar prioridade"), List.of()),
			regra("RN-006", "Imutabilidade após encerramento",
					"Processos encerrados não poderão ser editados.", "Validação", "Crítica",
					"Tentativa de alteração", List.of("Bloquear alteração"), List.of()),
			regra("RN-007", "Motivo de encerramento",
					"Todo processo encerrado deverá informar o motivo.", "Validação", "Alta",
					"Encerramento do processo", List.of("Exigir e registrar motivo", "Registrar na timeline"), List.of())
		);
		return java.util.stream.Stream.of(processos, regrasAtendimento(), regrasTimeline(), regrasFluxo())
				.flatMap(List::stream).toList();
	}

	private List<RegraNegocioDTO> regrasFluxo() {
		String modulo = "FLUXOS";
		return List.of(
			new RegraNegocioDTO(modulo, "RN-040", "Estado obrigatório",
					"Todo cliente em cobrança deve possuir fluxo e estado operacional definidos.",
					"Validação", "Crítica", "Criação ou movimentação do processo",
					List.of("Atribuir fluxo padrão", "Rejeitar estado vazio"), List.of()),
			new RegraNegocioDTO(modulo, "RN-041", "Transições controladas",
					"O estado somente pode mudar por uma transição configurada no fluxo.",
					"Validação", "Crítica", "Solicitação de mudança de estado",
					List.of("Validar origem e destino", "Registrar novo evento na timeline"), List.of()),
			new RegraNegocioDTO(modulo, "RN-042", "Cadência de contato",
					"O WhatsApp deve ocorrer em até 30 minutos. Sem resposta, uma ligação é agendada após sete dias; o resultado sem contato move o protocolo.",
					"Automática", "Alta", "Verificação periódica de ausência de resposta",
					List.of("Criar tarefa de WhatsApp", "Agendar ligação", "Registrar timeline"), List.of()),
			new RegraNegocioDTO(modulo, "RN-043", "Fluxos configuráveis",
					"Operadores autorizados podem criar e editar estados e transições dos fluxos.",
					"Manual", "Alta", "Configuração administrativa",
					List.of("Validar estado inicial", "Preservar estados em uso"), List.of())
		);
	}

	private List<RegraNegocioDTO> regrasTimeline() {
		String modulo = "TIMELINE";
		return List.of(
			new RegraNegocioDTO(modulo, "RN-030", "Timeline imutável",
					"Eventos registrados na timeline não podem ser alterados.", "Validação", "Crítica",
					"Tentativa de alteração de evento", List.of("Bloquear alteração"), List.of()),
			new RegraNegocioDTO(modulo, "RN-031", "Eventos não podem ser excluídos",
					"Nenhum registro da timeline poderá ser excluído.", "Validação", "Crítica",
					"Tentativa de exclusão de evento", List.of("Bloquear exclusão"), List.of()),
			new RegraNegocioDTO(modulo, "RN-032", "Alterações geram novos eventos",
					"Toda mudança de estado deve ser registrada como um novo evento append-only.",
					"Automática", "Crítica", "Alteração de estado do processo",
					List.of("Preservar evento anterior", "Adicionar novo evento"), List.of())
		);
	}

	private List<RegraNegocioDTO> regrasAtendimento() {
		String modulo = "ATENDIMENTOS";
		return List.of(
			new RegraNegocioDTO(modulo, "RN-020", "Histórico obrigatório",
					"Todo atendimento gera histórico imutável.", "Automática", "Crítica",
					"Registro do atendimento", List.of("Persistir atendimento", "Persistir conversa", "Registrar timeline"), List.of()),
			new RegraNegocioDTO(modulo, "RN-021", "Resultado obrigatório",
					"Não existe atendimento sem um resultado permitido.", "Validação", "Crítica",
					"Conclusão do chat", List.of("Validar resultado"), List.of()),
			new RegraNegocioDTO(modulo, "RN-022", "Dados obrigatórios do atendimento",
					"Canal, resultado, observação e próxima ação são obrigatórios.", "Validação", "Crítica",
					"Salvamento do atendimento", List.of("Rejeitar atendimento incompleto"), List.of()),
			new RegraNegocioDTO(modulo, "RN-023", "Data e hora obrigatórias",
					"Todo atendimento possui data e hora geradas pelo servidor.", "Automática", "Alta",
					"Salvamento do atendimento", List.of("Registrar timestamp do servidor"), List.of()),
			new RegraNegocioDTO(modulo, "RN-024", "Operador obrigatório",
					"Todo atendimento registra nome e identificador textual do operador.", "Validação", "Crítica",
					"Salvamento do atendimento", List.of("Registrar operador no histórico"), List.of())
		);
	}

	private RegraNegocioDTO regra(String codigo, String nome, String descricao, String tipo, String prioridade,
								  String evento, List<String> acoes, List<String> excecoes) {
		return new RegraNegocioDTO(MODULO, codigo, nome, descricao, tipo, prioridade, evento, acoes, excecoes);
	}
}
