package br.com.w4solution.cob4.config;

import br.com.w4solution.cob4.domain.PoliticaLgpd;
import br.com.w4solution.cob4.repositories.PoliticaLgpdRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PoliticaLgpdInicializador implements ApplicationRunner {
	private final PoliticaLgpdRepository repository;
	public PoliticaLgpdInicializador(PoliticaLgpdRepository repository) { this.repository = repository; }
	@Override
	public void run(ApplicationArguments args) {
		if (repository.count() > 0) return;
		repository.saveAll(List.of(
				p("IDENTIFICACAO_CLIENTE", "Identificação do cliente", "CPF e nome completo",
						"Identificar o titular e associar contratos e protocolos de cobrança.", "RBX",
						"Operador da carteira, supervisor, financeiro, gerente e administrador", PoliticaLgpd.DestinoFinal.ANONIMIZAR),
				p("CONTATO", "Dados de contato", "Telefone e identificadores de WhatsApp",
						"Realizar comunicações relacionadas à cobrança.", "RBX e titular",
						"Operador da carteira e supervisor", PoliticaLgpd.DestinoFinal.ELIMINAR),
				p("CONTRATOS_DIVIDAS", "Contratos e débitos", "Contrato, boletos, vencimentos, valores e situação",
						"Executar cobrança, negociação, baixa e defesa de direitos.", "RBX",
						"Operador da carteira, supervisor, financeiro, gerente e jurídico encaminhado", PoliticaLgpd.DestinoFinal.CONSERVAR_BLOQUEADO),
				p("ATENDIMENTOS", "Atendimentos", "Mensagens, resultados, observações e próximas ações",
						"Documentar comunicações e dar continuidade ao atendimento.", "Titular e operador",
						"Operador da carteira, supervisor e gerente", PoliticaLgpd.DestinoFinal.ANONIMIZAR),
				p("COMPROVANTES", "Comprovantes financeiros", "Arquivo ou referência de comprovante de pagamento",
						"Validar pagamentos não confirmados automaticamente no RBX.", "Titular e operador",
						"Financeiro, supervisor e gerente", PoliticaLgpd.DestinoFinal.ELIMINAR),
				p("AUDITORIA", "Auditoria e segurança", "Identificador do usuário, data, ação, protocolo e motivo",
						"Demonstrar conformidade, prevenir fraude e investigar incidentes.", "SGC",
						"Administrador, gerente e auditor autorizado", PoliticaLgpd.DestinoFinal.ANONIMIZAR),
				p("CAMPO", "Operação de campo", "Identificação, contato, contrato e endereço quando disponível",
						"Executar visita ou retirada formalmente encaminhada.", "RBX e protocolo",
						"Equipe de campo designada e supervisor", PoliticaLgpd.DestinoFinal.ELIMINAR),
				p("JURIDICO", "Dossiê jurídico", "Identificação, contrato, dívida, histórico e documentos necessários",
						"Exercer direitos em processo judicial, administrativo ou arbitral.", "SGC e RBX",
						"Jurídico designado, gerente e administrador", PoliticaLgpd.DestinoFinal.CONSERVAR_BLOQUEADO),
				p("INCIDENTES", "Incidentes de segurança", "Dados afetados, titulares, impacto, evidências e resposta",
						"Investigar, mitigar e cumprir deveres de comunicação.", "SGC, infraestrutura e relato",
						"Encarregado, segurança, jurídico e representante legal", PoliticaLgpd.DestinoFinal.CONSERVAR_BLOQUEADO)
		));
	}
	private PoliticaLgpd p(String codigo, String categoria, String dados, String finalidade, String origem,
						   String perfis, PoliticaLgpd.DestinoFinal destino) {
		var p = new PoliticaLgpd(); p.setCodigo(codigo); p.setCategoria(categoria); p.setDadosPessoais(dados);
		p.setFinalidade(finalidade);
		p.setBaseLegal("Pendente de validação do encarregado: obrigação legal/regulatória, execução de contrato ou exercício regular de direitos, conforme o caso");
		p.setOrigem(origem); p.setPerfisAcesso(perfis); p.setDestinoFinal(destino);
		p.setStatusAprovacao(PoliticaLgpd.StatusAprovacao.PENDENTE_APROVACAO);
		p.setObservacaoAprovacao("Definir prazo com jurídico/encarregado antes de automatizar eliminação ou anonimização.");
		return p;
	}
}
