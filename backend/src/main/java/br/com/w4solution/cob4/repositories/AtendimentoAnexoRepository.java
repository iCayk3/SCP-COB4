package br.com.w4solution.cob4.repositories;
import br.com.w4solution.cob4.domain.AtendimentoAnexo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.OffsetDateTime;
public interface AtendimentoAnexoRepository extends JpaRepository<AtendimentoAnexo, Long> {
	List<AtendimentoAnexo> findByCobrancaReferenciaOrderByEnviadoEmDesc(String referencia);
	List<AtendimentoAnexo> findByClassificacaoAndEnviadoEmBefore(AtendimentoAnexo.Classificacao classificacao, OffsetDateTime limite);
}
