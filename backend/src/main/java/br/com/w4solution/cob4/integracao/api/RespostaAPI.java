package br.com.w4solution.cob4.integracao.api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RespostaAPI<T> {

	private int status;
	private String erro_code;
	private String erro_inf;
	private String erro_desc;
	private String erro_detail;
	private List<T> result;
}
