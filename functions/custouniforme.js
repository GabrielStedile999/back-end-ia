const utils = require('./utils.js');

let startCU = function (nodo, nodos, emptyPos, adjacents) {
    let heuristica = nodo.heuristica;
    let custo = nodo.custo+1;
    let func = heuristica + custo;
    return utils.expandirNodo(nodo, emptyPos, adjacents, nodos, heuristica, custo, func);
};

module.exports = startCU;
