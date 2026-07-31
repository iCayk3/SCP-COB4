package br.com.w4solution.cob4.config;

import br.com.w4solution.cob4.domain.BacklogItem;
import br.com.w4solution.cob4.repositories.BacklogItemRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BacklogInicializador implements ApplicationRunner {
	private final BacklogItemRepository repository;
	public BacklogInicializador(BacklogItemRepository repository) { this.repository = repository; }

	@Override
	public void run(ApplicationArguments args) {
		if (repository.count() > 0) return;
		repository.saveAll(List.of(
				i("BL-001", "Protocolo por contrato", BacklogItem.Prioridade.P0, BacklogItem.Status.IMPLEMENTADO, 10,
						"Cada contrato inadimplente possui protocolo próprio e rastreável."),
				i("BL-002", "Operação conjunta por cliente", BacklogItem.Prioridade.P0, BacklogItem.Status.IMPLEMENTADO, 20,
						"Selecionar dois ou mais protocolos do mesmo CPF e executar uma transição atômica."),
				i("BL-003", "Fluxos configuráveis", BacklogItem.Prioridade.P0, BacklogItem.Status.IMPLEMENTADO, 30,
						"Administrador configura estados e transições pela interface."),
				i("BL-004", "Faixas de atraso configuráveis", BacklogItem.Prioridade.P0, BacklogItem.Status.IMPLEMENTADO, 40,
						"Alterações de faixas reclassificam protocolos ativos."),
				i("BL-005", "Catálogos controlados de motivos", BacklogItem.Prioridade.P0, BacklogItem.Status.IMPLEMENTADO, 50,
						"Motivo ativo é obrigatório e observação permanece separada."),
				i("BL-006", "Controle de acesso por papel", BacklogItem.Prioridade.P0, BacklogItem.Status.NAO_INICIADO, 60,
						"Autorizações seguem a matriz RACI aprovada."),
				i("BL-007", "Distribuição de carteira", BacklogItem.Prioridade.P0, BacklogItem.Status.NAO_INICIADO, 70,
						"Supervisor distribui para operador e operador encaminha para campo."),
				i("BL-008", "SLA e filas operacionais", BacklogItem.Prioridade.P0, BacklogItem.Status.EM_ANDAMENTO, 80,
						"Tarefas possuem prazo em horas corridas, alertas e conclusão rastreável."),
				i("BL-009", "Encerramento e reabertura", BacklogItem.Prioridade.P0, BacklogItem.Status.EM_ANDAMENTO, 90,
						"Supervisor ou superior encerra e reabre com motivo controlado."),
				i("BL-010", "Painel de métricas mensais", BacklogItem.Prioridade.P1, BacklogItem.Status.IMPLEMENTADO, 10,
						"Indicadores disponíveis são calculados por competência e exibem fonte e meta."),
				i("BL-011", "Promessas de pagamento", BacklogItem.Prioridade.P1, BacklogItem.Status.IMPLEMENTADO, 20,
						"Registrar valor, vencimento, situação e vínculo com acordos."),
				i("BL-012", "Descontos por perfil", BacklogItem.Prioridade.P1, BacklogItem.Status.IMPLEMENTADO, 30,
						"Limites configurados e exceções passam por aprovação."),
				i("BL-013", "Confirmação financeira", BacklogItem.Prioridade.P1, BacklogItem.Status.IMPLEMENTADO, 40,
						"Financeiro confirma baixa RBX ou comprovante informado."),
				i("BL-014", "Fechamento mensal versionado", BacklogItem.Prioridade.P1, BacklogItem.Status.IMPLEMENTADO, 50,
						"Fechamento do dia 5 preserva versões, cancelamento e substituição."),
				i("BL-015", "Relatórios PDF e planilha", BacklogItem.Prioridade.P1, BacklogItem.Status.IMPLEMENTADO, 60,
						"Exportar resumo PDF e detalhes Excel ou CSV."),
				i("BL-016", "Gestão de visitas e retirada", BacklogItem.Prioridade.P2, BacklogItem.Status.NAO_INICIADO, 10,
						"Distribuir, executar e registrar resultado de campo com SLA."),
				i("BL-017", "Integração jurídica", BacklogItem.Prioridade.P2, BacklogItem.Status.NAO_INICIADO, 20,
						"Encaminhamento e retorno jurídico ficam rastreáveis no protocolo."),
				i("BL-018", "Alertas e escalonamento", BacklogItem.Prioridade.P2, BacklogItem.Status.NAO_INICIADO, 30,
						"SLAs vencidos notificam e escalam conforme responsabilidade."),
				i("BL-019", "Governança LGPD", BacklogItem.Prioridade.P3, BacklogItem.Status.NAO_INICIADO, 10,
						"Retenção, exportação e anonimização possuem política e execução auditável."),
				i("BL-020", "Monitoramento de integrações", BacklogItem.Prioridade.P3, BacklogItem.Status.NAO_INICIADO, 20,
						"Falhas e duração das sincronizações RBX são monitoradas e alertadas.")
		));
	}

	private BacklogItem i(String codigo, String titulo, BacklogItem.Prioridade prioridade,
						  BacklogItem.Status status, int ordem, String aceite) {
		var item = new BacklogItem();
		item.setCodigo(codigo); item.setTitulo(titulo); item.setDescricao(titulo);
		item.setPrioridade(prioridade); item.setStatus(status); item.setOrdem(ordem);
		item.setCriterioAceite(aceite); return item;
	}
}
