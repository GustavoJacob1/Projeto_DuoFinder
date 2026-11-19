# Brawlhalla DuoFinder — Plano de implementação

Baseado em `docs/especificacao.md` (CA01–CA15) e no estado atual do repositório em 15/11/2026. Prazo do projeto: **30/11/2026**.

> Este documento é apenas um plano. Nada foi implementado.

## 1. Ponto de partida

O código já cobre boa parte da especificação, mas **está todo sem commit** (veja `git status`: páginas novas, CSS novos, alterações em `app.js`, controller, model e rotas). Por isso o plano trabalha em três frentes:

1. **Proteger o que existe** (commit em etapas, remoção de legado).
2. **Fechar lacunas** em relação aos critérios de aceitação.
3. **Validar cada CA** de forma explícita (matriz na seção 8).

### O que já existe

| Camada | Estado |
|---|---|
| Banco (`src/database/script-tabelas.sql`) | Tabelas `regiao`, `usuario`, `lenda`, `usuario_lenda`, com CHECKs (Elo 200–3000, horário, mostrar_discord, ordem 1–3) e seed de 18 jogadores. |
| API (`src/routes/usuarios.js` → controller → model) | `POST /usuarios/cadastrar`, `POST /usuarios/autenticar`, `GET /usuarios/listar/:idUsuario`, `PUT /usuarios/editar/:idUsuario`, `DELETE /usuarios/deletar/:idUsuario`. |
| Front-end (`public/`) | `index`, `cadastro`, `login`, `buscar`, `perfil`, `meu-perfil`, `dashboard` (Chart.js 4.4.1 via CDN), `js/lendas.js`, CSS por página. |
| Sessão | `localStorage` (`ID_USUARIO`, `NICK_USUARIO`, `ELO_USUARIO` …), guarda de página por `if (meuNick == undefined)`. |
| Compatibilidade (CA06) | Calculada no navegador: base 92 − dif. Elo/10, +2 por Lenda em comum, +2 mesmo horário, −8 região diferente, limitada a 10–99. |
| Privacidade do Discord (CA10) | `listar` já devolve `''` quando `mostrar_discord = 'nao'` (filtro feito no SQL, não no front). |

### Lacunas e riscos encontrados

| # | Lacuna / risco | Impacto |
|---|---|---|
| L1 | Rotas `PUT /editar/:id` e `DELETE /deletar/:id` não verificam quem está chamando; qualquer pessoa edita/exclui qualquer conta. | Segurança, CA09 |
| L2 | Models montam SQL por interpolação de texto (`'${email}'`). Há injeção de SQL em login, cadastro e edição. | Segurança |
| L3 | Senha em texto puro (`VARCHAR(50)`). | Segurança |
| L4 | Validação só no front (`cadastro.html`, `meu-perfil.html`). O controller só checa `undefined`; a API aceita Elo fora da faixa só porque o CHECK do banco barra (e devolve mensagem SQL crua). | CA01, CA14 |
| L5 | `calcularDivisao` e `calcularCompatibilidade` estão **copiadas** em `buscar`, `dashboard`, `perfil` (e a divisão também em `cadastro` e `meu-perfil`). Qualquer ajuste de regra precisa ser feito 4–5 vezes. | Manutenção, CA06 |
| L6 | Arquivos legados do template (`aquarios`, `avisos`, `empresas`, `medidas`, `src/routes/index.js` com `res.render`, `public/js/sessao.js`, `public/js/alerta.js`, `public/css/estilo.css` / `dashboards.css`) continuam no projeto e registrados em `app.js`. | Ruído, rotas inúteis expostas |
| L7 | Card de exemplo da `index.html` mostra "Jacob — Elo 1820 / Platina", mas o seed grava Jacob com 1950. | Coerência visual |
| L8 | `listar` usa `JOIN usuario_lenda` (interno) e não devolve jogador sem Lenda; `editar` apaga e recria as Lendas em chamadas separadas, sem transação. Falha no meio deixa o jogador sem Lendas (e invisível nas buscas). | CA09 |
| L9 | `editar` devolve 500 com `sqlMessage` quando o e-mail novo já existe; o front não trata. | CA14 |
| L10 | A guarda de sessão é só `localStorage` no cliente. Após "Sair", o botão Voltar pode exibir página em cache. | CA03 |
| L11 | Responsividade só validada com breakpoints (`cadastro.css` e `login.css` têm menos regras que as demais). | CA13 |
| L12 | Os KPIs do dashboard têm limiar de compatibilidade fixo (±150); a busca usa o slider. | CA11 (consistência) |

