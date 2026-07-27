package br.com.w4solution.cob4.services.rbx;

import br.com.w4solution.cob4.dto.rbx.RbxV1Servico;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RbxV1CatalogoService {

	private static final List<RbxV1Servico> SERVICOS = List.of(
			servico("Atendimentos", "AtendimentoCadastro", "Cadastro de atendimentos", false, "DadosAtendimento"),
			servico("Atendimentos", "ConsultaAtendimentos", "Consulta atendimentos", true),
			servico("Atendimentos", "ConsultaCausas", "Consulta causas de atendimentos", true),
			servico("Atendimentos", "ConsultaChecklistAtendimentos", "Consulta checklist de atendimentos", true),
			servico("Atendimentos", "ConsultaFluxos", "Consulta fluxos de atendimentos", true),
			servico("Atendimentos", "ConsultaGruposSLA", "Consulta grupos de SLA", false),
			servico("Atendimentos", "ConsultaOcorrenciasAtendimentos", "Consulta ocorrencias de atendimentos", true),
			servico("Atendimentos", "ConsultaTopicos", "Consulta topicos de atendimentos", true),

			servico("Autenticacoes", "ConsultaAutenticacao", "Consulta autenticacoes de clientes", true),
			servico("Autenticacoes", "ConsultaAutenticacaoSenha", "Consulta autenticacoes de clientes com senha", true, null,
					"Retorna senha de autenticacao; usar apenas em rotas protegidas."),

			servico("Clientes", "ClienteAlteracao", "Alteracao de clientes", false, "DadosCliente"),
			servico("Clientes", "MercadoAlteracao", "Alteracao de mercados", false, "DadosMercado"),
			servico("Clientes", "ClienteCadastro", "Cadastro de clientes", false, "DadosCliente"),
			servico("Clientes", "MercadoCadastro", "Cadastro de mercados", false, "DadosMercado"),
			servico("Clientes", "ConsultaClientes", "Consulta clientes", true),
			servico("Clientes", "ConsultaClientesBloqueados", "Consulta clientes bloqueados", true),
			servico("Clientes", "ConsultaClientesReducao", "Consulta clientes com reducao de banda", true),
			servico("Clientes", "ConsultaClienteOnline", "Consulta clientes on-line", true),
			servico("Clientes", "ConsultaComplementoContatos", "Consulta complementos de contatos", false),
			servico("Clientes", "ConsultaContatos", "Consulta contatos", true),
			servico("Clientes", "ConsultarDadosAdicionais", "Consulta dados adicionais de clientes, contratos e atendimentos", true),
			servico("Clientes", "ConsultaClientesCobranca", "Consulta dados de cobranca de clientes", true),
			servico("Clientes", "ConsultaEquipamentosOnline", "Consulta equipamentos on-line", true),
			servico("Clientes", "ConsultaGruposCliente", "Consulta grupos de clientes", false),
			servico("Clientes", "ConsultaMercados", "Consulta mercados", true),

			servico("Contratos", "ConsultaConcorrencia", "Consulta concorrencia", false),
			servico("Contratos", "ConsultaContratos", "Consulta contratos", true),
			servico("Contratos", "ConsultaContratosBloqueados", "Consulta contratos bloqueados", true),
			servico("Contratos", "ConsultaMotivosCancelamento", "Consulta motivos de cancelamento", false),

			servico("Estoque", "ConsultaModelosProduto", "Consulta modelos de produtos", true),
			servico("Estoque", "ConsultaTiposProduto", "Consulta tipos de produtos", true),
			servico("Estoque", "ConsultaUnidadesProduto", "Consulta unidades de produtos", true),

			servico("Financeiro", "NotasFiscaisCadastro", "Cadastro de notas fiscais", false, "DadosNota"),
			servico("Financeiro", "ConsultaCartoesCadastrados", "Consulta cartoes cadastrados", true),
			servico("Financeiro", "ConsultaCiclosFaturamento", "Consulta ciclos de faturamento", false),
			servico("Financeiro", "ConsultaDocumentosBaixados", "Consulta documentos baixados", true),
			servico("Financeiro", "ConsultaDocumentosAbertos", "Consulta documentos em aberto", true),
			servico("Financeiro", "ConsultaGruposCobranca", "Consulta grupos de cobranca", false),
			servico("Financeiro", "ConsultaLinhaDigitavelBoleto", "Consulta linha digitavel do boleto", false,
					"DadosLinhaDigitavelEntrada"),

			servico("Variados", "PedidoCadastro", "Cadastro de pedidos", false, "DadosPedido"),
			servico("Variados", "ConsultaDadosAdicionais", "Consulta dados adicionais", false),
			servico("Variados", "FailOverEvents", "Consulta eventos do FailOver", true),
			servico("Variados", "ConsutaFornecedores", "Consulta fornecedores", true, null,
					"Nome do servico esta com a grafia da documentacao RBX: ConsutaFornecedores."),
			servico("Variados", "ConsultaPlanos", "Consulta planos", false),
			servico("Variados", "ConsultaQoS", "Consulta QoS", false),
			servico("Variados", "ConsultaStatusNAS", "Consulta status do NAS", true),
			servico("Variados", "ConsultaUsuarios", "Consulta usuarios do sistema", false)
	);

	public List<RbxV1Servico> listar() {
		return SERVICOS;
	}

	public Optional<RbxV1Servico> buscar(String servico) {
		return SERVICOS.stream()
				.filter(item -> item.servico().equals(servico))
				.findFirst();
	}

	private static RbxV1Servico servico(String grupo, String servico, String nome, boolean aceitaFiltro) {
		return servico(grupo, servico, nome, aceitaFiltro, null);
	}

	private static RbxV1Servico servico(String grupo, String servico, String nome, boolean aceitaFiltro,
			String payloadPrincipal) {
		return servico(grupo, servico, nome, aceitaFiltro, payloadPrincipal, null);
	}

	private static RbxV1Servico servico(String grupo, String servico, String nome, boolean aceitaFiltro,
			String payloadPrincipal, String observacao) {
		return new RbxV1Servico(grupo, servico, nome, aceitaFiltro, payloadPrincipal, observacao);
	}
}
