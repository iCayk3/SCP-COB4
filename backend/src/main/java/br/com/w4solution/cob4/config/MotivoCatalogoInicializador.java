package br.com.w4solution.cob4.config;

import br.com.w4solution.cob4.domain.MotivoCatalogo;
import br.com.w4solution.cob4.repositories.MotivoCatalogoRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MotivoCatalogoInicializador implements ApplicationRunner {
	private final MotivoCatalogoRepository repository;

	public MotivoCatalogoInicializador(MotivoCatalogoRepository repository) {
		this.repository = repository;
	}

	@Override
	public void run(ApplicationArguments args) {
		if (repository.count() > 0) return;
		repository.saveAll(List.of(
				m(MotivoCatalogo.Tipo.MOVIMENTACAO, "CONTATO_REALIZADO", "Contato realizado", 10, false),
				m(MotivoCatalogo.Tipo.MOVIMENTACAO, "ACORDO_EM_NEGOCIACAO", "Acordo em negociação", 20, false),
				m(MotivoCatalogo.Tipo.MOVIMENTACAO, "SEM_RETORNO_DO_CLIENTE", "Sem retorno do cliente", 30, true),
				m(MotivoCatalogo.Tipo.ENCERRAMENTO, "PAGAMENTO_CONFIRMADO", "Pagamento confirmado", 10, false),
				m(MotivoCatalogo.Tipo.ENCERRAMENTO, "CANCELAMENTO_CONTRATUAL", "Cancelamento contratual", 20, true),
				m(MotivoCatalogo.Tipo.ENCERRAMENTO, "INSOLVENCIA_COMPROVADA", "Insolvência comprovada", 30, true),
				m(MotivoCatalogo.Tipo.REABERTURA, "BAIXA_ESTORNADA", "Baixa estornada", 10, true),
				m(MotivoCatalogo.Tipo.REABERTURA, "PAGAMENTO_NAO_CONFIRMADO", "Pagamento não confirmado", 20, true),
				m(MotivoCatalogo.Tipo.VISITA, "SEM_CONTATO_REMOTO", "Sem contato pelos canais remotos", 10, false),
				m(MotivoCatalogo.Tipo.VISITA, "VALIDACAO_NO_LOCAL", "Validação necessária no local", 20, true),
				m(MotivoCatalogo.Tipo.RETIRADA, "ACORDO_DESCUMPRIDO", "Acordo descumprido", 10, true),
				m(MotivoCatalogo.Tipo.RETIRADA, "RISCO_DE_PERDA_DO_BEM", "Risco de perda do bem", 20, true),
				m(MotivoCatalogo.Tipo.JURIDICO, "INADIMPLENCIA_SUPERIOR_90_DIAS", "Inadimplência superior a 90 dias", 10, false),
				m(MotivoCatalogo.Tipo.JURIDICO, "RECUSA_FORMAL_DE_PAGAMENTO", "Recusa formal de pagamento", 20, true),
				m(MotivoCatalogo.Tipo.CANCELAMENTO_FECHAMENTO, "ERRO_DE_APURACAO", "Erro de apuração", 10, true),
				m(MotivoCatalogo.Tipo.CANCELAMENTO_FECHAMENTO, "DADOS_RBX_ATUALIZADOS", "Dados do RBX atualizados", 20, true)
		));
	}

	private MotivoCatalogo m(MotivoCatalogo.Tipo tipo, String codigo, String nome, int ordem, boolean exigeObservacao) {
		var motivo = new MotivoCatalogo();
		motivo.setTipo(tipo); motivo.setCodigo(codigo); motivo.setNome(nome);
		motivo.setOrdem(ordem); motivo.setAtivo(true); motivo.setExigeObservacao(exigeObservacao);
		return motivo;
	}
}
