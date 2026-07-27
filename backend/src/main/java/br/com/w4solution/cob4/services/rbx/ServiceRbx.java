package br.com.w4solution.cob4.services.rbx;

import br.com.w4solution.cob4.dto.ValorBaixadoDTO;
import br.com.w4solution.cob4.dto.cliente.BoletosBaixadosRbxDTO;
import br.com.w4solution.cob4.dto.cliente.ClienteRbxDTO;
import br.com.w4solution.cob4.dto.rbx.BoletosAbertos;
import br.com.w4solution.cob4.dto.rbx.ClienteFiltradoDTO;
import br.com.w4solution.cob4.dto.rbx.ClientesInadimplentesDTO;
import br.com.w4solution.cob4.dto.rbx.ClientesInadiplentesRbxDTO;
import br.com.w4solution.cob4.dto.rbx.ContratoRbxDTO;
import br.com.w4solution.cob4.dto.rbx.ResponsePieReact;
import br.com.w4solution.cob4.dto.rbx.TotalInadimplenteDTO;
import br.com.w4solution.cob4.integracao.api.RespostaAPI;
import br.com.w4solution.cob4.integracao.rbx.IntegracaoRbx;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ServiceRbx {

	private final IntegracaoRbx integracaoRbx;

	@Value("${api.service.integration.rbx.chave:}")
	private String chaveApi;

	public ServiceRbx(IntegracaoRbx integracaoRbx) {
		this.integracaoRbx = integracaoRbx;
	}

	public List<ResponsePieReact> boletosBaixadosPorCidade(LocalDate data) {
		LocalDate dataFiltro = data != null ? data : LocalDate.now();
		String boletosBaixadosDia = """
				{
				   "ConsultaDocumentosBaixados": {
				      "Autenticacao": {
				         "ChaveIntegracao": "%s"
				      },
				      "Filtro": "Movimento.DataBaixa = '%s'"
				   }
				}
				""".formatted(chaveApi, dataFiltro);

		try {
			List<ClienteRbxDTO> clientes = buscarClientesRbx(null);
			List<BoletosBaixadosRbxDTO> boletos = integracaoRbx.fazerRequest(
					boletosBaixadosDia,
					new TypeReference<RespostaAPI<BoletosBaixadosRbxDTO>>() {
					}
			);
			Map<String, BoletosBaixadosRbxDTO> boletoUnicoPorPessoa = new HashMap<>();

			for (BoletosBaixadosRbxDTO boleto : boletos) {
				boletoUnicoPorPessoa.putIfAbsent(boleto.codigoPessoa(), boleto);
			}

			Map<String, Double> totaisPorGrupo = new HashMap<>();
			for (BoletosBaixadosRbxDTO boleto : boletoUnicoPorPessoa.values()) {
				for (ClienteRbxDTO cliente : clientes) {
					if (Objects.equals(boleto.codigoPessoa(), cliente.codigo())) {
						double valor = parseDouble(boleto.valorBaixado());
						totaisPorGrupo.merge(cliente.grupo(), valor, Double::sum);
						break;
					}
				}
			}

			return gerarListaDeValores(totaisPorGrupo);
		} catch (Exception exception) {
			throw new RuntimeException("Erro ao processar integracao com RBX: " + exception.getMessage(), exception);
		}
	}

	public List<ResponsePieReact> boletosAbertosPorCidade() {
		try {
			List<ClienteRbxDTO> clientes = buscarClientesRbx(null);
			List<BoletosAbertos> boletos = buscarBoletosAbertos();
			Map<String, Double> totaisPorGrupo = new HashMap<>();

			for (BoletosAbertos boleto : boletos) {
				for (ClienteRbxDTO cliente : clientes) {
					if (Objects.equals(boleto.cliente(), cliente.codigo())) {
						totaisPorGrupo.merge(cliente.grupo(), boleto.valor(), Double::sum);
					}
				}
			}

			return gerarListaDeValores(totaisPorGrupo);
		} catch (Exception exception) {
			throw new RuntimeException("Erro ao processar integracao com RBX: " + exception.getMessage(), exception);
		}
	}

	public BoletosAbertos boletosAbertos(String status) {
		try {
			List<BoletosAbertos> boletos = buscarBoletosAbertos();
			double valorTotal;

			if (status != null) {
				List<ClienteRbxDTO> clientes = buscarClientesRbx(status);
				Map<String, BoletosAbertos> boletoUnicoPorCliente = new HashMap<>();

				for (BoletosAbertos boleto : boletos) {
					for (ClienteRbxDTO cliente : clientes) {
						if (Objects.equals(boleto.cliente(), cliente.codigo())) {
							boletoUnicoPorCliente.putIfAbsent(cliente.codigo(), boleto);
							break;
						}
					}
				}

				valorTotal = boletoUnicoPorCliente.values().stream().mapToDouble(BoletosAbertos::valor).sum();
			} else {
				valorTotal = boletos.stream().mapToDouble(BoletosAbertos::valor).sum();
			}

			return new BoletosAbertos(valorTotal, null, null, null, null, null, null, null, null, null, null, null, null);
		} catch (Exception exception) {
			throw new RuntimeException("Erro ao processar integracao com RBX: " + exception.getMessage(), exception);
		}
	}

	public List<ResponsePieReact> totalInadimplentesCidade(String suspenso) {
		String status = suspenso != null ? "S" : "B";

		try {
			List<ClienteRbxDTO> clientes = buscarClientesRbx(status);
			Map<String, Double> totaisPorGrupo = new HashMap<>();

			for (ClienteRbxDTO cliente : clientes) {
				totaisPorGrupo.merge(cliente.grupo(), 1.0, Double::sum);
			}

			return gerarListaDeValores(totaisPorGrupo);
		} catch (Exception exception) {
			throw new RuntimeException("Erro ao processar integracao com RBX: " + exception.getMessage(), exception);
		}
	}

	public List<ClientesInadimplentesDTO> clientesInadimplentes(String suspenso) {
		return suspenso != null ? clientesSuspensos() : clientesBloqueados();
	}

	public TotalInadimplenteDTO totalInadimplentes(String status) {
		try {
			String statusRbx = status != null ? "S" : "B";
			return new TotalInadimplenteDTO(buscarClientesRbx(statusRbx).size());
		} catch (Exception exception) {
			throw new RuntimeException(exception);
		}
	}

	public List<ClienteFiltradoDTO> buscarClienteId(Long id) {
		String corpoMessage = """
				{
				   "ConsultaClientes": {
				      "Autenticacao": {
				         "ChaveIntegracao": "%s"
				      },
				      "Filtro": "Codigo = '%d'"
				   }
				}
				""".formatted(chaveApi, id);
		try {
			return integracaoRbx.fazerRequest(
					corpoMessage,
					new TypeReference<RespostaAPI<ClienteFiltradoDTO>>() {
					}
			);
		} catch (Exception exception) {
			throw new RuntimeException(exception);
		}
	}

	public List<ClienteRbxDTO> buscarClientesSuspensoSemCobranca() {
		try {
			List<BoletosAbertos> boletos = buscarBoletosAbertos();
			List<ClienteRbxDTO> clientes = buscarClientesRbx("S");
			Set<String> clientesComBoleto = boletos.stream()
					.map(BoletosAbertos::cliente)
					.collect(Collectors.toSet());

			return clientes.stream()
					.filter(cliente -> !clientesComBoleto.contains(cliente.codigo()))
					.toList();
		} catch (Exception exception) {
			throw new RuntimeException(exception);
		}
	}

	public Optional<ContratoRbxDTO> buscarContratoMaisRecenteComValor(Integer codigoCliente) {
		String corpoMessage = """
				{
				   "ConsultaContratos": {
				      "Autenticacao": {
				         "ChaveIntegracao": "%s"
				      },
				      "Filtro": "Cliente_Codigo = '%d'"
				   }
				}
				""".formatted(chaveApi, codigoCliente);
		try {
			List<ContratoRbxDTO> contratos = integracaoRbx.fazerRequest(
					corpoMessage,
					new TypeReference<RespostaAPI<ContratoRbxDTO>>() {
					}
			);

			return contratos.stream()
					.filter(contrato -> valorContrato(contrato) > 0)
					.max(Comparator.comparingLong(this::numeroContrato));
		} catch (Exception exception) {
			throw new RuntimeException(exception);
		}
	}

	public double valorContrato(ContratoRbxDTO contrato) {
		String valor = Optional.ofNullable(contrato.valorLiquido())
				.filter(v -> !v.isBlank())
				.orElse(contrato.valorBruto());
		return parseDouble(valor);
	}

	public ValorBaixadoDTO buscarValorTotalBoletosBaixados(String data) {
		try {
			List<BoletosBaixadosRbxDTO> boletos = boletosBaixados(data);
			BigDecimal total = boletos.stream()
					.map(boleto -> new BigDecimal(Optional.ofNullable(boleto.valorBaixado()).orElse("0").replace(",", ".")))
					.reduce(BigDecimal.ZERO, BigDecimal::add);

			return new ValorBaixadoDTO(total);
		} catch (Exception exception) {
			return new ValorBaixadoDTO(BigDecimal.ZERO);
		}
	}

	private List<ClientesInadimplentesDTO> clientesSuspensos() {
		try {
			List<ClienteRbxDTO> clientes = buscarClientesRbx("S");
			List<BoletosAbertos> boletos = buscarBoletosAbertos();
			Map<String, List<BoletosAbertos>> mapaBoletos = boletos.stream()
					.collect(Collectors.groupingBy(BoletosAbertos::cliente));
			List<ClientesInadimplentesDTO> resultado = new ArrayList<>();

			for (ClienteRbxDTO cliente : clientes) {
				List<BoletosAbertos> boletosCliente = mapaBoletos.get(cliente.codigo());
				if (boletosCliente == null || boletosCliente.isEmpty()) {
					continue;
				}

				BoletosAbertos boleto = boletosCliente.get(0);
				ClienteRbxDTO clienteComGrupoNome = clienteComGrupoNome(cliente);
				Long diasAtrasado = calculoDiferencaDias(boleto.vencimento(), LocalDate.now().toString());
				resultado.add(new ClientesInadimplentesDTO(clienteComGrupoNome, boleto.valor(), boleto.vencimento(), diasAtrasado));
			}

			return resultado;
		} catch (Exception exception) {
			throw new RuntimeException("Erro ao processar integracao com RBX: " + exception.getMessage(), exception);
		}
	}

	private List<ClientesInadimplentesDTO> clientesBloqueados() {
		try {
			List<ClienteRbxDTO> clientes = buscarClientesRbx("B");
			List<BoletosAbertos> boletos = buscarBoletosAbertos();
			List<ClientesInadiplentesRbxDTO> clientesInadiplentesRbx = buscarClientesInadiplentes();
			Map<String, ClientesInadiplentesRbxDTO> mapaInadiplentesRbx = clientesInadiplentesRbx.stream()
					.collect(Collectors.toMap(ClientesInadiplentesRbxDTO::codigo, Function.identity(), (atual, duplicado) -> atual));
			Map<String, List<BoletosAbertos>> mapaBoletos = boletos.stream()
					.collect(Collectors.groupingBy(BoletosAbertos::cliente));
			List<ClientesInadimplentesDTO> resultado = new ArrayList<>();

			for (ClienteRbxDTO cliente : clientes) {
				List<BoletosAbertos> boletosCliente = mapaBoletos.get(cliente.codigo());
				if (boletosCliente == null || boletosCliente.isEmpty()) {
					continue;
				}

				BoletosAbertos boleto = boletosCliente.get(0);
				ClientesInadiplentesRbxDTO clienteRbx = mapaInadiplentesRbx.get(cliente.codigo());
				ClienteRbxDTO clienteComGrupoNome = clienteComGrupoNome(cliente);
				Long diasAtrasado = calculoDiferencaDias(boleto.vencimento(), LocalDate.now().toString());

				resultado.add(new ClientesInadimplentesDTO(clienteComGrupoNome, boleto.valor(), clienteRbx, boleto.vencimento(), diasAtrasado));
			}

			return resultado;
		} catch (Exception exception) {
			throw new RuntimeException("Erro ao processar integracao com RBX: " + exception.getMessage(), exception);
		}
	}

	private long numeroContrato(ContratoRbxDTO contrato) {
		try {
			return Long.parseLong(Optional.ofNullable(contrato.numero()).orElse("0").replaceAll("\\D", ""));
		} catch (Exception exception) {
			return 0L;
		}
	}

	private List<ClienteRbxDTO> buscarClientesRbx(String status) {
		String bodyClientes = status != null ? """
				{
				   "ConsultaClientes": {
				      "Autenticacao": {
				         "ChaveIntegracao": "%s"
				      },
				      "Filtro": "Situacao = '%s'"
				   }
				}
				""".formatted(chaveApi, status) : """
				{
				   "ConsultaClientes": {
				      "Autenticacao": {
				         "ChaveIntegracao": "%s"
				      },
				      "Filtro": ""
				   }
				}
				""".formatted(chaveApi);

		return integracaoRbx.fazerRequest(
				bodyClientes,
				new TypeReference<RespostaAPI<ClienteRbxDTO>>() {
				}
		);
	}

	public List<ClienteRbxDTO> buscarTodosClientes() {
		return buscarClientesRbx(null);
	}

	private List<BoletosAbertos> buscarBoletosAbertos() {
		String corpoBoletoAberto = """
				{
				   "ConsultaDocumentosAbertos": {
				      "Autenticacao": {
				         "ChaveIntegracao": "%s"
				      },
				      "Filtro": "Historico = 'Documento a Receber'"
				   }
				}
				""".formatted(chaveApi);

		return integracaoRbx.fazerRequest(
				corpoBoletoAberto,
				new TypeReference<RespostaAPI<BoletosAbertos>>() {
				}
		);
	}

	public List<BoletosAbertos> buscarTodosBoletosAbertos() {
		return buscarBoletosAbertos();
	}

	private List<ClientesInadiplentesRbxDTO> buscarClientesInadiplentes() {
		String corpoMessage = """
				{
				   "ConsultaClientesBloqueados": {
				      "Autenticacao": {
				         "ChaveIntegracao": "%s"
				      },
				      "Filtro": ""
				   }
				}
				""".formatted(chaveApi);

		return integracaoRbx.fazerRequest(
				corpoMessage,
				new TypeReference<RespostaAPI<ClientesInadiplentesRbxDTO>>() {
				}
		);
	}

	private List<BoletosBaixadosRbxDTO> boletosBaixados(String data) {
		String corpoMessage = """
				{
				    "ConsultaDocumentosBaixados": {
				       "Autenticacao": {
				          "ChaveIntegracao": "%s"
				       },
				       "Filtro": "Movimento.DataBaixa = '%s'"
				    }
				 }
				""".formatted(chaveApi, data);

		return integracaoRbx.fazerRequest(
				corpoMessage,
				new TypeReference<RespostaAPI<BoletosBaixadosRbxDTO>>() {
				}
		);
	}

	private List<ResponsePieReact> gerarListaDeValores(Map<String, Double> totais) {
		List<ResponsePieReact> lista = new ArrayList<>();

		lista.add(new ResponsePieReact("Pirabas", totais.getOrDefault("10", 0.0) + totais.getOrDefault("36", 0.0)));
		lista.add(new ResponsePieReact("Primavera", totais.getOrDefault("11", 0.0)));
		lista.add(new ResponsePieReact("Santarem novo", totais.getOrDefault("13", 0.0)));
		lista.add(new ResponsePieReact("Quatipuru", totais.getOrDefault("15", 0.0)));
		lista.add(new ResponsePieReact("Boa vista", totais.getOrDefault("16", 0.0)));
		lista.add(new ResponsePieReact("Magalhaes Barata", totais.getOrDefault("26", 0.0)));
		lista.add(new ResponsePieReact("Maracana", totais.getOrDefault("32", 0.0)));
		lista.add(new ResponsePieReact("Marapanim", totais.getOrDefault("33", 0.0)));
		lista.add(new ResponsePieReact("Salinopolis", totais.getOrDefault("34", 0.0)));

		return lista;
	}

	private static String converterIdEmNome(String id) {
		return switch (id) {
			case "10", "36" -> "Pirabas";
			case "11" -> "Primavera";
			case "13" -> "Santarem Novo";
			case "15" -> "Quatipuru";
			case "16" -> "Boa Vista";
			case "26" -> "Magalhaes Barata";
			case "32" -> "Maracana";
			case "33" -> "Marapanim";
			case "34" -> "Salinopolis";
			default -> id;
		};
	}

	private ClienteRbxDTO clienteComGrupoNome(ClienteRbxDTO cliente) {
		return new ClienteRbxDTO(
				cliente.codigo(),
				cliente.nome(),
				cliente.telComercial(),
				cliente.telResidencial(),
				cliente.telCelular(),
				cliente.endereco(),
				cliente.numero(),
				cliente.complemento(),
				cliente.bairro(),
				cliente.cidade(),
				cliente.uf(),
				cliente.cep(),
				converterIdEmNome(cliente.grupo()),
				cliente.situacao(),
				cliente.cpfCnpj(),
				cliente.email()
		);
	}

	private Long calculoDiferencaDias(String dataInicio, String dataFim) {
		LocalDate inicio = LocalDate.parse(dataInicio);
		LocalDate fim = LocalDate.parse(dataFim);
		return ChronoUnit.DAYS.between(inicio, fim);
	}

	private double parseDouble(String valor) {
		try {
			return Double.parseDouble(Optional.ofNullable(valor).orElse("0").replace(",", "."));
		} catch (Exception exception) {
			return 0.0;
		}
	}
}