## 2. Decisões técnicas

Todas respeitam as restrições da especificação (aluno único, tecnologias do 1º semestre, ferramentas gratuitas, sem API oficial do Brawlhalla).

| Decisão | Escolha | Motivo |
|---|---|---|
| Stack | Manter Node + Express + MySQL + HTML/CSS/JS puro + Chart.js | Já é o que o projeto usa; evita reescrita perto do prazo. |
| Onde calcular compatibilidade e filtros | **No navegador**, a partir de `GET /listar` (18 a poucas centenas de jogadores) | Já funciona; o volume é pequeno; evita criar endpoint novo. Revisitar só se a lista crescer muito. |
| Código compartilhado | Criar `public/js/duofinder.js` com `calcularDivisao`, `calcularCompatibilidade`, `diferencaElo`, `sair`, `exigirLogin` | Remove L5 e L10 num só lugar. Mantém estilo de funções simples (sem módulos ES). |
| Segurança de SQL | Trocar interpolação por **consultas parametrizadas** (`?`) em `database.executar(sql, params)` | Corrige L2 sem nova dependência (mysql2 já suporta). |
| Hash de senha | **Etapa opcional (estendida)**: `bcryptjs` (gratuito). Se o prazo apertar, documentar como limitação conhecida | L3 exige nova dependência e migração do seed; não é CA. |
| Autorização de editar/excluir | Enviar `idUsuario` + e-mail/senha? **Não.** Solução simples compatível com o escopo: o front envia `idUsuario` no corpo e o controller exige `senhaAtual` para excluir e para alterar e-mail. Alternativa mais robusta (token de sessão) fica como evolução | Sem JWT para não ultrapassar o escopo da disciplina; a confirmação por senha fecha o uso trivial da lacuna L1. |
| Atomicidade de editar/cadastrar | Usar uma conexão com `BEGIN … COMMIT` (função `executarTransacao`) para gravar usuário + Lendas juntos | Corrige L8. |
| Validação | Duplicar as regras no controller (função `validarPerfil`), com mensagens em português e status 400/409 | CA01/CA14: front dá feedback rápido; servidor é a fonte da verdade. |
| Sessão | Continuar em `localStorage`; `exigirLogin()` roda no início de cada página restrita e também no evento `pageshow` (cobre cache do botão Voltar) | Resolve L10 sem backend de sessão. |
| Cadastro duplicado | Detectar `ER_DUP_ENTRY` no controller e responder 409 "E-mail já cadastrado" | Evita o front testar `erro.includes('Duplicate')`. |
| Estilo visual | Azul-marinho (base), ciano (interações), dourado (conquistas/Elo); Chakra Petch nos títulos, Inter no texto | Seção 6 da especificação; verificar nos CSS que as variáveis existem e as fontes são importadas. |

## 3. Arquivos

### Criar

| Arquivo | Função |
|---|---|
| `public/js/duofinder.js` | Funções compartilhadas (divisão, compatibilidade, sessão, sair). |
| `src/middlewares/validarPerfil.js` *(ou função dentro do controller, se preferir manter a estrutura atual)* | Regras de validação do cadastro/edição. |
| `docs/testes.md` | Roteiro de testes manuais dos CA (matriz da seção 8) com campo "passou / falhou". |

### Alterar

