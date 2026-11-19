var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

// Lista os outros jogadores (todos menos quem está logado). Usado na busca, no dashboard e no perfil
router.get("/listar/:idUsuario", function (req, res) {
    usuarioController.listar(req, res);
});

// Atualiza os dados do jogador logado (página Meu perfil)
router.put("/editar/:idUsuario", function (req, res) {
    usuarioController.editar(req, res);
});

// Exclui a conta do jogador logado (página Meu perfil)
router.delete("/deletar/:idUsuario", function (req, res) {
    usuarioController.deletar(req, res);
});

module.exports = router;