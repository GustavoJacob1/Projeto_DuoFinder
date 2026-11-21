// Funções usadas em várias páginas do DuoFinder.
// Cada página carrega este arquivo com <script src="js/duofinder.js"></script>,
// igual ao js/lendas.js. Assim a regra fica escrita num lugar só.

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
