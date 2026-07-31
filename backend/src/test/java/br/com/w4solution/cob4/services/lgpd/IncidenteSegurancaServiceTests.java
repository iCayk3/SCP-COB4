package br.com.w4solution.cob4.services.lgpd;
import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.lgpd.IncidenteDTO;
import br.com.w4solution.cob4.repositories.IncidenteSegurancaRepository;
import br.com.w4solution.cob4.security.*;
import br.com.w4solution.cob4.services.usuario.AuditoriaSegurancaService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class IncidenteSegurancaServiceTests {
	@Mock IncidenteSegurancaRepository repository;@Mock UsuarioAtualService usuario;@Mock AuditoriaSegurancaService auditoria;
	@Test void criaIncidenteComProtocoloEAuditoria(){when(usuario.atual()).thenReturn(new UsuarioAutenticado(1L,"Gestor","gestor",PerfilUsuario.GERENTE));when(repository.save(any())).thenAnswer(i->i.getArgument(0));var salvo=service().criar(dto(null));assertThat(salvo.protocolo()).startsWith("INC-");assertThat(salvo.status()).isEqualTo(IncidenteSeguranca.Status.ABERTO);verify(auditoria).registrar(eq("INCIDENTE_CRIADO"),any(),any(),any());}
	@Test void naoComunicaSemReferencia(){var i=new IncidenteSeguranca();i.setId(1L);when(repository.findById(1L)).thenReturn(Optional.of(i));assertThatThrownBy(()->service().atualizar(1L,dto(IncidenteSeguranca.Status.COMUNICADO))).isInstanceOf(IllegalArgumentException.class).hasMessageContaining("ANPD");}
	private IncidenteDTO dto(IncidenteSeguranca.Status s){return new IncidenteDTO(null,null,"Vazamento","Descrição","CPF",1,IncidenteSeguranca.Severidade.ALTA,s,null,null,null,null,null,null,null);}
	private IncidenteSegurancaService service(){return new IncidenteSegurancaService(repository,usuario,auditoria);}
}
