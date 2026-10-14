// npm run check — roda a suíte e mostra o PLACAR por desafio (A1…F1d).
// Não revela gabarito: só diz o que está verde, vermelho ("falta") ou sem asserção.
//
// "Verde" só conta se o teste NÃO tem mais a linha falta(...) e tem expect de verdade.
import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync, existsSync } from 'node:fs';

const OUT = 'check-results.json';
const win = process.platform === 'win32';

const run = spawnSync('npx', ['playwright', 'test', '--project=chromium', '--reporter=json'], {
  encoding: 'utf8',
  env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: OUT },
  shell: win,
});

let report;
try {
  report = JSON.parse(readFileSync(OUT, 'utf8'));
} catch {
  console.error('Não consegui ler o resultado. Rode `npm run test:e2e` pra ver o erro de verdade.');
  console.error('Se aparecer "webServer was not able to start": rode `npm run build` sozinho — o erro real aparece lá.');
  console.error((run.stderr || '').split('\n').slice(-12).join('\n'));
  process.exit(1);
} finally {
  rmSync(OUT, { force: true });
}

const BLOCOS = {
  A: 'Locators',
  B: 'Expect e espera',
  C: 'Mock de rede',
  D: 'Conta, Page Object, fixtures',
  E: 'SPA, PWA e offline',
  F: 'Teste instável (flaky)',
};

// Bloco F: um teste instável pode passar "por sorte". Só conta como consertado se o
// arquivo não tem mais os defeitos (sleep fixo e contagem fora do expect).
const flakyFile = 'tests/desafios/06-flaky-cacada.spec.ts';
const flakySrc = existsSync(flakyFile) ? readFileSync(flakyFile, 'utf8').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n') : '';
const flakyDefeitos = [];
if (/waitForTimeout\(/.test(flakySrc)) flakyDefeitos.push('ainda tem waitForTimeout (sleep fixo)');
if (/\.count\(\)/.test(flakySrc)) flakyDefeitos.push('ainda usa .count() (troque por toHaveCount)');

const rows = [];
let livre = { ok: 0, total: 0 };
const walk = (suite) => {
  for (const s of suite.suites ?? []) walk(s);
  for (const spec of suite.specs ?? []) {
    const ok = spec.tests.every((t) => t.status === 'expected');
    const err = spec.tests.flatMap((t) => t.results ?? []).flatMap((r) => r.errors ?? []).map((e) => e.message ?? '').join(' ');
    const m = spec.title.match(/^([A-F])(\d)([a-z]?)\./);
    if (m) {
      const id = `${m[1]}${m[2]}${m[3]}`;
      const controle = id === 'F1c'; // teste que já está certo: serve de comparação, não conta
      const ok2 = m[1] === 'F' && !controle && id !== 'F1d' ? ok && flakyDefeitos.length === 0 : ok;
      rows.push({ id, bloco: m[1], title: spec.title, ok: ok2, falta: /ainda não feito/.test(err), controle, defeito: m[1] === 'F' && ok && !ok2 });
    }
    else if (/livre/.test(spec.file)) {
      livre.total++;
      if (ok && !/ainda não feito/.test(err)) livre.ok++;
    }
  }
};
report.suites.forEach(walk);

for (const b of Object.keys(BLOCOS)) {
  const mine = rows.filter((r) => r.bloco === b).sort((x, y) => x.id.localeCompare(y.id));
  if (!mine.length) continue;
  const counted = mine.filter((r) => !r.controle);
  const green = counted.filter((r) => r.ok).length;
  console.log(`\n${green === counted.length ? '✓' : '✗'} Bloco ${b} — ${BLOCOS[b]}: ${green}/${counted.length}`);
  for (const r of mine) {
    const icon = r.controle ? '·' : r.ok ? '✓' : r.falta ? '⬜' : r.defeito ? '🐛' : '✗';
    const hint = r.controle ? '  (controle: já está certo, serve de comparação)'
      : r.ok ? ''
      : r.defeito ? `  ← passou, mas o arquivo ainda tem defeito: ${flakyDefeitos.join(' e ')}`
      : r.falta ? '  ← ainda não feito (apague o falta() quando escrever)'
      : '  ← escrito, mas falhando (rode só ele e leia o erro)';
    console.log(`   ${icon} ${r.id}${hint}`);
  }
}

console.log(`\n${livre.ok === 3 ? '✓' : '✗'} Missão livre: ${livre.ok}/3 testes verdes (feliz · negativo · borda)`);

// Testes que passam "vazios" não contam: cruza com o lint (playwright/expect-expect).
const lint = spawnSync('npx', ['eslint', 'tests', '--format', 'json'], { encoding: 'utf8', shell: win });
let semExpect = 0;
let lintErros = 0;
try {
  for (const f of JSON.parse(lint.stdout))
    for (const m of f.messages) {
      if (m.ruleId === 'playwright/expect-expect') semExpect++;
      else if (m.severity === 2) lintErros++;
    }
} catch {
  /* sem lint: segue só com o resultado do Playwright */
}

const contados = rows.filter((r) => !r.controle);
const total = contados.length;
const verdes = contados.filter((r) => r.ok).length;
console.log(`\nDesafios dos blocos A–F verdes: ${verdes}/${total}`);
if (verdes < total) console.log('Avisos de lint ficam para o fim: enquanto houver ⬜ é normal ter teste sem expect. Quando tudo estiver ✓, rode npm run lint.');
else {
  if (semExpect) console.log(`⚠ ${semExpect} teste(s) sem nenhum expect (passam "vazios" e NÃO contam) — rode npm run lint`);
  if (lintErros) console.log(`⚠ ${lintErros} erro(s) de lint (await faltando, sleep fixo…) — rode npm run lint`);
}
console.log('Próximo passo quando tudo ✓: preencha o RESPOSTAS.md, rode 3x seguidas (npm run test:e2e) e abra o PR.');