| Arquivo | Alteração |
|---|---|
| `src/database/config.js` | `executar(instrucao, parametros)` aceita parâmetros; nova `executarTransacao(lista)`; erro de conexão devolvido ao controller (hoje `resolve` roda após `reject`). |
| `src/models/usuarioModel.js` | Todas as consultas parametrizadas; `cadastrar` e `editar` gravam usuário + Lendas em transação; remove `console.log` com senha. |
| `src/controllers/usuarioController.js` | Validação completa (nick 3–16, e-mail, senha ≥ 8, Elo 200–3000, região, 1–3 Lendas sem repetição, horário, bio ≤ 200, Discord ≤ 40); mensagens e status HTTP; exige senha para excluir/trocar e-mail; não devolve `senha`. |
| `src/routes/usuarios.js` | Sem novas rotas obrigatórias; opcional `GET /usuarios/perfil/:id` se quiser carregar só um jogador no `perfil.html`. |
| `app.js` | Remover `avisos`, `medidas`, `aquarios`, `empresas` e o `indexRouter` com `res.render`; ordem de middlewares (`cors` antes de `static`/rotas). |
| `public/*.html` | Trocar funções duplicadas por `<script src="js/duofinder.js">`; `exigirLogin()` e `pageshow`; mensagens de erro/sucesso (CA14); corrigir card de exemplo da `index.html` (L7). |
| `public/css/*.css` | Ajustes de responsividade (CA13), principalmente `cadastro.css`, `login.css` e tabelas/cards do `dashboard.css`. |
| `src/database/script-tabelas.sql` | Remover `SELECT`s de teste do fim (ou mover para `docs/consultas.sql`); seed coerente com a index; se adotar bcrypt, gerar hashes no seed. |
| `README.md` | Como subir o banco, `.env.dev`, `npm run dev`, usuário de teste. |

### Remover (legado do template)

`src/controllers/{aquario,aviso,empresa,medida}Controller.js`, `src/models/{aquario,aviso,empresa,medida}Model.js`, `src/routes/{aquarios,avisos,empresas,medidas}.js`, `src/routes/index.js`, `public/js/sessao.js`, `public/js/alerta.js`, `public/css/estilo.css`, `public/css/dashboards.css` (confirmar que nenhuma página ativa os referencia antes de apagar). Manter `DOCUMENTOS_DE_APOIO/` fora da entrega ou documentado como apoio.

## 4. Componentes

### Backend

- **config.js** — conexão MySQL, `executar` (uma consulta com parâmetros) e `executarTransacao` (várias consultas atômicas).
- **usuarioModel** — `autenticar`, `cadastrar` (usuário + Lendas), `listar`, `editar` (usuário + Lendas), `deletar` (Lendas + usuário), `buscarPorId`.
- **usuarioController** — valida entrada, chama o model, traduz erros do banco em mensagens (409 duplicado, 400 inválido, 401/403 credencial, 500 genérico).
- **usuarios.js (rotas)** — cinco rotas atuais.

### Frontend

- **duofinder.js** — `calcularDivisao(elo)`, `calcularCompatibilidade(jogador, eu)`, `diferencaElo`, `exigirLogin`, `sair`, `mostrarMensagem(elemento, texto, tipo)`.
- **lendas.js** — lista de 65 Lendas com imagens (já existe); conferir que bate com a tabela `lenda` (mesmos nomes, incluindo "Bödvar" e "Qinghua & Baobao").
- **index** — hero, card de exemplo, vídeo de gameplay (CA15), passos.
- **cadastro / login** — formulários com validação e feedback (CA01, CA02, CA14).
- **buscar** — filtros (distância de Elo, nick, região, Lenda, só com Discord) + cards ordenados por compatibilidade + estado vazio + modal de Discord (CA04–CA07, CA10).
- **perfil** — dados do jogador escolhido (`localStorage.PERFIL_ID`) e comparação com o usuário logado (CA08).
- **meu-perfil** — edição, prévia, excluir conta (CA09).
- **dashboard** — KPIs, gráficos de divisões, Lendas e regiões, top compatíveis, filtro por região (CA11, CA12).

## 5. Fluxos

**Cadastro** — `cadastro.html` valida → `POST /usuarios/cadastrar` → controller valida de novo → model grava `usuario` + `usuario_lenda` em transação → 200 → mensagem + redireciona para `login.html`. Erros: 400 (campo inválido), 409 (e-mail repetido), falha de rede (mensagem de conexão).

**Login** — `login.html` → `POST /usuarios/autenticar` → 200 com perfil (sem senha) → grava `localStorage` → `buscar.html`. 401/403 → "E-mail ou senha incorretos".

**Sair** — `sair()` limpa `localStorage` e vai para `index.html`; `exigirLogin()` (inclusive no `pageshow`) devolve para `login.html` se não houver sessão.

