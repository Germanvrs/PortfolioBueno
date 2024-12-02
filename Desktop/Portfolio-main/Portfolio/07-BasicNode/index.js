import fs from 'fs/promises';
import sw from 'star-wars-quotes';
import superheroes from 'superheroes';
import supervillains from 'supervillains';

console.log('Hello, world!');

const quote = sw();
console.log(quote);

const allHeroes = superheroes.all;
const randomHero = allHeroes[Math.floor(Math.random() * allHeroes.length)];

const allVillains = supervillains.all;
const randomVillain = allVillains[Math.floor(Math.random() * allVillains.length)];

console.log(`In this epic battle, ${randomHero} fights against ${randomVillain}!`);

async function readSecretFile() {
  try {
    const data = await fs.readFile('data/input.txt', 'utf-8');
    console.log(data);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

readSecretFile();
