package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Collection;
import java.util.List;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
	Optional<Cliente> findByCpf(String cpf);
	List<Cliente> findAllByCpfIn(Collection<String> cpfs);
}
