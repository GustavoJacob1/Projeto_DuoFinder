var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        res.json({
                            id: resultadoAutenticar[0].id,
                            email: resultadoAutenticar[0].email,
                            nick: resultadoAutenticar[0].nick,
                            elo: resultadoAutenticar[0].elo,
                            regiao: resultadoAutenticar[0].regiao,
                            lendas: resultadoAutenticar[0].lendas,
                            discord: resultadoAutenticar[0].discord,
                            mostrarDiscord: resultadoAutenticar[0].mostrar_discord,
                            horario: resultadoAutenticar[0].horario,
                            bio: resultadoAutenticar[0].bio
                        });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nick = req.body.nickServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var elo = req.body.eloServer;
    var regiao = req.body.regiaoServer;
    var lendas = req.body.lendasServer;
    var discord = req.body.discordServer;
    var mostrarDiscord = req.body.mostrarDiscordServer;
    var horario = req.body.horarioServer;

    // Faça as validações dos valores
    if (nick == undefined) {
        res.status(400).send("Seu nick está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (elo == undefined) {
        res.status(400).send("Seu elo está undefined!");
    } else if (regiao == undefined) {
        res.status(400).send("Sua região está undefined!");
    } else if (lendas == undefined) {
        res.status(400).send("Suas lendas estão undefined!");
    } else if (discord == undefined) {
        res.status(400).send("Seu discord está undefined!");
    } else if (mostrarDiscord == undefined) {
        res.status(400).send("A opção de mostrar o discord está undefined!");
    } else if (horario == undefined) {
        res.status(400).send("Seu horário está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        // 1º grava o jogador na tabela usuario
        usuarioModel.cadastrar(nick, email, senha, elo, regiao, discord, mostrarDiscord, horario)
            .then(
                function (resultado) {
                    // resultado.insertId = id que o banco acabou de gerar para o novo jogador
                    // 2º grava as Lendas dele na tabela usuario_lenda
                    return usuarioModel.cadastrarLendas(resultado.insertId, lendas);
                }
            ).then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function listar(req, res) {
    var idUsuario = req.params.idUsuario;

    usuarioModel.listar(idUsuario)
        .then(
            function (resultado) {
                res.status(200).json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao listar os jogadores: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function editar(req, res) {
    var idUsuario = req.params.idUsuario;
    var nick = req.body.nickServer;
    var email = req.body.emailServer;
    var elo = req.body.eloServer;
    var regiao = req.body.regiaoServer;
    var lendas = req.body.lendasServer;
    var discord = req.body.discordServer;
    var mostrarDiscord = req.body.mostrarDiscordServer;
    var horario = req.body.horarioServer;
    var bio = req.body.bioServer;

    if (nick == undefined) {
        res.status(400).send("Seu nick está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (elo == undefined) {
        res.status(400).send("Seu elo está undefined!");
    } else if (regiao == undefined) {
        res.status(400).send("Sua região está undefined!");
    } else if (lendas == undefined) {
        res.status(400).send("Suas lendas estão undefined!");
    } else if (discord == undefined) {
        res.status(400).send("Seu discord está undefined!");
    } else if (mostrarDiscord == undefined) {
        res.status(400).send("A opção de mostrar o discord está undefined!");
    } else if (horario == undefined) {
        res.status(400).send("Seu horário está undefined!");
    } else if (bio == undefined) {
        res.status(400).send("Sua bio está undefined!");
    } else {

        // 1º atualiza os dados na tabela usuario
        usuarioModel.editar(idUsuario, nick, email, elo, regiao, discord, mostrarDiscord, horario, bio)
            .then(
                function () {
                    // 2º apaga as Lendas antigas do jogador
                    return usuarioModel.deletarLendas(idUsuario);
                }
            ).then(
                function () {
                    // 3º grava as Lendas novas
                    return usuarioModel.cadastrarLendas(idUsuario, lendas);
                }
            ).then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("Houve um erro ao editar o perfil: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function deletar(req, res) {
    var idUsuario = req.params.idUsuario;

    // 1º apaga as Lendas do jogador (a FOREIGN KEY não deixa apagar o jogador antes)
    usuarioModel.deletarLendas(idUsuario)
        .then(
            function () {
                // 2º apaga o jogador
                return usuarioModel.deletar(idUsuario);
            }
        ).then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao deletar a conta: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
    autenticar,
    cadastrar,
    listar,
    editar,
    deletar
}
