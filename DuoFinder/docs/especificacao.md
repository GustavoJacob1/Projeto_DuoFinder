# Brawlhalla DuoFinder

## 1. Contexto

Brawlhalla é um jogo gratuito de luta em plataformas, desenvolvido pela Blue Mammoth Games e publicado pela Ubisoft. O jogo permite que jogadores disputem partidas individuais ou em equipes, utilizando personagens conhecidos como Legends (Lendas), que possuem diferentes armas, atributos e estilos de combate.

O objetivo é derrotar os adversários, lançando-os para fora da arena por meio de ataques, combos e estratégias. Brawlhalla se destaca por combinar diversão e competitividade, sendo acessível para jogadores casuais e também para aqueles que buscam aprimorar suas habilidades.

O jogo possui um cenário competitivo com campeonatos regionais e internacionais, incluindo o Brawlhalla World Championship (BCX). Nas partidas ranqueadas, os jogadores utilizam um sistema de pontuação chamado Elo, que representa sua classificação competitiva.

Uma das modalidades disponíveis é o 2v2 ranqueado, em que duas equipes de dois jogadores se enfrentam. Nessa modalidade, além da habilidade individual, são importantes a comunicação, o entrosamento e a combinação de estratégias entre os parceiros.

## 2. Objetivo

Objetivo geral

Desenvolver uma plataforma web que facilite a busca por parceiros para partidas ranqueadas 2v2 de Brawlhalla, conectando jogadores com níveis competitivos e preferências semelhantes.

Objetivos específicos

Permitir o cadastro e login de jogadores.

Registrar informações como nickname, Elo e Lendas favoritas.

Desenvolver um sistema de busca por jogadores com Elo semelhante.

Permitir a visualização das informações competitivas de outros usuários.

Criar uma dashboard com indicadores e gráficos sobre os jogadores cadastrados.

Facilitar o contato entre jogadores interessados em formar duplas.

## 3. Escopo

O projeto consiste no desenvolvimento de uma aplicação web para conectar jogadores de Brawlhalla interessados em disputar partidas ranqueadas 2v2.

Funcionalidades previstas

Cadastro e login: criação de contas e autenticação dos usuários.

Perfil do jogador: registro e atualização de nickname, Elo, região e Lendas favoritas.

Busca de parceiros: filtragem de jogadores por proximidade de Elo e preferências.

Visualização de perfis: apresentação das informações dos possíveis parceiros.

Contato: disponibilização opcional do Discord para facilitar a comunicação.

Dashboard: apresentação de indicadores e gráficos, como quantidade de jogadores cadastrados, jogadores com Elo compatível, distribuição de Elo e Lendas mais utilizadas.

A primeira versão não incluirá partidas dentro da plataforma, chat próprio ou integração automática com os dados oficiais do Brawlhalla.

## 4. Funcionalidades

Para o desenvolvimento e funcionamento da plataforma, serão consideradas as seguintes premissas:

Os usuários terão acesso à internet e a um navegador.

Os jogadores informarão corretamente suas informações, incluindo Elo e Lendas favoritas.

Os usuários terão conhecimento básico sobre Brawlhalla e seu sistema ranqueado.

As informações serão armazenadas em um banco de dados.

A proximidade de Elo será utilizada como um dos principais critérios de compatibilidade entre jogadores.

## 5. Regras de negócio

O desenvolvimento do projeto estará sujeito às seguintes limitações:

Prazo: conclusão até 30 de novembro de 2026.

Desenvolvimento individual: o projeto será desenvolvido por um único estudante.

Conhecimento técnico: utilização de tecnologias compatíveis com os conhecimentos adquiridos durante o primeiro semestre.

Recursos financeiros: prioridade para ferramentas e tecnologias gratuitas.

Dados dos jogadores: as informações competitivas serão inicialmente fornecidas e atualizadas manualmente pelos usuários.

Integração: a primeira versão não dependerá de APIs oficiais do Brawlhalla.

## 6. Interface

azul-marinho como base, ciano para interações e dourado para conquistas competitivas. A combinação de Chakra Petch nos títulos e Inter nos textos

## 7. Critérios de aceitação

1. Cadastro e Login

CA01 — Cadastro de usuário

O sistema deverá permitir o cadastro de jogadores com nickname, e-mail, senha, Elo, região e até três Lendas favoritas. O cadastro somente poderá ser concluído após o preenchimento dos campos obrigatórios e a aceitação dos termos.

CA02 — Autenticação

O usuário deverá conseguir acessar sua conta utilizando e-mail e senha válidos. Caso os dados estejam incorretos, o sistema deverá apresentar uma mensagem de erro.

CA03 — Encerramento de sessão

Ao clicar em "Sair", o usuário deverá ser desconectado e não poderá acessar funcionalidades restritas sem realizar uma nova autenticação.

2. Busca de Duplas

CA04 — Filtro por Elo

O sistema deverá apresentar jogadores cuja diferença de Elo esteja dentro do intervalo selecionado pelo usuário.

CA05 — Filtros de pesquisa

O usuário deverá conseguir filtrar jogadores por nickname, região e Lenda favorita. Os resultados deverão ser atualizados conforme os filtros aplicados.

CA06 — Compatibilidade

O sistema deverá calcular a compatibilidade entre jogadores considerando a diferença de Elo, as Lendas favoritas, a região e o horário habitual de jogo, ordenando os resultados pelos mais compatíveis.

CA07 — Ausência de resultados

Caso nenhum jogador atenda aos filtros selecionados, o sistema deverá apresentar uma mensagem informativa, permitindo que o usuário altere ou limpe os filtros.

3. Perfil dos Jogadores

CA08 — Visualização de perfis

Ao selecionar um jogador, o sistema deverá apresentar suas informações competitivas, incluindo nickname, Elo, divisão, região, Lendas favoritas e horário de jogo.

CA09 — Edição de perfil

O usuário deverá conseguir atualizar seus dados e salvar as alterações. As informações atualizadas deverão aparecer corretamente em seu perfil e nas buscas.

CA10 — Privacidade do Discord

O contato do Discord deverá ser exibido para outros jogadores somente quando o proprietário do perfil autorizar sua divulgação.

4. Dashboard

CA11 — Indicadores da comunidade

A dashboard deverá apresentar dados dos jogadores cadastrados, incluindo quantidade de usuários, Elo médio, jogadores compatíveis e contatos disponíveis.

CA12 — Gráficos e filtros

O sistema deverá exibir gráficos relacionados às divisões de Elo, Lendas favoritas e regiões, atualizando os indicadores conforme a região selecionada.

5. Interface e Experiência do Usuário

CA13 — Responsividade

O site deverá apresentar seus principais conteúdos, formulários e botões de forma legível e utilizável em computadores e dispositivos móveis, sem cortes ou sobreposição de elementos.

CA14 — Feedback das ações

O sistema deverá apresentar mensagens claras ao usuário após operações como cadastro, login, alteração de perfil ou falhas de conexão.

CA15 — Seção de gameplay (caso implementada)

O vídeo de gameplay deverá ser exibido corretamente na página inicial, sem prejudicar a navegação ou impedir o acesso às principais funcionalidades do site.