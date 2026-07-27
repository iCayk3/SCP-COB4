package br.com.w4solution.cob4.services.regra;

import br.com.w4solution.cob4.dto.regra.RegraNegocioDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegraNegocioService {
	private static final String MODULO = "PROCESSOS";

	public List<RegraNegocioDTO> listar() {
		return java.util.stream.Stream.concat(java.util.stream.Stream.concat(List.of(
			regra("RN-001", "Unicidade de processo ativo",
					"Nunca existirão dois processos ativos para a mesma fatura.", "Automática", "Crítica",
					"Recebimento de inadimplência do RBX",
					List.of("Reutilizar o processo ativo", "Vincular a fatura sem duplicação"), List.of()),
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
		).stream(), regrasAtendimento().stream()), regrasTimeline().stream()).toList();
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
