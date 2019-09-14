const utils = require('./utils.js');

let startCU = function (nodo, nodos, emptyPos, adjacents) {
    let heuristica = nodo.heuristica;
    let custo = nodo.custo+1;
    let func = heuristica + custo;
    let resultado = utils.expandirNodo(nodo, emptyPos, adjacents, nodos, heuristica, custo, func);
    return resultado;
};

module.exports = startCU;