**Busca** — `buscar.html` → `GET /usuarios/listar/:meuId` (já sem o próprio usuário e com Discord mascarado) → filtra no navegador → calcula compatibilidade → ordena decrescente → renderiza cards; sem resultados → mensagem + botão "Limpar filtros".

**Ver perfil** — "Ver perfil" grava `PERFIL_ID` → `perfil.html` carrega a lista, localiza o jogador, mostra dados + comparação (✔/✖) + botão de Discord (desabilitado quando vazio).

**Editar perfil** — `meu-perfil.html` preenche com `localStorage` → `PUT /usuarios/editar/:id` → transação (usuário + Lendas) → atualiza `localStorage` → mensagem de sucesso. Excluir: confirmação + senha → `DELETE` → limpa sessão.

**Dashboard** — `GET /listar` → filtro de região → KPIs + 3 gráficos (+ top compatíveis) recalculados a cada mudança de região.

## 6. Regras de negócio

| Regra | Valor |
|---|---|
| Nickname | 3 a 16 caracteres |
| E-mail | Formato válido, único |
| Senha | Mínimo 8 caracteres (confirmação no cadastro) |
| Elo | Inteiro entre 200 e 3000 |
| Divisão | Tin < 910; Bronze 910–1129; Prata 1130–1389; Ouro 1390–1679; Platina 1680–1999; Diamante ≥ 2000 (única definição, em `duofinder.js`) |
| Região | BRZ, US-E, EU, SA |
| Horário | Manhã, Tarde, Noite, Madrugada |
| Lendas | 1 a 3, sem repetição; a primeira é a main (`ordem = 1`) |
| Discord | Opcional; só aparece para outros jogadores se `mostrar_discord = 'sim'` **e** não estiver vazio. Mascarado no SQL. |
| Termos | Obrigatório marcar para concluir o cadastro |
| Filtro de Elo (CA04) | `|elo_outro − meu_elo| ≤ distância` (50 a 400, padrão 150) |
| Compatibilidade (CA06) | `92 − dif/10 + 2×Lendas em comum + 2 (mesmo horário) − 8 (região diferente)`, limitada a 10–99, arredondada; ordenação decrescente |
| Dashboard | "Compatíveis" = jogadores dentro de ±150 do meu Elo na região selecionada (documentar; opcionalmente reutilizar o slider) |
| Escopo v1 | Sem chat, sem partidas, sem API oficial; dados informados manualmente |

## 7. Etapas numeradas e validação

Cada etapa termina com um commit pequeno. Ordem pensada para o prazo (restam ~15 dias): 1–4 são obrigatórias, 5–10 fecham os CA, 11–12 são "se der tempo".

### Etapa 1 — Congelar o estado atual
- **Fazer:** conferir o app rodando, criar branch (ex.: `feature/duofinder-v1`) e commitar o que existe em commits temáticos (banco, API, páginas, assets).
- **Validar:** `git status` limpo; `npm run dev` sobe; `http://localhost:<APP_PORT>/` abre; login com `jacob@email.com` / `duofinder2v2` chega em `buscar.html`.

### Etapa 2 — Remover legado
- **Fazer:** apagar controllers/models/rotas/JS/CSS do template listados na seção 3; limpar `app.js`.
- **Validar:** `grep -ri "aquario\|medida\|aviso\|empresa" src public app.js` sem resultados; todas as páginas carregam sem 404 no Network; `GET /aquarios` devolve 404.

### Etapa 3 — Banco e `config.js`
- **Fazer:** `executar(sql, params)`, `executarTransacao`, correção do `reject/resolve`; limpar `SELECT`s do final do script; alinhar seed (Jacob × card da index).
- **Validar:** rodar o script no MySQL Workbench sem erro; `SELECT COUNT(*)` = 4 regiões, 65 Lendas, 18 usuários, 54 vínculos; parar o MySQL e confirmar que a API responde 500 com mensagem genérica (não trava).

