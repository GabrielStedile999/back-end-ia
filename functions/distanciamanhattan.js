const expandirNodo = require('./utils.js');

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

module.exports = startDM;