const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 8080;
const helmet = require('helmet');

const startCU = require('./functions/custouniforme.js');
const startDM = require('./functions/distanciamanhattan.js');
const startHS = require('./functions/heuristicasimples.js');
const utils = require('./functions/utils.js');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
	next();
});

app.get('/puzzle-solver', (err, res) => {
    console.log('Acessou a função de resolução');

	res.status(200);
    let estadoFinal = [ 1, 2, 3, 4, 5, 6, 7, 8, 0 ];
    let parametros = res.req.query;

    if(!utils.verificarParametros(parametros)) {
        res.json({
            error: false,
            resultado: 'Por favor, selecione o algoritmo de resolução ou preencha todos os valores do puzzle',
        });
    } else {
        let estadoInicial = parametros.estadoInicial.map(function(e) {
            e = Number(e);
            return e;
        });
        let algoritmoSelecionado = Number(parametros.algoritmo);

        if(utils.hassAllValues(estadoInicial)) {
            let isPuzzleValid = utils.solvable(estadoInicial);
            if(isPuzzleValid) {

                let resultadoFinal = seletorDeAlgoritmo(algoritmoSelecionado, estadoInicial, estadoFinal);

                if(resultadoFinal.caminho === 'Extrapolou') {
                    res.json({
                        error: true,
                        resultado: "Limitação de processamento. Profundidade igual a 15. Por favor tente outra configuração de jogo"
                    });
                } else {
                    res.json({
                        error: false,
                        resultado: resultadoFinal.caminho,
                        nodosVisitados: resultadoFinal.nodosVisitados,
                        maiorFronteira: resultadoFinal.maiorFronteira,
                        tamanhoDoCaminho: resultadoFinal.tamanhoDoCaminho
                    });
                }
            } else {
                res.json({
                    error: true,
                    resultado: "Valores Iniciais para jogo dos 8 não resolvível. Por favor, insira um jogo válido.",
                });
            }
        } else {
            res.json({
                error: true,
                resultado: "Por favor, preencha todos os valores",
            });
        }
    }
    res.end();
});

server.listen(port, (err) => {
	if (err) {
		throw err;
	}
});

function seletorDeAlgoritmo(algoritmo, estadoInicial, estadoFinal) {
    let resultado = {
        caminho: '',
        nodosVisitados: 0,
        maiorFronteira: 0,
        tamanhoDoCaminho: 0
    };

    if(utils.arraysIguais(estadoInicial, estadoFinal)){
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

    while(!utils.arraysIguais(nodoObjetivo.estado, estadoFinal)) {
        let fronteiraSize = nodos.nodosAbertos.length > maiorFronteira ? nodos.nodosAbertos.length : maiorFronteira;
        maiorFronteira = fronteiraSize;
        if(isStart) {
            startRoute(nodo,nodos, algorithmType);
            isStart = false;
        } else if(nodos.nodosAbertos.length !== 0) {

            nodoObjetivo = nodos.nodosAbertos[0];
            nodos.nodosVisitados.push(nodoObjetivo);
            visitarNodo(nodoObjetivo, nodos, algorithmType);
            if(nodoObjetivo.caminho.length >= 15) {
                console.log(nodoObjetivo.caminho);
                nodoObjetivo.caminho = 'Extrapolou';
                nodoObjetivo.estado = estadoFinal;
            }
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
};

let organizarNodosAbertos = function (novosNodos, nodos) {
    nodos.nodosAbertos.splice(0,1);
    nodos.nodosAbertos.push(...novosNodos);
    nodos.nodosAbertos.sort(sortNodos);
};

let sortNodos = function (nodo1, nodo2) {
    return nodo1.func < nodo2.func ? -1 : nodo1.func > nodo2.func ? 1 : 0;
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

module.exports = server;