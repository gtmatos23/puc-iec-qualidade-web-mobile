// Validator — Lab Playwright PWA · 10 pts
// Rubrica: enunciado.md deste lab. Nota AUTOMÁTICA = PISO (estrutural, parse-only —
// nunca executa código do aluno). Critérios manual:true (missão livre, respostas) entram no Canvas.
//
// Cada desafio é "feito" quando o corpo do teste (sem comentários):
//   · não tem mais a linha falta(...)
//   · contém TODOS os padrões da técnica que o desafio ensina
//   · não contém os padrões proibidos (ex.: data-testid no A2, waitForTimeout no F)

import * as fs from 'fs'
import * as path from 'path'
import { Criterion, GradeResult, computeAuto, computeScore, buildBreakdowns } from './lib/compute-score'

const args = process.argv.slice(2)
const entregaIdx = args.indexOf('--entrega')
const entregaPath = path.resolve(entregaIdx >= 0 ? args[entregaIdx + 1] : '.')
const praticaDir = path.join(entregaPath, 'pratica')
const testsDir = path.join(praticaDir, 'tests')

function read(rel: string): string | null {
  const p = path.join(testsDir, rel)
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null
}

/** Remove comentários de linha e de bloco — não deixa dica/TODO "casar" padrão. */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n')
}

/** Corpo do teste cujo título começa com `${id}.` (casamento de chaves a partir de "=> {"). */
function testBody(src: string, id: string): string | null {
  const re = new RegExp(`(?:test|base)\\(\\s*(['"\`])${id}\\.`)
  const m = re.exec(src)
  if (!m) return null
  const arrow = src.indexOf('=> {', m.index)
  if (arrow < 0) return null
  let depth = 0
  for (let i = arrow + 3; i < src.length; i++) {
    if (src[i] === '{') depth++
    else if (src[i] === '}') {
      depth--
      if (depth === 0) return stripComments(src.slice(arrow + 3, i + 1))
    }
  }
  return null
}

interface Rule { id: string; file: string; need: [RegExp, string][]; forbid?: [RegExp, string][] }

