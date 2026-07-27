package br.com.w4solution.cob4.services.rbx;

import br.com.w4solution.cob4.dto.rbx.RbxV2Servico;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RbxV2CatalogoService {

	private static final String FONTE = "rbx-v2";

	private static final List<RbxV2Servico> SERVICOS = List.of(
			s("Atendimento", "atendimento.alterarAgendamento", "Alterar agendamento no atendimento", "ticket_appointment_update"),
			s("Atendimento", "atendimento.alterar", "Alterar atendimento em aberto", "ticket_update"),
			s("Atendimento", "atendimento.alterarChecklist", "Alterar checklist de atendimento", "ticket_checklist_update"),
			s("Atendimento", "atendimento.alterarSituacaoOs", "Alterar situacao da ordem de servico", "ticket_os_status_update"),
			s("Atendimento", "atendimento.consultarHorariosAgendamento", "Consultar horarios disponiveis para agendamento", "consult_appointments"),
			s("Atendimento", "atendimento.consultarModos", "Consultar modos de atendimento", "get_tickets_mode"),
			s("Atendimento", "atendimento.consultarSlotsAgendamento", "Consultar slots disponiveis para agendamento", "consult_appointment_slots"),
			s("Atendimento", "atendimento.designar", "Designar atendimento para usuario ou grupo", "ticket_assign"),
			s("Atendimento", "atendimento.encerrar", "Encerrar atendimento", "ticket_finish"),
			s("Atendimento", "atendimento.gerarLinkPesquisaSatisfacao", "Gerar link para pesquisa de satisfacao", "generate_questionare_link"),
			s("Atendimento", "atendimento.incluirAgendamentoAvulso", "Incluir agendamento avulso", "appointment_insert"),
			s("Atendimento", "atendimento.incluirAgendamento", "Incluir agendamento no atendimento", "ticket_appointment_insert"),
			s("Atendimento", "atendimento.incluirItem", "Incluir item em atendimento", "ticket_item_insert"),
			s("Atendimento", "atendimento.incluirMensagem", "Incluir mensagens no atendimento", "chat_messages"),
			s("Atendimento", "atendimento.incluirOcorrencia", "Incluir ocorrencia em atendimento", "ticket_occurrence_insert"),

			s("Autenticacao", "autenticacao.alterar", "Alterar autenticacao", "authentication_update"),
			s("Autenticacao", "autenticacao.cadastrar", "Cadastrar autenticacao", "authentication_insert"),
			s("Autenticacao", "autenticacao.excluir", "Excluir autenticacao", "authentication_delete"),

			s("Cliente", "cliente.alterarContato", "Alterar contato", "contact_update"),
			s("Cliente", "cliente.alterarGrupo", "Alterar grupo de clientes", "client_group_update"),
			s("Cliente", "cliente.cadastrarContato", "Cadastrar contato", "contact_create"),
			s("Cliente", "cliente.cadastrarGrupo", "Cadastrar grupo de clientes", "client_group_insert"),
			s("Cliente", "cliente.cadastrarIp", "Cadastrar IP", "ip_insert"),
			s("Cliente", "cliente.consultarAssinanteTipMvno", "Consultar assinante da TIP MVNO", "tipmvno_get_customer"),
			s("Cliente", "cliente.consultarCobradorVirtual", "Consultar clientes enquadrados no Cobrador Virtual", "virtual_collector_costumer_list"),
			s("Cliente", "cliente.consultarOnline", "Consultar clientes on-line", "get_online_customer"),
			s("Cliente", "cliente.consultarDadosAdicionais", "Consultar dados adicionais", "consult_additional_data"),
			s("Cliente", "cliente.consultarEquipamentos", "Consultar equipamentos cadastrados nos clientes", "get_equipment_customer"),
			s("Cliente", "cliente.consultarSaldoTipMvno", "Consultar saldo de dados da TIP MVNO", "tipmvno_get_simcard_balance"),
			s("Cliente", "cliente.desconectarOnline", "Desconectar cliente on-line", "disconnect_online_customer"),
			s("Cliente", "cliente.excluirContato", "Excluir contato", "contact_delete"),
			s("Cliente", "cliente.inserirRecargaTipMvno", "Inserir recarga TIP MVNO", "tipmvno_insert_recharge"),

			s("Contrato", "contrato.alterarDegustacao", "Alterar contrato em degustacao", "temporary_plan_update"),
			s("Contrato", "contrato.alterar", "Alterar contrato", "contract_update"),
			s("Contrato", "contrato.alterarDescontoPromocional", "Alterar desconto promocional do contrato", "promotional_contract_discount_update"),
			s("Contrato", "contrato.assinar", "Assinar contrato", "contract_signature"),
			s("Contrato", "contrato.ativar", "Ativar contrato", "contract_activate"),
			s("Contrato", "contrato.bloquear", "Bloquear contrato", "contract_block"),
			s("Contrato", "contrato.cadastrarDegustacao", "Cadastrar contrato em degustacao", "temporary_plan_insert"),
			s("Contrato", "contrato.cancelar", "Cancelar contrato", "contract_cancel"),
			s("Contrato", "contrato.cancelarSuspensaoTemporaria", "Cancelar suspensao temporaria de contrato", "contract_suspend_temporary_cancel"),
			s("Contrato", "contrato.desativarDegustacao", "Desativar contrato em degustacao", "temporary_plan_disable"),
			s("Contrato", "contrato.desbloquear", "Desbloquear contrato", "contract_unblock"),
			s("Contrato", "contrato.excluirDescontoPromocional", "Excluir desconto promocional do contrato", "promotional_contract_discount_delete"),
			s("Contrato", "contrato.gerarHtml", "Gerar contrato em HTML", "contract_generate_html"),
			s("Contrato", "contrato.gerenciarEnderecos", "Gerenciar enderecos dos contratos", "contract_address"),
			s("Contrato", "contrato.incluir", "Incluir contrato", "contract_insert"),
			s("Contrato", "contrato.listarDegustacao", "Listar contratos em degustacao", "temporary_plan_list"),
			s("Contrato", "contrato.consultarMotivosTransferencia", "Consultar motivos de transferencia", "reasons_for_transfer"),
			s("Contrato", "contrato.suspenderTemporariamente", "Suspender contrato temporariamente", "contract_suspend_temporary"),
			s("Contrato", "contrato.transferir", "Transferir contrato", "contract_transfer"),

			s("Estoque", "estoque.alocarComodato", "Alocar equipamento em comodato", "equipment_lending"),
			s("Estoque", "estoque.cadastrarProduto", "Cadastrar produto", "inventory_insert"),
			s("Estoque", "estoque.cadastrarLocacao", "Cadastrar locacao de estoque", "inventory_location_insert"),
			s("Estoque", "estoque.cadastrarModeloProduto", "Cadastrar modelo de produto", "inventory_product_model_insert"),
			s("Estoque", "estoque.cadastrarTipoProduto", "Cadastrar tipo de produto", "inventory_product_type_insert"),
			s("Estoque", "estoque.desativarComodato", "Desativar equipamento em comodato", "equipment_lending_disable"),
			s("Estoque", "estoque.movimentarAvulso", "Movimentar estoque avulso", "inventory_movement"),

			s("Financeiro", "financeiro.baixarDocumento", "Baixar documento", "document_payment"),
			s("Financeiro", "financeiro.cadastrarCartao", "Cadastrar cartao de credito/debito", "payment_card_insert"),
			s("Financeiro", "financeiro.cadastrarPreFaturamento", "Cadastrar pre-faturamento", "pre_billing_insert"),
			s("Financeiro", "financeiro.consultarDocumentosAbertosCliente", "Consultar documentos em aberto de clientes", "get_unpaid_document"),
			s("Financeiro", "financeiro.consultarLinkNotasFiscais", "Consultar link de notas fiscais emitidas", "invoices_issued_pdf"),
			s("Financeiro", "financeiro.consultarNotasFiscais", "Consultar notas fiscais emitidas", "invoices_issued"),
			s("Financeiro", "financeiro.enviarAvisoPagamento", "Enviar aviso de pagamento", "send_payment_notification"),
			s("Financeiro", "financeiro.enviarBoletoEmail", "Enviar boleto por e-mail", "send_banking_billet"),
			s("Financeiro", "financeiro.estornarDocumentoAberto", "Estornar documento em aberto", "document_delete"),
			s("Financeiro", "financeiro.gerarLinhaDigitavel", "Gerar linha digitavel de boleto", "get_barcode"),
			s("Financeiro", "financeiro.gerarLinkFaturaServicoPdf", "Gerar link da fatura de servicos em PDF", "get_service_invoice"),
			s("Financeiro", "financeiro.gerarLinkBoletoPdf", "Gerar link do boleto em PDF", "get_banking_billet"),
			s("Financeiro", "financeiro.incluirLancamento", "Incluir lancamento financeiro", "document_insert"),
			s("Financeiro", "financeiro.obterPixCopiaCola", "Obter Pix Copia e Cola", "get_pix_copia_cola"),
			s("Financeiro", "financeiro.obterPixQrCode", "Obter QR Code do Pix", "get_pix_qrcode"),
			s("Financeiro", "financeiro.reverterBaixa", "Reverter baixa", "document_payment_reversal"),

			s("Operacao", "campoComplementar.alterar", "Alterar campo complementar", "additional_data_update"),
			s("Operacao", "radius.consultarExtrato", "Consultar extrato de radius", "radius_extract"),
			s("Operacao", "provisionamento.consultar", "Consultar provisionamento", "provisioning_check"),
			s("Operacao", "pedido.encerrar", "Encerrar pedido", "order_finish"),
			s("Operacao", "mensagem.enviarSmsAvulso", "Enviar SMS avulso", "send_sms"),
			s("Operacao", "campoComplementar.excluir", "Excluir campo complementar", "additional_data_delete"),
			s("Operacao", "pedido.gerarContratos", "Gerar contratos de pedido", "order_generate_contracts"),
			s("Operacao", "campoComplementar.incluir", "Incluir campo complementar", "additional_data_insert"),
			s("Operacao", "pacote.listar", "Listar pacotes", "list_packages"),
			s("Operacao", "tip.alterarConta", "Alterar conta TIP", "tip_account_update"),
			s("Operacao", "tip.excluirConta", "Excluir conta TIP", "tip_account_delete"),
			s("Operacao", "tip.incluirConta", "Incluir conta TIP", "tip_account_insert"),
			s("Operacao", "arquivo.upload", "Enviar arquivos", "files_upload", "files_upload",
					"O payload raiz deste servico e uma lista de arquivos."),
			s("Operacao", "centralAssinante.validarAcesso", "Validar acesso a Central do Assinante", "authentication_validation")
	);

	public List<RbxV2Servico> listar() {
		return SERVICOS;
	}

	public Optional<RbxV2Servico> buscarPorServicoProvider(String servicoProvider) {
		return SERVICOS.stream()
				.filter(item -> item.servicoProvider().equals(servicoProvider))
				.findFirst();
	}

	public Optional<RbxV2Servico> buscarPorFuncaoSistema(String funcaoSistema) {
		return SERVICOS.stream()
				.filter(item -> item.funcaoSistema().equals(funcaoSistema))
				.findFirst();
	}

	private static RbxV2Servico s(String modulo, String funcao, String acao, String servicoProvider) {
		return s(modulo, funcao, acao, servicoProvider, servicoProvider, null);
	}

	private static RbxV2Servico s(String modulo, String funcao, String acao, String servicoProvider,
			String payloadRaiz, String observacao) {
		return new RbxV2Servico(modulo, funcao, acao, FONTE, servicoProvider, payloadRaiz, observacao);
	}
}
