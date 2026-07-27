package br.com.w4solution.cob4.services.rbx;

import br.com.w4solution.cob4.dto.rbx.RbxV1Request;
import br.com.w4solution.cob4.integracao.IntegracaoException;
import br.com.w4solution.cob4.integracao.rbx.IntegracaoRbx;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Map;
import java.util.regex.Pattern;

@Service
public class RbxV1GenericService {

	private static final Pattern SERVICO_VALIDO = Pattern.compile("[A-Za-z][A-Za-z0-9_]*");

	private final IntegracaoRbx integracaoRbx;
	private final ObjectMapper objectMapper;

	@Value("${api.service.integration.rbx.chave:}")
	private String chaveApi;

	public RbxV1GenericService(IntegracaoRbx integracaoRbx, ObjectMapper objectMapper) {
		this.integracaoRbx = integracaoRbx;
		this.objectMapper = objectMapper;
	}

	public JsonNode executar(String servico, RbxV1Request request) {
		validarServico(servico);

		if (!StringUtils.hasText(chaveApi)) {
			throw new IntegracaoException("Chave da integracao RBX nao configurada em api.service.integration.rbx.chave");
		}

		RbxV1Request requestSeguro = request != null ? request : new RbxV1Request();
		ObjectNode root = objectMapper.createObjectNode();
		ObjectNode payloadServico = root.putObject(servico);
		ObjectNode autenticacao = payloadServico.putObject("Autenticacao");
		autenticacao.put("ChaveIntegracao", chaveApi);

		if (requestSeguro.getFiltro() != null) {
			payloadServico.put("Filtro", requestSeguro.getFiltro());
		}

		for (Map.Entry<String, Object> campo : requestSeguro.camposServico().entrySet()) {
			if (campo.getValue() != null) {
				payloadServico.set(campo.getKey(), objectMapper.valueToTree(campo.getValue()));
			}
		}

		return integracaoRbx.fazerRequestRaw(root);
	}

	public JsonNode executar(JsonNode request) {
		if (request == null || !request.isObject() || request.size() != 1) {
			throw new IntegracaoException("Requisicao RBX v1 deve conter exatamente um servico na raiz");
		}

		Map.Entry<String, JsonNode> servico = request.properties().iterator().next();
		validarServico(servico.getKey());

		if (!servico.getValue().isObject()) {
			throw new IntegracaoException("Payload do servico RBX v1 deve ser um objeto");
		}

		if (!StringUtils.hasText(chaveApi)) {
			throw new IntegracaoException("Chave da integracao RBX nao configurada em api.service.integration.rbx.chave");
		}

		ObjectNode root = objectMapper.createObjectNode();
		ObjectNode payloadServico = root.putObject(servico.getKey());
		servico.getValue().properties().forEach(campo -> {
			if (!"Autenticacao".equalsIgnoreCase(campo.getKey()) && !"ChaveIntegracao".equalsIgnoreCase(campo.getKey())) {
				payloadServico.set(campo.getKey(), campo.getValue());
			}
		});

		ObjectNode autenticacao = payloadServico.putObject("Autenticacao");
		autenticacao.put("ChaveIntegracao", chaveApi);

		return integracaoRbx.fazerRequestRaw(root);
	}

	private void validarServico(String servico) {
		if (!StringUtils.hasText(servico) || !SERVICO_VALIDO.matcher(servico).matches()) {
			throw new IntegracaoException("Nome de servico RBX invalido");
		}
	}
}