const FALTA = /\bfalta\s*\(/

function checkRule(r: Rule): { ok: boolean; why?: string } {
  const src = read(r.file)
  if (src === null) return { ok: false, why: `arquivo ${r.file} não encontrado` }
  const body = testBody(src, r.id)
  if (body === null) return { ok: false, why: 'teste não encontrado (título alterado/apagado?)' }
  if (FALTA.test(body)) return { ok: false, why: 'ainda tem falta(...)' }
  const missing = r.need.filter(([re]) => !re.test(body)).map(([, w]) => w)
  const bad = (r.forbid ?? []).filter(([re]) => re.test(body)).map(([, w]) => w)
  const notes = [...(missing.length ? [`falta: ${missing.join(', ')}`] : []), ...(bad.length ? [`proibido: ${bad.join(', ')}`] : [])]
  return notes.length ? { ok: false, why: notes.join(' · ') } : { ok: true }
}

const A = 'desafios/01-locators.spec.ts'
const B = 'desafios/02-expect-espera.spec.ts'
const C = 'desafios/03-mock-rede.spec.ts'
const D = 'desafios/04-fixtures-pom.spec.ts'
const E = 'desafios/05-spa-pwa-offline.spec.ts'
const F = 'desafios/06-flaky-cacada.spec.ts'

const RULES: Record<string, Rule[]> = {
  locators: [
    { id: 'A1', file: A, need: [[/getByRole\(\s*['"]button['"]/, 'getByRole button'], [/toHaveURL\(/, 'toHaveURL']] },
    { id: 'A2', file: A,
      need: [[/getByLabel\(/, 'getByLabel'], [/getByRole\(/, 'getByRole'], [/waitForURL\(/, 'waitForURL'], [/logout-button/, 'prova do login (logout-button)'], [/expect\(/, 'expect']],
      forbid: [[/login-(email|password)-input|login-submit-button/, 'data-testid do login']] },
    { id: 'A3', file: A,
      need: [[/\.filter\(\s*\{\s*hasText/, 'filter({ hasText })'], [/Favoritar/, 'botão Favoritar'], [/aria-pressed/, 'aria-pressed'], [/1 filme favorito/, 'texto "1 filme favorito"']],
      forbid: [[/movie-card-heart-\d+/, 'id fixo de filme']] },
  ],
  expect: [
    { id: 'B1', file: B, need: [[/toHaveCount\(\s*12\s*\)/, '12'], [/toHaveCount\(\s*24\s*\)/, '24'], [/toHaveCount\(\s*36\s*\)/, '36'], [/toBeHidden\(|not\.toBeVisible\(|toHaveCount\(\s*0\s*\)/, 'botão some']] },
    { id: 'B2', file: B, need: [[/pressSequentially\(/, 'pressSequentially'], [/\[data-testid\^=/, 'seletor por prefixo'], [/toHaveValue\(/, 'toHaveValue'], [/search-clear-button/, 'Limpar'], [/search-empty/, 'estado vazio']] },
    { id: 'B3', file: B, need: [[/expect\s*\.\s*poll\s*\(/, 'expect.poll'], [/cinefav-favorites/, 'chave do localStorage'], [/\.reload\(/, 'reload'], [/expect\s*\.\s*soft\s*\(/, 'expect.soft'], [/aria-pressed/, 'aria-pressed']] },
  ],
  mock: [
    { id: 'C1', file: C, need: [[/toHaveCount\(\s*1\s*\)/, '1 card'], [/Filme do Mock/, 'título do mock'], [/expect\(/, 'expect']] },
    { id: 'C2', file: C, need: [[/status:\s*500/, 'status 500'], [/movielist-error/, 'estado de erro'], [/unroute\(/, 'unroute'], [/movielist-retry-button/, 'Tentar de novo'], [/toHaveCount\(\s*12\s*\)/, '12 cards depois']] },
    { id: 'C3', file: C, need: [[/route\.fetch\(/, 'route.fetch()'], [/\.json\(\)/, 'ler o JSON'], [/fulfill\(\s*\{[\s\S]*response/, 'fulfill({ response, json })'], [/toUpperCase\(|MATRIX/, 'maiúsculas'], [/toHaveCount\(\s*3\s*\)/, '3 cards']] },
    { id: 'C4', file: C, need: [[/page\.on\(\s*['"]request['"]/, "page.on('request')"], [/pressSequentially\(/, 'pressSequentially'], [/search-result-603/, 'espera o resultado'], [/toBe\(\s*1\s*\)/, 'contador === 1']] },
  ],
  fixtures: [
    { id: 'D1', file: D, need: [[/auth-mode-toggle/, 'alternar p/ cadastro'], [/register-submit-button/, 'enviar cadastro'], [/Date\.now\(\)/, 'e-mail único'], [/logout-button/, 'sair/entrar'], [/login-error-message/, 'caso negativo'], [/toHaveURL\(|waitForURL\(/, 'checa URL']] },
    { id: 'D2', file: D, need: [[/new CatalogPage\(/, 'new CatalogPage'], [/\.favorite\(/, 'favorite()'], [/\.openFavorites\(/, 'openFavorites()'], [/favoritesCount/, 'favoritesCount'], [/1 filme favorito/, 'texto']],
      forbid: [[/getBy\w+\(|\.locator\(/, 'locator solto no teste (use o Page Object)']] },
    { id: 'D3', file: D, need: [[/seedFavorites\(\s*\[/, 'seedFavorites([...])'], [/2 filmes favoritos/, 'texto'], [/favorites-item-603/, 'item 603'], [/favorites-item-680/, 'item 680']] },
  ],
  pwa: [
    { id: 'E1', file: E, need: [[/data-app-ready/, 'data-app-ready'], [/detail-title/, 'título do detalhe'], [/rota-que-nao-existe/, 'rota inexistente'], [/toHaveURL\(/, 'toHaveURL']] },
    { id: 'E2', file: E, need: [[/expect\s*\.\s*poll\s*\(/, 'expect.poll'], [/activated/, "'activated'"], [/waitForSwControl\(|serviceWorker\.controller/, 'espera o controller'], [/rel="manifest"|rel=\\?'manifest/, 'link manifest'], [/request\.get\(/, 'request.get']] },
    { id: 'E3', file: E, need: [[/waitForSwControl\(|serviceWorker\.controller/, 'espera o controller'], [/setOffline\(\s*true\s*\)/, 'setOffline(true)'], [/\.reload\(/, 'reload offline'], [/offline-banner/, 'banner'], [/setOffline\(\s*false\s*\)/, 'volta a rede'], [/toBeHidden\(|not\.toBeVisible\(/, 'banner some']] },
    { id: 'E4', file: E, need: [[/setOffline\(\s*true\s*\)/, 'setOffline(true)'], [/comment-input/, 'comentário'], [/pending/, "'pending'"], [/\.reload\(/, 'reload'], [/setOffline\(\s*false\s*\)/, 'volta a rede'], [/synced/, "'synced'"]] },
  ],
}

const CRITERIA: { key: string; label: string; weight: number; group: keyof typeof RULES }[] = [
  { key: 'locators', label: 'Bloco A — Locators', weight: 1.5, group: 'locators' },
  { key: 'expect', label: 'Bloco B — Expect e espera', weight: 1.5, group: 'expect' },
  { key: 'mock', label: 'Bloco C — Mock de rede', weight: 2, group: 'mock' },
  { key: 'fixtures', label: 'Bloco D — Conta, Page Object, fixtures', weight: 1.5, group: 'fixtures' },
  { key: 'pwa', label: 'Bloco E — SPA, PWA e offline', weight: 1.5, group: 'pwa' },
]

const half = (n: number) => Math.round(n * 4) / 4

const criteria: Criterion[] = []

for (const c of CRITERIA) {
  const results = RULES[c.group].map(r => ({ id: r.id, ...checkRule(r) }))
  const done = results.filter(r => r.ok).length
  // D2/D3 também dependem dos arquivos de suporte (Page Object e fixtures completos)
  let supportNote: string | undefined
  let ratioDone = done
  if (c.group === 'fixtures') {
    const po = read('support/catalog-page.ts')
    const fx = read('support/fixtures.ts')
    const poOk = po !== null && !FALTA.test(stripComments(po)) && /\.filter\(/.test(stripComments(po))
    const fxOk = fx !== null && !FALTA.test(stripComments(fx)) && /addInitScript\(/.test(stripComments(fx)) && /\.extend</.test(stripComments(fx))
    const d2 = results.find(r => r.id === 'D2')!, d3 = results.find(r => r.id === 'D3')!
    if (d2.ok && !poOk) { ratioDone--; supportNote = 'catalog-page.ts incompleto (falta() ou sem filter)' }
    if (d3.ok && !fxOk) { ratioDone--; supportNote = [supportNote, 'fixtures.ts incompleto (falta(), addInitScript ou extend)'].filter(Boolean).join(' · ') }
  }
  const pend = results.filter(r => !r.ok)
  criteria.push({
    key: c.key,
    label: c.label,
    weight: c.weight,
    earned: half(c.weight * (ratioDone / results.length)),
    note: [`${Math.max(ratioDone, 0)}/${results.length} desafios`, ...pend.map(r => `${r.id}: ${r.why}`), supportNote].filter(Boolean).join(' · '),
  })
}

// F — caçada ao flaky: defeitos removidos no arquivo + cada teste consertado
{
  const src = read(F)
  let earned = 0
  let note = 'arquivo não encontrado'
  if (src !== null) {
    const code = stripComments(src)
    const problems: string[] = []
    if (/waitForTimeout\(/.test(code)) problems.push('ainda tem waitForTimeout')
    if (/\.count\(\)/.test(code)) problems.push('ainda lê .count() fora do expect')
    for (const id of ['F1a', 'F1b', 'F1c', 'F1d']) if (testBody(src, id) === null) problems.push(`${id} apagado/renomeado`)
    const f1a = testBody(src, 'F1a') ?? '', f1b = testBody(src, 'F1b') ?? '', f1d = testBody(src, 'F1d') ?? ''
    if (!/toHaveCount\(\s*1\s*\)/.test(f1a)) problems.push('F1a sem toHaveCount(1)')
    if (!/toHaveCount\(\s*24\s*\)/.test(f1b)) problems.push('F1b sem toHaveCount(24)')
    // F1d precisa criar o próprio estado: clicar no coração OU semear (localStorage/addInitScript/fixture).
    const criaEstado = (/movie-card-heart-\d+|\.favorite\(/.test(f1d) && /\.click\(|\.favorite\(/.test(f1d)) || /seedFavorites|addInitScript|localStorage/.test(f1d)
    if (!criaEstado) problems.push('F1d ainda depende do F1c (precisa criar o próprio favorito: clicar ou semear)')
    earned = problems.length === 0 ? 0.5 : 0
    note = problems.length === 0 ? 'defeitos removidos' : problems.join(' · ')
  }
  criteria.push({ key: 'flaky', label: 'Bloco F — Teste instável consertado', weight: 0.5, earned, note })
}

// 📝 manual — missão livre: o bot só informa o que encontrou (não pontua)
{
  const src = read('livre/missao-livre.spec.ts')
  let note = 'arquivo não encontrado'
  if (src !== null) {
    const code = stripComments(src)
    const titles = [...code.matchAll(/\btest\(\s*['"`]([^'"`]+)['"`]/g)].map(m => m[1]).filter(t => !/[<>]/.test(t)) // título ainda com <descreva> = scaffold, não conta
    const has = (p: string) => titles.some(t => t.toLowerCase().startsWith(p))
    const falta = FALTA.test(code)
    note = `encontrei: feliz ${has('feliz') ? '✔' : '✘'} · negativo ${has('negativo') ? '✔' : '✘'} · borda ${has('borda') ? '✔' : '✘'}${falta ? ' · ainda tem falta()' : ''} — avaliação manual (Canvas)`
  }
  criteria.push({ key: 'livre', label: 'Missão livre (fluxo, 3 testes, risco coberto)', weight: 1, earned: 0, manual: true, note })
}

// 📝 manual — respostas
{
  const p = path.join(praticaDir, 'RESPOSTAS.md')
  let note = 'RESPOSTAS.md não encontrado'
  if (fs.existsSync(p)) {
    const raw = fs.readFileSync(p, 'utf8')
    const respondidas = raw.split(/^###\s/m).slice(1).filter(b => {
      const resposta = b.split('\n').slice(1).join('\n').replace(/\*\([^)]*\)\*/g, '').trim()
      return resposta.length > 40 && !/<sua resposta>/.test(resposta)
    }).length
    note = `${respondidas}/6 perguntas respondidas — avaliação manual (Canvas)`
  }
  criteria.push({ key: 'respostas', label: 'RESPOSTAS.md — entendeu o porquê', weight: 0.5, earned: 0, manual: true, note })
}

const { pub, priv } = buildBreakdowns(criteria)
const autoScore = computeAuto(criteria)
const totalScore = computeScore(criteria)
const maxAutoScore = criteria.filter(c => !c.manual).reduce((s, c) => s + c.weight, 0)
const maxTotalScore = criteria.reduce((s, c) => s + c.weight, 0)

const result: GradeResult = { autoScore, maxAutoScore, totalScore, maxTotalScore, criteria, breakdown: pub, privateBreakdown: priv }
fs.writeFileSync(path.join(__dirname, 'grade.json'), JSON.stringify(result, null, 2))

console.log('\n=== GRADE RESULT — Lab Playwright PWA ===')
console.log(`autoScore: ${autoScore}/${maxAutoScore} (piso — nota final no Canvas) · total possível ${maxTotalScore}`)
console.log('\nBreakdown:')
console.log(priv)
