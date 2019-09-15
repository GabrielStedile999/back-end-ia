const fastSort = require('fast-sort');

let add = function (array, item, index) {
    array[index] = item;
};

let push = function (array, item) {
    array[array.length] = item;
};

let pushAll = function (array, items) {
    for (let i=0; i !== items.length ; i++) {
        push(array, items[i])
    }
};

let shift = function (array) {
    array.shift();
};

let indexOf = function (array, item) {
    for (let i=0; i !== array.length ; i++) {
        if (array[i] === item) { return i }
    }
    return -1;
};

let clonarArray = function (original) {
    let clone = new Array(9);
    for (let i=0; i !== original.length ; i++) {
        add(clone, original[i], i);
    }
    return clone;
};

let spliceOne = function(array, index) {
    let len=array.length;
    if (!len) { return }
    while (index<len) {
        array[index] = array[index+1]; index++ }
    array.length--;
};

let arraySortedInsert = function(array) {
    fastSort(array).asc(i => i.func);
};

module.exports = {
    push: push,
    shift: shift,
    indexOf: indexOf,
    clonarArray: clonarArray,
    add: add,
    spliceOne: spliceOne,
    pushAll: pushAll,
    arraySortedInsert: arraySortedInsert
};