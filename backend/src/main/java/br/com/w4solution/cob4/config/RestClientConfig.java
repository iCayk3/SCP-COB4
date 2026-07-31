package br.com.w4solution.cob4.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class RestClientConfig {

	@Bean
	public RestTemplate restTemplate(@Value("${sgc.rbx.http.connect-timeout-ms:5000}") long connectTimeoutMs,
			@Value("${sgc.rbx.http.read-timeout-ms:30000}") long readTimeoutMs) {
		var factory = new SimpleClientHttpRequestFactory();
		factory.setConnectTimeout(Duration.ofMillis(connectTimeoutMs));
		factory.setReadTimeout(Duration.ofMillis(readTimeoutMs));
		return new RestTemplate(factory);
	}
}
