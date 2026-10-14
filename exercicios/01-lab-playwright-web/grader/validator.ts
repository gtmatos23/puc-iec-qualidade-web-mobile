// Validator — Lab Playwright Web · Playwright: busca + network mocking (busca-mock.spec.ts, testes 1–4)
// Lab de 10 pts: testes 1–3 valem 2 cada, o teste 4 (mock) vale 4. Nota automática = nota do lab.
// Estrutural (parse-only) — nunca executa código do aluno.
//
// Um teste está "completo" quando o corpo (sem comentários):
//   · tem `await expect(` com matcher
//   · contém os padrões do que o teste pede (ex.: search-result-999 no teste 4)

import * as fs from 'fs'
import * as path from 'path'
import { Criterion, GradeResult, computeAuto, computeScore, buildBreakdowns } from './lib/compute-score'

const args = process.argv.slice(2)
const entregaIdx = args.indexOf('--entrega')
const entregaPath = path.resolve(entregaIdx >= 0 ? args[entregaIdx + 1] : '.')
const e2eDir = path.join(entregaPath, 'pratica', 'tests')

function read(file: string): string | null {
  const p = path.join(e2eDir, file)
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null
}

function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n')
}

/** Corpo do teste cujo título começa com `${n}.` (casamento de chaves a partir de "=> {"). */
function testBody(src: string, n: number): string | null {
  const m = new RegExp(`\\btest\\(\\s*(['"\`])${n}\\.`).exec(src)
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

interface Spec { n: number; label: string; weight: number; need: [RegExp, string][] }

const SPEC02: Spec[] = [
  { n: 1, weight: 2, label: 'Teste 1 — abrir a tela de busca', need: [[/search-screen/, 'testid search-screen'], [/toBeVisible\(/, 'toBeVisible']] },
  { n: 2, weight: 2, label: 'Teste 2 — título "Buscar" aparece', need: [[/getByText\(\s*['"]Buscar['"]/, "getByText('Buscar')"], [/toBeVisible\(|toHaveText\(|toContainText\(/, 'matcher']] },
  { n: 3, weight: 2, label: 'Teste 3 — buscar "Matrix" mostra o resultado', need: [[/search-result-603/, 'testid search-result-603'], [/toBeVisible\(/, 'toBeVisible']] },
  { n: 4, weight: 4, label: 'Teste 4 — mock com route.fulfill', need: [[/route\(/, 'page.route'], [/fulfill\(/, 'route.fulfill'], [/search-result-999/, 'testid search-result-999'], [/toBeVisible\(|toHaveText\(|toContainText\(/, 'matcher']] },
]

const raw = read('busca-mock.spec.ts')
const criteria: Criterion[] = []

for (const s of SPEC02) {
  let earned = 0
  let note: string | undefined
  if (raw === null) note = 'arquivo tests/busca-mock.spec.ts não encontrado'
  else {
    const body = testBody(raw, s.n)
    if (body === null) note = 'teste não encontrado (título alterado/apagado?)'
    else if (/\bfalta\s*\(/.test(body)) note = 'ainda tem a linha falta(...)'
    else if (!/\bawait\s+expect\s*\(/.test(body)) note = 'falta `await expect(...)` — o teste ainda passa "vazio"'
    else {
      const missing = s.need.filter(([re]) => !re.test(body)).map(([, w]) => w)
      if (missing.length) note = `falta: ${missing.join(', ')}`
      else earned = s.weight
    }
  }
  criteria.push({ key: `t${s.n}`, label: s.label, weight: s.weight, earned, note })
}

const { pub, priv } = buildBreakdowns(criteria)
const autoScore = computeAuto(criteria)
const totalScore = computeScore(criteria)
const maxAutoScore = criteria.filter(c => !c.manual).reduce((s, c) => s + c.weight, 0)
const maxTotalScore = criteria.reduce((s, c) => s + c.weight, 0)

const result: GradeResult = { autoScore, maxAutoScore, totalScore, maxTotalScore, criteria, breakdown: pub, privateBreakdown: priv }
fs.writeFileSync(path.join(__dirname, 'grade.json'), JSON.stringify(result, null, 2))

console.log('\n=== GRADE RESULT — Lab Playwright Web (busca + network mocking) ===')
console.log(`nota automática: ${autoScore}/${maxAutoScore}`)
console.log('\nBreakdown:')
console.log(priv)
