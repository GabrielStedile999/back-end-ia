const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const port = 3000;
const helmet = require('helmet');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
	next();
});

app.get('/custo-uniforme', (err, res) => {
	console.log('custo uniforme chamado');
	res.status(200);
	
	    let estadoFinal = [ 1, 2, 3, 4, 5, 6, 7, 8, 0 ];
        let estadoInicial = [ 1, 8, 2, 0, 4, 3, 7, 6, 5 ];
        let algoritmoSelecionado = 0;
	    let resultadoFinal = seletorDeAlgoritmo(algoritmoSelecionado, estadoInicial, estadoFinal);

    console.log('Resultado');
    console.log(resultadoFinal.caminho);

    res.json({ resultado: resultadoFinal.caminho });
	res.end();
});

server.listen(port, (err) => {
	if (err) {
		throw err;
	}
	/* eslint-disable no-console */
	console.log('Node Endpoints working :)');
});

function seletorDeAlgoritmo(algoritmo, estadoInicial, estadoFinal) {
    let resultado = {
        caminho: 'teste',
        nodosVisitados: 0,
        maiorFronteira: 0,
        tamanhoDoCaminho: 0
    };

    if(arraysIguais(estadoInicial, estadoFinal)){
        return resultado;
    }

    let nodoInicial = {
        estado: estadoInicial,
        caminho: '',
        heuristica: 0,
        custo: 0,
        func: 0
    };

    let nodos = {
        nodosAbertos : [],
        nodosVisitados: []
    };

    switch (algoritmo) {
        case 0 :
            startAlgorithm(nodoInicial, estadoFinal, nodos, resultado, 0);
            break;
        case 1 :
            startAlgorithm(nodoInicial, estadoFinal, nodos, resultado, 1);
            break;
        case 2 :
            startAlgorithm(nodoInicial, estadoFinal, nodos, resultado, 2);
    }

    return resultado;
}

function startAlgorithm(nodo, estadoFinal, nodos, resultado, algorithmType) {
    let nodoObjetivo = nodo;
    let isStart = true;
    let maiorFronteira = 0;
    while(!arraysIguais(nodoObjetivo.estado, estadoFinal)) {
        let fronteiraSize = nodos.nodosAbertos.length > maiorFronteira ? nodos.nodosAbertos.length : maiorFronteira;
        maiorFronteira = fronteiraSize;
        nodos.nodosAbertos.shift();
        if(isStart) {
            startRoute(nodo,nodos, algorithmType);
            isStart = false;
        } else if(nodos.nodosAbertos.length !== 0) {
            nodoObjetivo = nodos.nodosAbertos[0];
            visitarNodo(nodoObjetivo, nodos, algorithmType)
        } else {
            console.log("Sem fronteira");
            nodoObjetivo.estado = estadoFinal
        }
    }

    resultado.caminho = nodoObjetivo.caminho;
    resultado.nodosVisitados = nodos.nodosVisitados.length;
    resultado.maiorFronteira = maiorFronteira;
    resultado.tamanhoDoCaminho = nodoObjetivo.custo;
}

function startRoute(nodo, nodos, algorithmType) {
    let emptyPos = getPosicao(nodo.estado, 0);
    let adjacents = getAdjacentes(emptyPos);
    let novosNodos = [];
    switch (algorithmType) {
        case 0 :
            novosNodos = startCU(nodo, nodos, emptyPos, adjacents);
            break;
        case 1 :
            novosNodos = startHS(nodo, nodos, emptyPos, adjacents);
            break;
        case 2 :
            novosNodos = startDM(nodo, nodos, emptyPos, adjacents);
            break;
    }
    organizarNodosAbertos(novosNodos, nodos);
    nodos.nodosVisitados.push(nodo);
}

let startDM = function (nodo, nodos, emptyPos, adjacents) {
    let heuristica = manhattanDistance(nodo);
    let custo = nodo.custo+1;
    let func = heuristica + custo;
    return expandirNodo(nodo, emptyPos, adjacents, nodos, heuristica, custo, func);
};

