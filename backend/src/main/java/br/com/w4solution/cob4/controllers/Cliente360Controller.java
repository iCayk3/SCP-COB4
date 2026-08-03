package br.com.w4solution.cob4.controllers;
import br.com.w4solution.cob4.domain.AgendamentoAtendimento;
import br.com.w4solution.cob4.dto.atendimento.*;
import br.com.w4solution.cob4.services.atendimento.Cliente360Service;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import br.com.w4solution.cob4.dto.api.PaginaDTO;

@RestController @RequestMapping("/api")
public class Cliente360Controller {
	private final Cliente360Service service;
	public Cliente360Controller(Cliente360Service s){service=s;}
	@GetMapping("/processos/{ref}/anexos") @org.springframework.security.access.prepost.PreAuthorize("@carteiraAccess.podeAcessar(#ref)")
	public List<Cliente360Service.AnexoResumo> anexos(@PathVariable String ref){return service.listarAnexos(ref);}
	@PostMapping(value="/processos/{ref}/anexos",consumes=MediaType.MULTIPART_FORM_DATA_VALUE) @org.springframework.security.access.prepost.PreAuthorize("@carteiraAccess.podeAcessar(#ref)")
	public Cliente360Service.AnexoResumo anexar(@PathVariable String ref,@RequestPart MultipartFile arquivo,@RequestParam(defaultValue="OUTRO") br.com.w4solution.cob4.domain.AtendimentoAnexo.Classificacao classificacao)throws Exception{return service.anexar(ref,arquivo,classificacao);}
	@GetMapping("/processos/{ref}/anexos/{id}") @org.springframework.security.access.prepost.PreAuthorize("@carteiraAccess.podeAcessar(#ref)")
	public ResponseEntity<byte[]> baixar(@PathVariable String ref,@PathVariable Long id){var a=service.baixar(ref,id);return ResponseEntity.ok().contentType(MediaType.parseMediaType(a.getTipoConteudo())).header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename*=UTF-8''"+java.net.URLEncoder.encode(a.getNomeOriginal(),java.nio.charset.StandardCharsets.UTF_8)).header("X-Content-Type-Options","nosniff").body(a.getConteudo());}
	@GetMapping("/processos/{ref}/agenda") @org.springframework.security.access.prepost.PreAuthorize("@carteiraAccess.podeAcessar(#ref)") public List<Cliente360Service.AgendaResumo> agenda(@PathVariable String ref){return service.listarAgenda(ref);}
	@GetMapping("/processos/{ref}/agenda/pagina") @org.springframework.security.access.prepost.PreAuthorize("@carteiraAccess.podeAcessar(#ref)") public PaginaDTO<Cliente360Service.AgendaResumo> agendaPagina(@PathVariable String ref,@RequestParam(defaultValue="0") int pagina,@RequestParam(defaultValue="20") int tamanho){return service.listarAgendaPagina(ref,pagina,Math.min(Math.max(tamanho,1),100));}
	@PostMapping("/processos/{ref}/agenda") @org.springframework.security.access.prepost.PreAuthorize("@carteiraAccess.podeAcessar(#ref)") public Cliente360Service.AgendaResumo agendar(@PathVariable String ref,@Valid @RequestBody AgendaDTO d){return service.agendar(ref,d);}
	@PatchMapping("/processos/{ref}/agenda/{id}") @org.springframework.security.access.prepost.PreAuthorize("@carteiraAccess.podeAcessar(#ref)") public Cliente360Service.AgendaResumo status(@PathVariable String ref,@PathVariable Long id,@RequestParam AgendamentoAtendimento.Status status){return service.statusAgenda(ref,id,status);}
	@GetMapping("/clientes/{cpf}/atualizacoes") @org.springframework.security.access.prepost.PreAuthorize("@carteiraAccess.podeAcessarCliente(#cpf)") public List<Cliente360Service.AtualizacaoResumo> atualizacoes(@PathVariable String cpf){return service.listarAtualizacoes(cpf);}
	@PostMapping("/clientes/{cpf}/atualizacoes") @org.springframework.security.access.prepost.PreAuthorize("@carteiraAccess.podeAcessarCliente(#cpf)") public Cliente360Service.AtualizacaoResumo solicitar(@PathVariable String cpf,@Valid @RequestBody AtualizacaoClienteDTO d){return service.solicitar(cpf,d);}
	@PatchMapping("/clientes/atualizacoes/{id}") public Cliente360Service.AtualizacaoResumo decidir(@PathVariable Long id,@RequestParam boolean aprovar){return service.decidir(id,aprovar);}
}
