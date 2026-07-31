package br.com.w4solution.cob4.integracao.rbx;

import br.com.w4solution.cob4.integracao.IntegracaoException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.net.SocketTimeoutException;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class IntegracaoRbxTests {
	@Test
	void timeoutHttpViraFalhaDeIntegracaoElegivelParaRetry() {
		RestTemplate http = mock(RestTemplate.class);
		when(http.postForEntity(anyString(), any(), eq(String.class))).thenThrow(
				new ResourceAccessException("Read timed out", new SocketTimeoutException("Read timed out")));
		var integracao = new IntegracaoRbx(http, new ObjectMapper());
		ReflectionTestUtils.setField(integracao, "url", "https://rbx.invalid/api");

		assertThatThrownBy(() -> integracao.fazerRequestRaw("{}"))
				.isInstanceOf(IntegracaoException.class)
				.hasMessageContaining("Falha de comunicacao");
	}
}