let manhattanDistance = function (nodo) {
    let md = 0;
    let estadoNodo = nodo.estado;
    let umDeveriaEstar = verificarPosicao(1);
    let doisDeveriaEstar = verificarPosicao(2);
    let tresDeveriaEstar = verificarPosicao(3);
    let quatroDeveriaEstar = verificarPosicao(4);
    let cincoDeveriaEstar = verificarPosicao(5);
    let seisDeveriaEstar = verificarPosicao(6);
    let seteDeveriaEstar = verificarPosicao(7);
    let oitoDeveriaEstar = verificarPosicao(8);
    let zeroDeveriaEstar = verificarPosicao(0);

    estadoNodo.forEach((num, index) => {
        switch(num) {
            case 0:
                md += verificarPosicaoCalc(index, zeroDeveriaEstar);
                break;
            case 1:
                md += verificarPosicaoCalc(index, umDeveriaEstar);
                break;
            case 2:
                md += verificarPosicaoCalc(index, doisDeveriaEstar);
                break;
            case 3:
                md += verificarPosicaoCalc(index, tresDeveriaEstar);
                break;
            case 4:
                md += verificarPosicaoCalc(index, quatroDeveriaEstar);
                break;
            case 5:
                md += verificarPosicaoCalc(index, cincoDeveriaEstar);
                break;
            case 6:
                md += verificarPosicaoCalc(index, seisDeveriaEstar);
                break;
            case 7:
                md += verificarPosicaoCalc(index, seteDeveriaEstar);
                break;
            case 8:
                md += verificarPosicaoCalc(index, oitoDeveriaEstar);
                break;
        }
        }
    );

    return md;
};

let verificarPosicaoCalc = function (posicaoAtual, posicaoDestino) {
    switch (posicaoAtual) {
        case 0: return zeroTo(posicaoDestino);
        case 1: return oneTo(posicaoDestino);
        case 2: return twoTo(posicaoDestino);
        case 3: return threeTo(posicaoDestino);
        case 4: return fourTo(posicaoDestino);
        case 5: return fiveTo(posicaoDestino);
        case 6: return sixTo(posicaoDestino);
        case 7: return sevenTo(posicaoDestino);
        case 8: return eightTo(posicaoDestino);
    }
};

