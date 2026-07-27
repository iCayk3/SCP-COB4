package br.com.w4solution.cob4.dto.rbx;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.LinkedHashMap;
import java.util.Map;

public class RbxV1Request {

	private String filtro;
	private Map<String, Object> dados = new LinkedHashMap<>();
	private final Map<String, Object> campos = new LinkedHashMap<>();

	public String getFiltro() {
		return filtro;
	}

	@JsonAlias("Filtro")
	public void setFiltro(String filtro) {
		this.filtro = filtro;
	}

	public Map<String, Object> getDados() {
		return dados;
	}

	@JsonAlias("Dados")
	public void setDados(Map<String, Object> dados) {
		this.dados = dados != null ? new LinkedHashMap<>(dados) : new LinkedHashMap<>();
	}

	@JsonAnySetter
	public void setCampo(String nome, Object valor) {
		if ("Autenticacao".equalsIgnoreCase(nome) || "ChaveIntegracao".equalsIgnoreCase(nome)) {
			return;
		}

		campos.put(nome, valor);
	}

	@JsonIgnore
	public Map<String, Object> camposServico() {
		Map<String, Object> resultado = new LinkedHashMap<>(dados);
		resultado.putAll(campos);
		return resultado;
	}
}
