
const utils = require('./utils.js');

let startHS = function (nodo, nodos, emptyPos, adjacents) {
    let heuristica = wrongPosition(nodo);
    let custo = nodo.custo+1;
    let func = heuristica + custo;
    return utils.expandirNodo(nodo, emptyPos, adjacents, nodos, heuristica, custo, func);
};

let wrongPosition = function (nodo) {
    let numberOfWrongPositions = 0;
    let estadoNodo = nodo.estado;

    if(estadoNodo[0] !== 1) {
        numberOfWrongPositions ++;
    }
    if(estadoNodo[1] !== 2) {
        numberOfWrongPositions ++;
    }
    if(estadoNodo[2] !== 3) {
        numberOfWrongPositions ++;
    }
    if(estadoNodo[3] !== 4) {
        numberOfWrongPositions ++;
    }
    if(estadoNodo[4] !== 5) {
        numberOfWrongPositions ++;
    }
    if(estadoNodo[6] !== 7) {
        numberOfWrongPositions ++;
    }
    if(estadoNodo[7] !== 8) {
        numberOfWrongPositions ++;
    }
    if(estadoNodo[8] !== 0) {
        numberOfWrongPositions ++;
    }
    return numberOfWrongPositions;
};

module.exports = startHS;

