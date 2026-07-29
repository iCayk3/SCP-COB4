package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.Cobranca;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class NotificacaoSlaService {
	private static final Logger log = LoggerFactory.getLogger(NotificacaoSlaService.class);
	private final JavaMailSender mailSender;
	private final String remetente;
	private final String[] destinatarios;

	public NotificacaoSlaService(JavaMailSender mailSender,
			@Value("${sgc.cobranca.sla.notificacao.remetente:noreply@localhost}") String remetente,
			@Value("${sgc.cobranca.sla.notificacao.destinatarios:}") String destinatarios) {
		this.mailSender = mailSender;
		this.remetente = remetente;
		this.destinatarios = Arrays.stream(destinatarios.split(","))
				.map(String::trim).filter(s -> !s.isEmpty()).toArray(String[]::new);
	}

	public boolean notificar(Cobranca processo, int nivel) {
		if (destinatarios.length == 0) {
			log.info("Notificação SLA não enviada: nenhum destinatário configurado para o processo {}", processo.getReferencia());
			return false;
		}
		SimpleMailMessage mensagem = new SimpleMailMessage();
		mensagem.setFrom(remetente);
		mensagem.setTo(destinatarios);
		mensagem.setSubject("[SLA nível " + nivel + "] Processo " + processo.getReferencia());
		mensagem.setText("O processo " + processo.getReferencia() + " atingiu o nível " + nivel
				+ " de escalonamento do SLA.\nResponsável: " + processo.getResponsavelNome()
				+ " (" + processo.getResponsavelIdentificador() + ").");
		mailSender.send(mensagem);
		return true;
	}
}
