const aUtils = require('./arrayFunctions');

let expandirNodo = function (nodo, emptyPos, adjacents, nodos, heuristica, custo, func) {
    let newNodos = [];
    let allNewNodos = [];

    for (let i=0; i !== adjacents.length ; i++) {
        let nodoState = aUtils.clonarArray(nodo.estado);
        moverPosicaoArray(nodoState, emptyPos, adjacents[i]);
        let caminho = nodo.caminho + adjacents[i].direcao;
        let nodoNovo = criarNodo(nodoState, caminho, heuristica, custo, func);
        let isVisitado = verificarNodoFechados(nodoNovo.estado, nodos.nodosVisitados);
        let isEqualNew = verificarNodoFechados(nodoNovo.estado, allNewNodos);
        let isAberto = verificarNodoFechados(nodoNovo.estado, nodos.nodosAbertos);
        aUtils.add(allNewNodos,nodoNovo, i);
        if(!isVisitado && !isEqualNew && !isAberto) {
            aUtils.push(newNodos, nodoNovo);
        }
    }
    return newNodos;
};

let moverPosicaoArray = function (array, fromIndex, adjacente) {
    let fromValueTemp = array[fromIndex];

    array[fromIndex] = array[adjacente.posicao];
    array[adjacente.posicao] = fromValueTemp;
};

let verificarNodoFechados = function (estado, nodos) {
    for (let i=0; i !== nodos.length ; i++) {
        if(arraysIguais(nodos[i].estado, estado)) {
            return true;
        }
    }
    return false;
};

let criarNodo = function (estado, caminho, heuristica, custo, func) {
    return {
        estado,
        caminho,
        heuristica,
        custo,
        func
    }
};

let arraysIguais = function (a, b) {
    return JSON.stringify(a) === JSON.stringify(b)
};

let hassAllValues = function (array) {
    let result = true;

    if(array.length !== 9) {
        return false;
    }

    for (let i = 0, l = array.length; i < l; i++) {
        let item = array[i];
        if(item === '' || item === null) {
            result = false;
        }
    }

    return result;
};

let verificarParametros = function (parametros) {
    let isValid = true;
    let estadoInicial = parametros.estadoInicial;
    let algoritmo = parametros.algoritmo;

    if(estadoInicial === null || estadoInicial === undefined) {
        isValid = false
    } else {
        for (let i = 0; i <  estadoInicial.length; i++) {
            if(estadoInicial[i] === "") {
                isValid = false;
            }
        }
    }

    if(algoritmo === null || algoritmo === undefined || algoritmo === "") {
        isValid = false;
    }
    return isValid;
};

let solvable = function (list) {
    let values = removeEspacoVazio(list);
    let count = 0;
    for( let i=0;i<values.length-1;i++){
        for(let j=i+1;j<values.length;j++){
            if(values[i]>values[j]){
                count++;
            }
        }

    }

    if(count%2 === 0){
        return true;
    }else{
        return false;
    }
};

let removeEspacoVazio = function (array) {
    let result = [];

    for( let i=0;i<array.length;i++){
        let item = array[i];
        if(item !== 0) {
            aUtils.push(result, item)
        }
    }
    return result;
};

module.exports = {
    arraysIguais: arraysIguais,
    expandirNodo: expandirNodo,
    hassAllValues: hassAllValues,
    solvable: solvable,
    verificarParametros: verificarParametros
};