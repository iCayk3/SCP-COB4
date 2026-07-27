package br.com.w4solution.cob4.services.rbx;

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
public class RbxV2GenericService {

	private static final Pattern SERVICO_VALIDO = Pattern.compile("[A-Za-z][A-Za-z0-9_]*");

	private final IntegracaoRbx integracaoRbx;
	private final ObjectMapper objectMapper;

	@Value("${api.service.integration.rbx.chave:}")
	private String chaveApi;

	public RbxV2GenericService(IntegracaoRbx integracaoRbx, ObjectMapper objectMapper) {
		this.integracaoRbx = integracaoRbx;
		this.objectMapper = objectMapper;
	}

	public JsonNode executar(String servico, JsonNode payload) {
		validarServico(servico);
		validarChave();

		ObjectNode root = objectMapper.createObjectNode();
		root.set(servico, payload != null && !payload.isNull() ? payload : objectMapper.createObjectNode());
		return integracaoRbx.fazerRequestV2Raw(root, chaveApi);
	}

	public JsonNode executar(JsonNode request) {
		if (request == null || !request.isObject() || request.size() != 1) {
			throw new IntegracaoException("Requisicao RBX v2 deve conter exatamente um servico na raiz");
		}

		Map.Entry<String, JsonNode> servico = request.properties().iterator().next();
		validarServico(servico.getKey());
		validarChave();

		return integracaoRbx.fazerRequestV2Raw(request, chaveApi);
	}

	private void validarServico(String servico) {
		if (!StringUtils.hasText(servico) || !SERVICO_VALIDO.matcher(servico).matches()) {
			throw new IntegracaoException("Nome de servico RBX v2 invalido");
		}
	}

	private void validarChave() {
		if (!StringUtils.hasText(chaveApi)) {
			throw new IntegracaoException("Chave da integracao RBX nao configurada em api.service.integration.rbx.chave");
		}
	}
}
