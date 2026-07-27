package br.com.w4solution.cob4.integracao.rbx;

import br.com.w4solution.cob4.integracao.IntegracaoException;
import br.com.w4solution.cob4.integracao.api.RespostaAPI;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
public class IntegracaoRbx {

	private final RestTemplate restTemplate;
	private final ObjectMapper objectMapper;

	@Value("${api.service.integration.rbx:}")
	private String url;

	@Value("${api.service.integration.rbx.v2:}")
	private String urlV2;

	public IntegracaoRbx(RestTemplate restTemplate, ObjectMapper objectMapper) {
		this.restTemplate = restTemplate;
		this.objectMapper = objectMapper;
	}

	public <T> List<T> fazerRequest(String body, TypeReference<RespostaAPI<T>> typeReference) {
		String responseBody = enviarRequest(body);

		try {
			RespostaAPI<T> resposta = objectMapper.readValue(responseBody, typeReference);
			return resposta.getResult();
		} catch (JsonProcessingException exception) {
			throw new IntegracaoException("Falha ao interpretar resposta da integracao RBX", exception);
		}
	}

	public JsonNode fazerRequestRaw(JsonNode body) {
		try {
			return fazerRequestRaw(objectMapper.writeValueAsString(body));
		} catch (JsonProcessingException exception) {
			throw new IntegracaoException("Falha ao montar requisicao da integracao RBX", exception);
		}
	}

	public JsonNode fazerRequestRaw(String body) {
		String responseBody = enviarRequest(body);

		try {
			return objectMapper.readTree(responseBody);
		} catch (JsonProcessingException exception) {
			throw new IntegracaoException("Falha ao interpretar resposta da integracao RBX", exception);
		}
	}

	public JsonNode fazerRequestV2Raw(JsonNode body, String chaveIntegracao) {
		try {
			return fazerRequestV2Raw(objectMapper.writeValueAsString(body), chaveIntegracao);
		} catch (JsonProcessingException exception) {
			throw new IntegracaoException("Falha ao montar requisicao da integracao RBX v2", exception);
		}
	}

	public JsonNode fazerRequestV2Raw(String body, String chaveIntegracao) {
		String urlDestino = urlV2();
		HttpHeaders headers = headersJson();
		headers.set("authentication_key", chaveIntegracao);
		String responseBody = enviarRequest(body, urlDestino, headers, "RBX v2");

		try {
			return objectMapper.readTree(responseBody);
		} catch (JsonProcessingException exception) {
			throw new IntegracaoException("Falha ao interpretar resposta da integracao RBX v2", exception);
		}
	}

	private String enviarRequest(String body) {
		if (!StringUtils.hasText(url)) {
			throw new IntegracaoException("URL da integracao RBX nao configurada em api.service.integration.rbx");
		}

		return enviarRequest(body, url, headersJson(), "RBX");
	}

	private String enviarRequest(String body, String urlDestino, HttpHeaders headers, String nomeIntegracao) {
		HttpEntity<String> request = new HttpEntity<>(body, headers);

		try {
			ResponseEntity<String> response = restTemplate.postForEntity(urlDestino, request, String.class);

			if (!response.getStatusCode().is2xxSuccessful()) {
				throw new IntegracaoException("Falha na requisicao " + nomeIntegracao + ": " + response.getStatusCode());
			}

			String responseBody = response.getBody();
			if (responseBody == null) {
				throw new IntegracaoException("Resposta vazia da integracao " + nomeIntegracao);
			}

			return responseBody;
		} catch (RestClientException exception) {
			throw new IntegracaoException("Falha de comunicacao com a integracao " + nomeIntegracao, exception);
		}
	}

	private HttpHeaders headersJson() {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		return headers;
	}

	private String urlV2() {
		if (StringUtils.hasText(urlV2)) {
			return urlV2;
		}

		if (StringUtils.hasText(url)) {
			return url.replace("/routerbox/ws/rbx_server_json.php", "/routerbox/ws_json/ws_json.php");
		}

		throw new IntegracaoException("URL da integracao RBX v2 nao configurada em api.service.integration.rbx.v2");
	}
}
