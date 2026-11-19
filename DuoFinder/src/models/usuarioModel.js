var database = require("../database/config")

// Procura o jogador pelo e-mail e senha.
// JOIN com regiao (para trazer a sigla) e com usuario_lenda + lenda (para trazer as Lendas).
// O GROUP_CONCAT junta as Lendas em um texto só: 'Hattori,Orion,Kor' (na ordem: main primeiro)
function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT u.id, u.nick, u.email, u.elo, r.sigla AS regiao,
            GROUP_CONCAT(l.nome ORDER BY ul.ordem) AS lendas,
            u.discord, u.mostrar_discord, u.horario, u.bio
        FROM usuario u
        JOIN regiao r ON r.id = u.fk_regiao
        JOIN usuario_lenda ul ON ul.fk_usuario = u.id
        JOIN lenda l ON l.id = ul.fk_lenda
        WHERE u.email = '${email}' AND u.senha = '${senha}'
        GROUP BY u.id, r.sigla;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
// O site manda a sigla da região ('BRZ'). O SELECT dentro do INSERT descobre o id dessa região.
function cadastrar(nick, email, senha, elo, regiao, discord, mostrarDiscord, horario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nick, email, senha, elo, regiao, discord, mostrarDiscord, horario);

    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO usuario (nick, email, senha, elo, fk_regiao, discord, mostrar_discord, horario)
        VALUES ('${nick}', '${email}', '${senha}', ${elo}, (SELECT id FROM regiao WHERE sigla = '${regiao}'), '${discord}', '${mostrarDiscord}', '${horario}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Grava as Lendas favoritas do jogador na tabela usuario_lenda.
// lendas chega como texto: 'Hattori,Orion,Kor'
// Vira uma linha para cada Lenda: (id do jogador, id da Lenda, ordem)
function cadastrarLendas(idUsuario, lendas) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrarLendas():", idUsuario, lendas);

    var listaLendas = lendas.split(',');
    var valores = [];

    for (var i = 0; i < listaLendas.length; i++) {
        // i + 1 é a ordem: a primeira Lenda escolhida é a 1 (main)
        valores.push(`(${idUsuario}, (SELECT id FROM lenda WHERE nome = '${listaLendas[i]}'), ${i + 1})`);
    }

    var instrucaoSql = `
        INSERT INTO usuario_lenda (fk_usuario, fk_lenda, ordem) VALUES ${valores.join(', ')};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Lista todos os jogadores, menos quem está logado (id <> idUsuario).
// Mesmos JOINs do autenticar. O CASE esconde o Discord de quem marcou para não mostrar.
function listar(idUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listar():", idUsuario);
    var instrucaoSql = `
        SELECT u.id, u.nick, u.elo, r.sigla AS regiao,
            GROUP_CONCAT(l.nome ORDER BY ul.ordem) AS lendas,
            CASE WHEN u.mostrar_discord = 'sim' THEN u.discord ELSE '' END AS discord,
            u.horario, u.bio
        FROM usuario u
        JOIN regiao r ON r.id = u.fk_regiao
        JOIN usuario_lenda ul ON ul.fk_usuario = u.id
        JOIN lenda l ON l.id = ul.fk_lenda
        WHERE u.id <> ${idUsuario}
        GROUP BY u.id, r.sigla;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Atualiza os dados do jogador (as Lendas são trocadas separadamente: deletarLendas + cadastrarLendas)
function editar(idUsuario, nick, email, elo, regiao, discord, mostrarDiscord, horario, bio) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function editar():", idUsuario, nick, email, elo, regiao, discord, mostrarDiscord, horario, bio);
    var instrucaoSql = `
        UPDATE usuario SET nick = '${nick}', email = '${email}', elo = ${elo},
            fk_regiao = (SELECT id FROM regiao WHERE sigla = '${regiao}'),
            discord = '${discord}', mostrar_discord = '${mostrarDiscord}', horario = '${horario}', bio = '${bio}'
        WHERE id = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Apaga as Lendas favoritas do jogador (usado ao editar e ao excluir a conta)
function deletarLendas(idUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function deletarLendas():", idUsuario);
    var instrucaoSql = `
        DELETE FROM usuario_lenda WHERE fk_usuario = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletar(idUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function deletar():", idUsuario);
    var instrucaoSql = `
        DELETE FROM usuario WHERE id = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    cadastrarLendas,
    listar,
    editar,
    deletarLendas,
    deletar
};