### Etapa 4 — Segurança do backend (L1, L2, L3, L4, L8, L9)
- **Fazer:** parametrizar o model; validação no controller; transação em cadastrar/editar; exigir senha para excluir e trocar e-mail; não devolver `senha`; 409 para e-mail repetido.
- **Validar (Postman/REST Client/`curl`):**
  - Login com `' OR '1'='1` → 401/403, não autentica.
  - Cadastro com Elo 5000, 0 Lendas, 4 Lendas ou Lenda repetida → 400 com mensagem em português.
  - Cadastro duplicado → 409.
  - `PUT /editar` com e-mail de outro jogador → 409 e Lendas intactas.
  - Derrubar a gravação de Lendas (nome de Lenda inexistente) → usuário **não** é criado (rollback).
  - `DELETE` sem senha → 400/403.

### Etapa 5 — `duofinder.js` e limpeza do front (L5, L10)
- **Fazer:** extrair funções compartilhadas; substituir as cópias nas 5 páginas; `exigirLogin()` + `pageshow`.
- **Validar:** a divisão e a compatibilidade mostradas para o mesmo jogador são idênticas em `buscar`, `perfil` e `dashboard`; após **Sair**, usar o botão Voltar do navegador não mostra conteúdo restrito (**CA03**); abrir `buscar.html` direto, sem sessão → redireciona para `login.html`.

### Etapa 6 — Cadastro e login (CA01, CA02, CA14)
- **Fazer:** ligar as mensagens do controller ao front; marcar campos obrigatórios; impedir envio sem termos; confirmar contador de Lendas (máx. 3).
- **Validar:** tabela de casos — nick curto, e-mail inválido, senha curta, senhas diferentes, Elo fora da faixa, 0 Lendas, termos desmarcados → cada um mostra a mensagem certa e **não** chama a API; cadastro válido → mensagem de sucesso → login funciona com a conta nova; senha errada → "E-mail ou senha incorretos"; servidor desligado → "Não foi possível conectar ao servidor".

### Etapa 7 — Busca e compatibilidade (CA04–CA07)
- **Fazer:** revisar filtros e estado vazio; garantir que "Limpar filtros" restaura tudo; conferir ordenação.
- **Validar (usando Jacob, Elo 1950, BRZ, Noite, Hattori/Orion/Kor):**
  - Distância ±50 só mostra jogadores entre 1900 e 2000.
  - Subir o slider aumenta a lista; nenhum item fora do intervalo aparece (**CA04**).
  - Filtro por nick parcial, região `EU`, Lenda `Hattori` atualizam a lista a cada alteração (**CA05**).
  - A lista está em ordem decrescente de % e um jogador com mesma região/horário/Lendas fica acima de outro de mesmo Elo sem nada em comum (**CA06**); calcular à mão um caso (ex.: Zyphr 1865: 92 − 8,5 + 6 + 2 = 91).
  - Região `SA` + Lenda improvável → mensagem de "nenhum jogador" e botão limpar restaura (**CA07**).

### Etapa 8 — Perfil e privacidade do Discord (CA08, CA10)
- **Fazer:** revisar `perfil.html` (nick, Elo, divisão, região, Lendas, horário) e o estado "jogador não encontrado".
- **Validar:** abrir o perfil de Zyphr (todas as informações aparecem); abrir o de **Mizuki** (`mostrar_discord = 'nao'`) → botão "Sem Discord" desabilitado, e `GET /usuarios/listar/1` no navegador **não** contém o Discord dela; marcar "mostrar Discord" no `meu-perfil` de outra conta e confirmar que passa a aparecer para os demais.

### Etapa 9 — Editar perfil (CA09, CA14)
- **Fazer:** salvar via transação; atualizar `localStorage`; tratar 409 e falhas de rede; excluir conta com senha.
- **Validar:** trocar Elo e Lendas → aparece em `meu-perfil`, na `buscar` de **outra** conta e no `dashboard`; trocar para e-mail já usado → mensagem clara e dados mantidos; recarregar a página mantém as alterações; excluir conta de teste → login falha e o jogador some da busca.

### Etapa 10 — Dashboard (CA11, CA12)
- **Fazer:** conferir KPIs (total, Elo médio, compatíveis, % com Discord) e gráficos (divisões, Lendas, regiões); tratar região sem jogadores.
- **Validar:** com região "Todas" o total bate com `SELECT COUNT(*)` menos 1 (o próprio usuário); Elo médio bate com `SELECT AVG(elo)` (excluindo o logado); trocar para `EU` reduz total e gráficos (só Vexa e semelhantes); região sem jogadores não gera `NaN` nem erro no console; gráficos são recriados sem sobreposição ao trocar o filtro.

