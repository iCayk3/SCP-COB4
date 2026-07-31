# Operacao e homologacao

## Segredos

Copie `.env.example` para `.env` e crie os quatro arquivos em `secrets/` usados pelo Compose. Esses arquivos e `.env` sao ignorados pelo Git. Em producao, injete os mesmos valores pelo gerenciador de segredos da plataforma.

## Homologacao

Execute `docker compose --env-file .env -f compose.homolog.yml up -d --build`. A aplicacao fica na porta `HTTP_PORT` (8088 por padrao). O backend so e considerado pronto depois de `/actuator/health/readiness` responder com sucesso.

## Metricas e logs

O backend emite logs JSON no console. Health checks estao em `/actuator/health/liveness` e `/actuator/health/readiness`; Prometheus coleta `/actuator/prometheus` pela rede interna.

## Backup e restauracao

Execute `scripts/backup.sh` diariamente em uma imagem que contenha os clientes PostgreSQL, com as variaveis documentadas no script. Copie os arquivos `.dump` e `.sha256` para armazenamento externo, criptografado e versionado.

Toda copia deve ser validada com `scripts/restore-test.sh /backups/arquivo.dump`. O teste cria um banco temporario, restaura integralmente, verifica o historico Flyway e remove o banco temporario. Registre o resultado e realize o ensaio ao menos mensalmente.
