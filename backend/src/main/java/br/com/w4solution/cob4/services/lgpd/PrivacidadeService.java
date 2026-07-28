package br.com.w4solution.cob4.services.lgpd;

import br.com.w4solution.cob4.domain.LogAuditoria;
import br.com.w4solution.cob4.domain.PoliticaLgpd;
import br.com.w4solution.cob4.dto.lgpd.ExportacaoTitularDTO;
import br.com.w4solution.cob4.dto.lgpd.SolicitacaoPrivacidadeDTO;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.security.AcaoSistema;
import br.com.w4solution.cob4.security.AutorizacaoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.OffsetDateTime;

@Service
public class PrivacidadeService {
	private final ClienteRepository clienteRepository;
	private final CobrancaRepository cobrancaRepository;
	private final HistoricoAtrasoRepository historicoRepository;
	private final PoliticaLgpdRepository politicaRepository;
	private final LogAuditoriaRepository logRepository;
	private final AutorizacaoService autorizacaoService;

	public PrivacidadeService(ClienteRepository clienteRepository, CobrancaRepository cobrancaRepository,
			HistoricoAtrasoRepository historicoRepository, PoliticaLgpdRepository politicaRepository,
			LogAuditoriaRepository logRepository, AutorizacaoService autorizacaoService) {
		this.clienteRepository = clienteRepository; this.cobrancaRepository = cobrancaRepository;
		this.historicoRepository = historicoRepository; this.politicaRepository = politicaRepository;
		this.logRepository = logRepository; this.autorizacaoService = autorizacaoService;
	}

	@Transactional
	public ExportacaoTitularDTO exportar(SolicitacaoPrivacidadeDTO dados) {
		autorizacaoService.exigir(dados.perfil(), AcaoSistema.EXPORTAR_DADOS);
		var cliente = clienteRepository.findByCpf(dados.cpf())
				.orElseThrow(() -> new IllegalArgumentException("Titular não encontrado"));
		var protocolos = cobrancaRepository.findByCpfAgregadorInAndStatusIn(
				java.util.List.of(dados.cpf()), java.util.List.of(br.com.w4solution.cob4.domain.Cobranca.Status.values()))
				.stream().map(c -> new ExportacaoTitularDTO.ProtocoloDTO(c.getReferencia(), c.getContratoReferencia(),
						c.getStatus().name(), c.getEstadoFluxo(), c.getValorTotal().toPlainString())).toList();
		var log = new LogAuditoria(); log.setEvento("DADOS_TITULAR_EXPORTADOS");
		log.setUsuarioNome(dados.usuario()); log.setUsuarioIdentificador(dados.usuario());
		log.setDescricao("Exportação solicitada. Motivo: " + dados.motivo());
		log.setCriadoEm(OffsetDateTime.now()); logRepository.save(log);
		return new ExportacaoTitularDTO(cliente.getCpf(), cliente.getNomeCompleto(), cliente.getTelefone(),
				cliente.getEmail(), protocolos);
	}

	@Transactional
	public String anonimizar(SolicitacaoPrivacidadeDTO dados) {
		autorizacaoService.exigir(dados.perfil(), AcaoSistema.ANONIMIZAR_DADOS);
		if (!"ANONIMIZAR".equals(dados.confirmacao())) throw new IllegalArgumentException("Confirmação de anonimização inválida");
		if (politicaRepository.count() == 0 || politicaRepository.count() !=
				politicaRepository.countByStatusAprovacao(PoliticaLgpd.StatusAprovacao.APROVADA)) {
			throw new IllegalStateException("Todas as políticas LGPD devem estar aprovadas antes da anonimização");
		}
		var cliente = clienteRepository.findByCpf(dados.cpf())
				.orElseThrow(() -> new IllegalArgumentException("Titular não encontrado"));
		String anonimo = "ANON-" + hash(dados.cpf()).substring(0, 9);
		cobrancaRepository.anonimizarCpf(dados.cpf(), anonimo);
		historicoRepository.anonimizarCpf(dados.cpf(), anonimo);
		cliente.setCpf(anonimo); cliente.setNomeCompleto("Titular anonimizado");
		cliente.setTelefone(null); cliente.setEmail(null); cliente.setRbxCodigo(null);
		cliente.setAtualizadoEm(OffsetDateTime.now()); clienteRepository.save(cliente);
		var log = new LogAuditoria(); log.setEvento("TITULAR_ANONIMIZADO");
		log.setUsuarioNome(dados.usuario()); log.setUsuarioIdentificador(dados.usuario());
		log.setDescricao("Anonimização executada. Motivo: " + dados.motivo());
		log.setCriadoEm(OffsetDateTime.now()); logRepository.save(log);
		return anonimo;
	}

	private String hash(String valor) {
		try {
			byte[] bytes = MessageDigest.getInstance("SHA-256").digest(valor.getBytes(StandardCharsets.UTF_8));
			return java.util.HexFormat.of().formatHex(bytes).toUpperCase();
		} catch (Exception e) { throw new IllegalStateException("Não foi possível anonimizar", e); }
	}
}
