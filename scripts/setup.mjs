// scripts/setup.mjs
import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log('🚀 Project Lobby Template Setup\n');
  
  const name = await ask('Your name: ');
  const title = await ask('Job title: ');
  const color = await ask('Primary accent color (hex, e.g. #3b82f6): ');

  const config = JSON.parse(fs.readFileSync('./content/lobby.json', 'utf8'));
  config.profile.name = name;
  config.profile.jobTitle = title;
  config.theme.primary = color;

  fs.writeFileSync('./content/lobby.json', JSON.stringify(config, null, 2));
  
  console.log('\n✅ lobby.json updated! Run npm run dev to see changes.');
  rl.close();
}

setup();
