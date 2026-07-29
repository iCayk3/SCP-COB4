package br.com.w4solution.cob4.controllers;
import br.com.w4solution.cob4.domain.AgendamentoAtendimento;
import br.com.w4solution.cob4.dto.atendimento.*;
import br.com.w4solution.cob4.services.atendimento.Cliente360Service;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController @RequestMapping("/api")
public class Cliente360Controller {
	private final Cliente360Service service;
	public Cliente360Controller(Cliente360Service s){service=s;}
	@GetMapping("/processos/{ref}/anexos") @org.springframework.security.access.prepost.PreAuthorize("@carteiraAccess.podeAcessar(#ref)")
	public Object anexos(@PathVariable String ref){return service.listarAnexos(ref);}
	@PostMapping(value="/processos/{ref}/anexos",consumes=MediaType.MULTIPART_FORM_DATA_VALUE) @org.springframework.security.access.prepost.PreAuthorize("@carteiraAccess.podeAcessar(#ref)")
	public Object anexar(@PathVariable String ref,@RequestPart MultipartFile arquivo)throws Exception{return service.anexar(ref,arquivo);}
	@GetMapping("/processos/{ref}/anexos/{id}") @org.springframework.security.access.prepost.PreAuthorize("@carteiraAccess.podeAcessar(#ref)")
	public ResponseEntity<byte[]> baixar(@PathVariable String ref,@PathVariable Long id){var a=service.baixar(ref,id);return ResponseEntity.ok().contentType(MediaType.parseMediaType(a.getTipoConteudo())).header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename*=UTF-8''"+java.net.URLEncoder.encode(a.getNomeOriginal(),java.nio.charset.StandardCharsets.UTF_8)).header("X-Content-Type-Options","nosniff").body(a.getConteudo());}
	@GetMapping("/processos/{ref}/agenda") @org.springframework.security.access.prepost.PreAuthorize("@carteiraAccess.podeAcessar(#ref)") public Object agenda(@PathVariable String ref){return service.listarAgenda(ref);}
	@PostMapping("/processos/{ref}/agenda") @org.springframework.security.access.prepost.PreAuthorize("@carteiraAccess.podeAcessar(#ref)") public Object agendar(@PathVariable String ref,@Valid @RequestBody AgendaDTO d){return service.agendar(ref,d);}
	@PatchMapping("/processos/{ref}/agenda/{id}") @org.springframework.security.access.prepost.PreAuthorize("@carteiraAccess.podeAcessar(#ref)") public Object status(@PathVariable String ref,@PathVariable Long id,@RequestParam AgendamentoAtendimento.Status status){return service.statusAgenda(ref,id,status);}
	@GetMapping("/clientes/{cpf}/atualizacoes") public Object atualizacoes(@PathVariable String cpf){return service.listarAtualizacoes(cpf);}
	@PostMapping("/clientes/{cpf}/atualizacoes") public Object solicitar(@PathVariable String cpf,@Valid @RequestBody AtualizacaoClienteDTO d){return service.solicitar(cpf,d);}
	@PatchMapping("/clientes/atualizacoes/{id}") public Object decidir(@PathVariable Long id,@RequestParam boolean aprovar){return service.decidir(id,aprovar);}
}
