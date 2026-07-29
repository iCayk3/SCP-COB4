package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.Usuario;
import br.com.w4solution.cob4.security.PerfilUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
	Optional<Usuario> findByIdentificadorIgnoreCase(String identificador);
	boolean existsByIdentificadorIgnoreCase(String identificador);
	List<Usuario> findByPerfilAndAtivoTrueAndPresenteTrueOrderByIdentificador(PerfilUsuario perfil);
	long countByPerfilAndAtivoTrue(PerfilUsuario perfil);
}
