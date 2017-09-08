let fs = require('fs');

function readCmudictFile(file) {
  return fs.readFileSync(file).toString();
}

let cmudictFile = readCmudictFile('./cmudict.txt');
let syllablesObj = {}; // keys => syllable count, value => array of words matching syllable count

function formatData(data) {
  let lines = data.toString().split('\n');
  let lineSplit;

  lines.forEach(function (line) {
    lineSplit = line.split('  ');
    let numOfSyllables = 0;

    if (lineSplit[1]) {
      numOfSyllables = lineSplit[1].match(/\d/g);
    }
    if (numOfSyllables) {
      numOfSyllables = numOfSyllables.length;
    }
    
    if (syllablesObj[numOfSyllables]) {
      syllablesObj[numOfSyllables].push(lineSplit[0]);
    } else {
      syllablesObj[numOfSyllables] = [];
    }
  });
}

formatData(cmudictFile);

function createHaiku(structure) {
  let haiku = '';
  let haikuForm = [5, 7, 5];

  structure.forEach(function (syllableArr, idx) {
    // Make sure the each syllableArr element total matches haiku form (5, 7, 5)
    if (syllableArr.reduce((prev, curr) => prev + curr) !== haikuForm[idx]) {
      throw 'Please enter syllable values that match haiku form of (5, 7, 5)'
    }

    let line = '';
    // Loops through whole syllableArr to get a word that matches each syllable count for each line
    for (let i = 0; i < syllableArr.length; i++) {
      let syllablesObjKeyValue = syllablesObj[syllableArr[i]]; // => array: words with n syllables
      let randomWordIndex = Math.round(Math.random() * syllablesObjKeyValue.length);
      let word = syllablesObjKeyValue[randomWordIndex];
      // trims '(n)' from word if it has more than one form of pronunciation
      if(word.indexOf('(') >= 0) {
        word = word.slice(0, word.indexOf('('));
      }
      line += word + ' ';
    }

    haiku += line + '\n';
  });

  return haiku;
}

module.exports = {
  createHaiku: createHaiku,
};