let startHS = function (nodo, nodos, emptyPos, adjacents) {
    let heuristica = wrongPosition(nodo);
    let custo = nodo.custo+1;
    let func = heuristica + custo;
    return expandirNodo(nodo, emptyPos, adjacents, nodos, heuristica, custo, func);
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

let startCU = function (nodo, nodos, emptyPos, adjacents) {
    let heuristica = nodo.heuristica;
    let custo = nodo.custo+1;
    let func = heuristica + custo;
    return expandirNodo(nodo, emptyPos, adjacents, nodos, heuristica, custo, func);
};

let visitarNodo = function (nodo, nodos, algorithmType) {
    let emptyPos = getPosicao(nodo.estado, 0);
    let adjacents = getAdjacentes(emptyPos);
    let novosNodos = [];

    switch (algorithmType) {
        case 0 :
            novosNodos = startCU(nodo, nodos, emptyPos, adjacents);
            break;
        case 1 :
            novosNodos = startHS(nodo, nodos, emptyPos, adjacents);
            break;
        case 2 :
            novosNodos = startDM(nodo, nodos, emptyPos, adjacents);
            break;
    }

    organizarNodosAbertos(novosNodos, nodos);
    nodos.nodosVisitados.push(nodo);
};

let organizarNodosAbertos = function (novosNodos, nodos) {
    nodos.nodosAbertos.push(...novosNodos);
    nodos.nodosAbertos.sort(sortNodos);
};

let sortNodos = function (nodo1, nodo2) {
    return nodo1.func < nodo2.func ? -1 : nodo1.func > nodo2.func ? 1 : 0;
};

let expandirNodo = function (nodo, emptyPos, adjacents, nodos, heuristica, custo, func) {
    let newNodos = [];
    adjacents.forEach(e => {
            let nodoState = Array.from(nodo.estado);
            moverPosicaoArray(nodoState, emptyPos, e);
            let caminho = nodo.caminho + e.direcao;

            let nodoNovo = criarNodo(nodoState, caminho, heuristica, custo, func);

            let isVisitado = verificarNodoFechados(nodoNovo.estado, nodos);

            if(!isVisitado) {
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
    let exist = false;
    nodos.nodosVisitados.every(e => {
        if(arraysIguais(e.estado, estado)) {
            exist = true;
        }
    });
    return exist;
};

let getAdjacentes = function (position) {
    switch (position) {
        case 0: return [
            {posicao:1, direcao: 'D'},
            {posicao:3, direcao: 'B'}];
        case 1: return [
            {posicao:0, direcao: 'E'},
            {posicao:4, direcao: 'B'},
            {posicao:2, direcao: 'D'}];
        case 2: return [
            {posicao:1, direcao: 'E'},
            {posicao:5, direcao: 'B'}];
        case 3: return [
            {posicao:0, direcao: 'C'},
            {posicao:4, direcao: 'D'},
            {posicao:6, direcao: 'B'}];
        case 4: return [
            {posicao:1, direcao: 'C'},
            {posicao:3, direcao: 'E'},
            {posicao:5, direcao: 'D'},
            {posicao:7, direcao: 'B'}];
        case 5: return [
            {posicao:2, direcao: 'C'},
            {posicao:4, direcao: 'E'},
            {posicao:8, direcao: 'B'}];
        case 6: return [
            {posicao:3, direcao: 'C'},
            {posicao:7, direcao: 'D'}];
        case 7: return [
            {posicao:4, direcao: 'C'},
            {posicao:6, direcao: 'E'},
            {posicao:8, direcao: 'D'}];
        case 8: return [
            {posicao:5, direcao: 'C'},
            {posicao:7, direcao: 'E'}];
        default: return [];
    }
};

let getPosicao = function (array, position) {
    return array.indexOf(position);
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
    let i = a.length;
    if (i !== b.length) return false;
    while (i--) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

/* Manhattan Distance */
function verificarPosicao(number) {
    switch (number) {
        case 0 : return 8;
        case 1 : return 0;
        case 2 : return 1;
        case 3 : return 2;
        case 4 : return 3;
        case 5 : return 4;
        case 6 : return 5;
        case 7 : return 6;
        case 8 : return 7;
    }
}

function zeroTo(toPosition) {
    switch (toPosition) {
        case 0 : return 0;
        case 1 : return 1;
        case 2 : return 2;
        case 3 : return 1;
        case 4 : return 2;
        case 5 : return 3;
        case 6 : return 2;
        case 7 : return 3;
        case 8 : return 4;
    }
}

function oneTo(toPosition) {
    switch (toPosition) {
        case 0 : return 1;
        case 1 : return 0;
        case 2 : return 1;
        case 3 : return 2;
        case 4 : return 1;
        case 5 : return 2;
        case 6 : return 3;
        case 7 : return 2;
        case 8 : return 3;
    }
}

function twoTo(toPosition) {
    switch (toPosition) {
        case 0 : return 2;
        case 1 : return 1;
        case 2 : return 0;
        case 3 : return 3;
        case 4 : return 2;
        case 5 : return 1;
        case 6 : return 4;
        case 7 : return 3;
        case 8 : return 2;
    }
}

function threeTo(toPosition) {
    switch (toPosition) {
        case 0 : return 1;
        case 1 : return 2;
        case 2 : return 3;
        case 3 : return 0;
        case 4 : return 1;
        case 5 : return 2;
        case 6 : return 1;
        case 7 : return 2;
        case 8 : return 3;
    }
}

function fourTo(toPosition) {
    switch (toPosition) {
        case 0 : return 2;
        case 1 : return 1;
        case 2 : return 2;
        case 3 : return 1;
        case 4 : return 0;
        case 5 : return 1;
        case 6 : return 2;
        case 7 : return 1;
        case 8 : return 2;
    }
}

function fiveTo(toPosition) {
    switch (toPosition) {
        case 0 : return 3;
        case 1 : return 2;
        case 2 : return 1;
        case 3 : return 2;
        case 4 : return 1;
        case 5 : return 0;
        case 6 : return 3;
        case 7 : return 2;
        case 8 : return 1;
    }
}

function sixTo(toPosition) {
    switch (toPosition) {
        case 0 : return 2;
        case 1 : return 3;
        case 2 : return 4;
        case 3 : return 1;
        case 4 : return 2;
        case 5 : return 3;
        case 6 : return 0;
        case 7 : return 1;
        case 8 : return 2;
    }
}

function sevenTo(toPosition) {
    switch (toPosition) {
        case 0 : return 3;
        case 1 : return 2;
        case 2 : return 3;
        case 3 : return 2;
        case 4 : return 1;
        case 5 : return 2;
        case 6 : return 1;
        case 7 : return 0;
        case 8 : return 1;
    }
}

function eightTo(toPosition) {
    switch (toPosition) {
        case 0 : return 4;
        case 1 : return 3;
        case 2 : return 2;
        case 3 : return 3;
        case 4 : return 2;
        case 5 : return 1;
        case 6 : return 2;
        case 7 : return 1;
        case 8 : return 0;
    }
}

module.exports = server;

