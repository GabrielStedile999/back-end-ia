
let expandirNodo = function (nodo, emptyPos, adjacents, nodos, heuristica, custo, func) {
    let newNodos = [];
    let allNewNodos = [];
    adjacents.forEach(e => {
            let nodoState = Array.from(nodo.estado);
            moverPosicaoArray(nodoState, emptyPos, e);
            let caminho = nodo.caminho + e.direcao;

            let nodoNovo = criarNodo(nodoState, caminho, heuristica, custo, func);

            let isVisitado = verificarNodoFechados(nodoNovo.estado, nodos.nodosVisitados);
            let isEqualNew = verificarNodoFechados(nodoNovo.estado, allNewNodos);
            allNewNodos.push(nodoNovo);
            if(!isVisitado && !isEqualNew) {
                newNodos.push(nodoNovo);
            }
        }
    );
    return newNodos;
};

let moverPosicaoArray = function (arr, fromIndex, adjacente) {
    let fromValueTemp = arr[fromIndex];

    arr[fromIndex] = arr[adjacente.posicao];
    arr[adjacente.posicao] = fromValueTemp;
};

let verificarNodoFechados = function (estado, nodos) {
    nodos.every(e => {
        if(arraysIguais(e.estado, estado)) {
            return true;
        }
    });
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


module.exports = {
    arraysIguais: arraysIguais,
    expandirNodo: expandirNodo
};