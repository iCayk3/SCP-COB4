package br.com.w4solution.cob4.security;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class AutorizacaoServiceTests {
	private final AutorizacaoService service = new AutorizacaoService();

	@Test void operadorPodeMovimentarMasNaoConfigurar() {
		assertThatCode(() -> service.exigir(PerfilUsuario.OPERADOR, AcaoSistema.MOVIMENTAR_PROTOCOLO))
				.doesNotThrowAnyException();
		assertThatThrownBy(() -> service.exigir(PerfilUsuario.OPERADOR, AcaoSistema.CONFIGURAR_SISTEMA))
				.isInstanceOf(SecurityException.class);
	}
	@Test void supervisorPodeEncerrarEReabrir() {
		assertThatCode(() -> service.exigir(PerfilUsuario.SUPERVISOR, AcaoSistema.ENCERRAR_PROTOCOLO))
				.doesNotThrowAnyException();
		assertThatCode(() -> service.exigir(PerfilUsuario.SUPERVISOR, AcaoSistema.REABRIR_PROTOCOLO))
				.doesNotThrowAnyException();
	}
	@Test void operadorNaoAcessaOutraCarteira() {
		assertThatThrownBy(() -> service.exigirCarteira("operador-a", "operador-b", PerfilUsuario.OPERADOR))
				.isInstanceOf(SecurityException.class);
	}
	@Test void gerentePodeExecutarAcoesDePrivacidade() {
		assertThatCode(() -> service.exigir(PerfilUsuario.GERENTE, AcaoSistema.ANONIMIZAR_DADOS))
				.doesNotThrowAnyException();
	}
}
