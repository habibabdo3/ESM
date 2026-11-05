import { readFileSync } from 'node:fs';
for (const f of process.argv.slice(2)) {
  for (const e of JSON.parse(readFileSync(f, 'utf8'))) {
    const t = [...e.title].length, d = [...e.description].length;
    const flag = t > 60 || d < 140 || d > 155 ? '  <<<' : '';
    console.log(`${e.id.padEnd(45)} t=${t} d=${d}${flag}`);
  }
}
