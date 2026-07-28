package br.com.w4solution.cob4.config;

import br.com.w4solution.cob4.dto.fluxo.FluxoDTO;
import br.com.w4solution.cob4.repositories.FluxoCobrancaRepository;
import br.com.w4solution.cob4.services.fluxo.FluxoService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FluxoInicializador implements ApplicationRunner {
	private final FluxoCobrancaRepository repository;
	private final FluxoService service;

	public FluxoInicializador(FluxoCobrancaRepository repository, FluxoService service) {
		this.repository = repository; this.service = service;
	}

	@Override
	public void run(ApplicationArguments args) {
		if (repository.findByCodigo("COBRANCA_PADRAO").isPresent()) return;
		List<FluxoDTO.EstadoDTO> estados = List.of(
				e("NOVO", "Novo", 1, true, false),
				e("EM_ATENDIMENTO", "Em Atendimento", 2, false, false),
				e("NEGOCIACAO", "Negociação", 3, false, false),
				e("PROMESSA", "Promessa", 4, false, false),
				e("AGUARDANDO", "Aguardando", 5, false, false),
				e("PAGO", "Pago", 6, false, false),
				e("SEM_CONTATO", "Sem contato", 7, false, false),
				e("VISITA", "Visita", 8, false, false),
				e("RETIRADA", "Retirada", 9, false, false),
				e("JURIDICO", "Jurídico", 10, false, false),
				e("ENCERRADO", "Encerrado", 11, false, true));
		List<FluxoDTO.TransicaoDTO> transicoes = List.of(
				t("NOVO", "EM_ATENDIMENTO", "Cliente respondeu", false, null),
				t("NOVO", "SEM_CONTATO", "Ligação sem contato após cadência", false, null),
				t("EM_ATENDIMENTO", "NEGOCIACAO", "Iniciar negociação", false, null),
				t("NEGOCIACAO", "PROMESSA", "Registrar promessa", false, null),
				t("PROMESSA", "AGUARDANDO", "Aguardar pagamento", false, null),
				t("AGUARDANDO", "PAGO", "Confirmar pagamento", false, null),
				t("PAGO", "ENCERRADO", "Encerrar processo pago", false, null),
				t("SEM_CONTATO", "VISITA", "Encaminhar para visita", false, null),
				t("VISITA", "RETIRADA", "Encaminhar para retirada", false, null),
				t("RETIRADA", "JURIDICO", "Encaminhar ao jurídico", false, null),
				t("JURIDICO", "ENCERRADO", "Encerrar processo jurídico", false, null));
		service.salvar(null, new FluxoDTO(null, "COBRANCA_PADRAO", "Cobrança padrão", true, true, estados, transicoes));
	}

	private FluxoDTO.EstadoDTO e(String codigo, String nome, int ordem, boolean inicial, boolean terminal) {
		return new FluxoDTO.EstadoDTO(codigo, nome, ordem, inicial, terminal);
	}
	private FluxoDTO.TransicaoDTO t(String origem, String destino, String nome, boolean automatica, Integer horas) {
		return new FluxoDTO.TransicaoDTO(origem, destino, nome, automatica, horas);
	}
}
