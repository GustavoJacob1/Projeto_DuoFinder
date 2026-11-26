// Funções usadas em várias páginas do DuoFinder.
// Cada página carrega este arquivo com <script src="js/duofinder.js"></script>,
// igual ao js/lendas.js. Assim a regra fica escrita num lugar só.

// Botão "Sair": apaga os dados de quem estava logado e volta para a página inicial
function sair() {
    localStorage.clear();
    window.location = 'index.html';
}

// Guarda o nome da divisão calculada por calcularDivisao
let divisao = '';

// Descobre a divisão pelo Elo e guarda o resultado na variável divisao
function calcularDivisao(elo) {
    if (elo >= 2000) {
        divisao = 'Diamante';
    } else if (elo >= 1680) {
        divisao = 'Platina';
    } else if (elo >= 1390) {
        divisao = 'Ouro';
    } else if (elo >= 1130) {
        divisao = 'Prata';
    } else if (elo >= 910) {
        divisao = 'Bronze';
    } else {
        divisao = 'Tin';
    }
}

// Calcula o quanto um jogador combina com o usuário logado.
// Começa em 92%, perde 1 ponto a cada 10 de diferença de Elo, ganha 2 por Lenda em comum,
// ganha 2 se joga no mesmo horário e perde 8 se for de outra região.
// O resultado fica guardado no próprio jogador (jogador.compatibilidade).
// Usa as variáveis meuElo, minhasLendas, meuHorario e minhaRegiao,
// que cada página cria no começo do seu <script> a partir do localStorage.
function calcularCompatibilidade(jogador) {
    let diferenca = jogador.elo - meuElo;

    if (diferenca < 0) {
        diferenca = diferenca * -1;
    }

    let pontos = 92 - diferenca / 10;

    for (let i = 0; i < jogador.lendas.length; i++) {
        if (minhasLendas.includes(jogador.lendas[i])) {
            pontos = pontos + 2;
        }
    }

    if (jogador.horario == meuHorario) {
        pontos = pontos + 2;
    }

    if (jogador.regiao != minhaRegiao) {
        pontos = pontos - 8;
    }

    if (pontos > 99) {
        pontos = 99;
    } else if (pontos < 10) {
        pontos = 10;
    }

    jogador.compatibilidade = Number(pontos.toFixed(0));
}