### Etapa 11 — Interface e responsividade (CA13, CA15, seção 6)
- **Fazer:** revisar breakpoints; checar fonte/cores; vídeo da home com `muted`, `loop`, `playsinline`, `poster` e `preload="metadata"`.
- **Validar:** no DevTools (largura 360, 768, 1280) em todas as 7 páginas: sem barra de rolagem horizontal, botões clicáveis, cards sem corte, gráficos legíveis; vídeo toca/está mudo, não cobre o menu e o botão "Registrar agora" funciona (**CA15**); se o vídeo falhar, o `poster` aparece e a navegação continua.

### Etapa 12 — Opcional: hash de senha com bcrypt
- **Fazer:** adicionar `bcryptjs`, trocar `senha` para `VARCHAR(60)`, gerar hashes no seed, comparar no login.
- **Validar:** `SELECT senha FROM usuario` não mostra texto puro; login do seed e de contas novas continua funcionando. Se não for feita, registrar em `README.md` como limitação conhecida.

### Etapa 13 — Documentação e entrega
- **Fazer:** atualizar `README.md`; preencher `docs/testes.md` com o resultado de cada CA; revisar `AGENTS.md`; limpar `console.log` com dados sensíveis; conferir `.env`/`.env.dev` **fora do commit** (hoje aparecem como modificados).
- **Validar:** clonar o repositório numa pasta nova, seguir o README do zero (banco → `npm install` → `npm run dev`) e executar o fluxo completo: cadastro → login → busca → perfil → editar → dashboard → sair.

## 8. Matriz de validação dos critérios de aceitação

| CA | Etapa | Verificação resumida |
|---|---|---|
| CA01 | 4, 6 | Cadastro só conclui com todos os campos obrigatórios, ≤ 3 Lendas e termos aceitos. |
| CA02 | 4, 6 | Login com credenciais válidas entra; inválidas mostram erro. |
| CA03 | 5 | "Sair" limpa a sessão; Voltar/URL direta redirecionam ao login. |
| CA04 | 7 | Resultados respeitam a distância de Elo escolhida. |
| CA05 | 7 | Nick, região e Lenda filtram e atualizam a lista na hora. |
| CA06 | 5, 7 | % calculada pela fórmula; ordem decrescente. |
| CA07 | 7 | Mensagem de vazio + limpar filtros. |
| CA08 | 8 | Perfil mostra nick, Elo, divisão, região, Lendas, horário. |
| CA09 | 9 | Edição reflete em Meu perfil e nas buscas. |
| CA10 | 4, 8 | Discord oculto na resposta da API quando não autorizado. |
| CA11 | 10 | Total, Elo médio, compatíveis e contatos conferem com o banco. |
| CA12 | 10 | Gráficos de divisão, Lendas e regiões; filtro de região atualiza tudo. |
| CA13 | 11 | 360/768/1280 px sem corte ou sobreposição. |
| CA14 | 4, 6, 9 | Mensagem clara em cadastro, login, edição e falha de conexão. |
| CA15 | 11 | Vídeo da home toca sem atrapalhar a navegação. |

## 9. Cronograma sugerido (até 30/11/2026)

| Período | Etapas |
|---|---|
| 15–17/11 | 1, 2, 3 |
| 18–20/11 | 4, 5 |
| 21–24/11 | 6, 7, 8 |
| 25–27/11 | 9, 10, 11 |
| 28–29/11 | 13 (e 12, se sobrar tempo) |
| 30/11 | Reserva / entrega |

## 10. Riscos

- **Prazo apertado:** se faltar tempo, cortar a etapa 12 e simplificar a etapa 4 (manter parametrização e validação; adiar confirmação por senha).
- **Refatoração das páginas** pode quebrar telas já prontas: fazer a etapa 5 uma página por vez, testando antes de seguir.
- **Dados do seed** vs. `lendas.js`: nomes divergentes (acentos, "&") quebram o `INSERT ... SELECT id FROM lenda WHERE nome = ...` e geram `NULL`; validar na etapa 3.
- **Ambiente:** `app.js` alterna dev/produção comentando linhas; garantir que a entrega rode com `.env.dev`.
