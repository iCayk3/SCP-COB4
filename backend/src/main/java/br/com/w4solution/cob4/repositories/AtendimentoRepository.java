package br.com.w4solution.cob4.repositories;

import br.com.w4solution.cob4.domain.Atendimento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.OffsetDateTime;
import java.util.Collection;

public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {
	interface ProdutividadeOperador {String getOperador();long getQuantidade();}
	List<Atendimento> findByCobrancaReferenciaOrderByRealizadoEmDesc(String referencia);
	boolean existsByCobrancaIdAndOperadorIdentificador(Long cobrancaId, String operadorIdentificador);
	Page<Atendimento> findByCobrancaReferencia(String referencia, Pageable pageable);
	List<Atendimento> findByRealizadoEmBetween(OffsetDateTime inicio, OffsetDateTime fim);
	long countByOperadorIdentificadorAndRealizadoEmBetween(String operador,OffsetDateTime inicio,OffsetDateTime fim);
	long countByOperadorIdentificadorAndRealizadoEmBetweenAndResultadoNot(String operador,OffsetDateTime inicio,OffsetDateTime fim,Atendimento.Resultado resultado);
	long countByOperadorIdentificadorAndRealizadoEmBetweenAndResultadoIn(String operador,OffsetDateTime inicio,OffsetDateTime fim,Collection<Atendimento.Resultado> resultados);
	long countByRealizadoEmBetween(OffsetDateTime inicio,OffsetDateTime fim);
	@org.springframework.data.jpa.repository.Query("select a.operadorIdentificador as operador,count(a) as quantidade from Atendimento a where a.realizadoEm>=:inicio and a.realizadoEm<:fim group by a.operadorIdentificador")
	List<ProdutividadeOperador> produtividadeEntre(@org.springframework.data.repository.query.Param("inicio")OffsetDateTime inicio,@org.springframework.data.repository.query.Param("fim")OffsetDateTime fim);
}
