// Validator — Lab Arquitetura de Testes (Maestro) · 10 pts
// Rubrica: enunciado.md do lab. Nota AUTOMÁTICA = piso (estrutural, parse-only, nunca executa o código do aluno).
// Manuais (Canvas): RESPOSTAS.md (1) + execução real no Android (0,5).

import * as fs from 'fs'
import * as path from 'path'
import { Criterion, GradeResult, computeAuto, computeScore, buildBreakdowns } from './lib/compute-score'

const args = process.argv.slice(2)
const entregaIdx = args.indexOf('--entrega')
const entregaPath = path.resolve(entregaIdx >= 0 ? args[entregaIdx + 1] : '.')
const praticaDir = path.join(entregaPath, 'pratica')

function read(...parts: string[]): string | null {
  const p = path.join(praticaDir, ...parts)
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null
}

/** TODO pendente = linha de comentário começando com TODO (// ou #). */
function todos(raw: string): number {
  return raw.split('\n').filter(l => /^\s*(\/\/|#)\s*TODO/.test(l)).length
}

/** Código sem linhas de comentário. */
function active(raw: string): string {
  return raw.split('\n').filter(l => !/^\s*(\/\/|#)/.test(l)).join('\n')
}

const criteria: Criterion[] = []
const ABSENT = 'arquivo não encontrado'

// Maestro — 5 níveis
function flow(...p: string[]) { return read('flows', ...p) }
function flowOk(raw: string | null, needs: RegExp[]) {
  if (raw === null) return { ok: false, why: ABSENT }
  const t = todos(raw)
  const code = active(raw)
  const missing = needs.filter(n => !n.test(code))
  return { ok: t === 0 && missing.length === 0, why: `${t} TODO(s)${missing.length ? ` · falta ${missing.length} elemento(s) esperado(s)` : ''}` }
}

// 1. Refatoração guiada (2): 00-refatorar sem login/ids soltos + fragmento favoritar
{
  const fav = flowOk(flow('_fragments', 'favoritar.yaml'), [/movie-card-heart-\$\{MOVIE_ID\}/])
  const raw = flow('00-refatorar.yaml')
  const code = raw === null ? '' : active(raw)
  const runFlows = (code.match(/runFlow/g) ?? []).length
  const smells = [
    /login-email-input|login-password-input|login-submit-button/.test(code) && 'ids de login soltos',
    /movie-card-heart-/.test(code) && 'id do coração solto',
    runFlows < 3 && `só ${runFlows} runFlow (esperado ≥3: login + favoritar 2×)`,
    !/_fragments\/login\.yaml/.test(code) && 'não usa o fragmento de login',
    !/MOVIE_ID/.test(code) && 'não passa MOVIE_ID por env',
    todos(raw ?? '') > 0 && 'TODO pendente',
  ].filter(Boolean) as string[]
  const earned = (fav.ok ? 1 : 0) + (raw !== null && smells.length === 0 ? 1 : 0)
  criteria.push({ key: 'refatoracao', label: 'Refatoração guiada (fragmento favoritar + 00-refatorar)', weight: 2, earned,
    note: [!fav.ok && `favoritar: ${fav.why}`, raw === null ? `00-refatorar: ${ABSENT}` : smells.length ? `00-refatorar ainda tem: ${smells.join(', ')}` : null].filter(Boolean).join(' · ') || undefined })
}

// 2. Fragmento abrir-busca + 02-busca (1,5)
{
  const a = flowOk(flow('_fragments', 'abrir-busca.yaml'), [/runFlow/, /movielist-search-button/, /assertVisible/])
  const b = flowOk(flow('02-busca.yaml'), [/runFlow:\s*_fragments\/abrir-busca\.yaml/, /inputText/, /assertVisible/])
  criteria.push({ key: 'fragmento-busca', label: 'Fragmento abrir-busca + flow 02-busca', weight: 1.5,
    earned: (a.ok ? 0.75 : 0) + (b.ok ? 0.75 : 0),
    note: [!a.ok && `abrir-busca: ${a.why}`, !b.ok && `02-busca: ${b.why}`].filter(Boolean).join(' · ') || undefined })
}

// 3. Fragmento parametrizado (1,5)
{
  const a = flowOk(flow('_fragments', 'buscar.yaml'), [/inputText:\s*\$\{TERM\}/, /assertVisible:\s*\$\{TERM\}/])
  const b = flowOk(flow('03-busca-parametrizada.yaml'), [/_fragments\/buscar\.yaml/, /TERM:\s*["']?Matrix/, /TERM:\s*["']?(?!Matrix)\w+/])
  criteria.push({ key: 'fragmento-parametrizado', label: 'Fragmento parametrizado (env TERM) chamado 2×', weight: 1.5,
    earned: (a.ok ? 0.75 : 0) + (b.ok ? 0.75 : 0),
    note: [!a.ok && `buscar: ${a.why}`, !b.ok && `03-busca-parametrizada: ${b.why}`].filter(Boolean).join(' · ') || undefined })
}

// 4. POM (1,5)
{
  const el1 = read('flows', 'elements', 'login.js')
  const el2 = read('flows', 'elements', 'movielist.js')
  const emptyIds = [el1, el2].filter(Boolean).map(r => (r!.match(/:\s*""/g) ?? []).length).reduce((a, b) => a + b, 0)
  const pom = flowOk(flow('04-pom-login.yaml'), [/\$\{output\.login\.email\}/, /\$\{output\.login\.entrar\}/, /assertVisible/])
  criteria.push({ key: 'pom', label: 'Page Object (elements/*.js + 04-pom-login)', weight: 1.5,
    earned: el1 !== null && el2 !== null && emptyIds === 0 && pom.ok ? 1.5 : el1 !== null && emptyIds === 0 ? 0.75 : 0,
    note: el1 === null || el2 === null ? ABSENT : emptyIds === 0 && pom.ok ? undefined : `${emptyIds} id(s) vazio(s) em elements · 04: ${pom.why}` })
}

// 5. Flow composto (2)
{
  const comp = flowOk(flow('05-favoritos-composto.yaml'), [/_fragments\/login\.yaml/, /\$\{output\./, /favorites-item-603-remove/, /assertNotVisible/, /favorites-empty/])
  criteria.push({ key: 'composto', label: 'Flow composto 05 (fragmento + POM + assertNotVisible)', weight: 2,
    earned: comp.ok ? 2 : 0, note: comp.ok ? undefined : `05: ${comp.why}` })
}

// Manuais
criteria.push({ key: 'respostas', label: 'RESPOSTAS.md — entendeu o porquê da arquitetura', weight: 1, earned: 0, manual: true, note: 'avaliação manual (Canvas)' })
criteria.push({ key: 'exec-android', label: 'Execução real dos flows no Android (vídeo/print)', weight: 0.5, earned: 0, manual: true, note: 'avaliação manual (Canvas)' })

const { pub, priv } = buildBreakdowns(criteria)
const result: GradeResult = {
  autoScore: computeAuto(criteria),
  maxAutoScore: criteria.filter(c => !c.manual).reduce((s, c) => s + c.weight, 0),
  totalScore: computeScore(criteria),
  maxTotalScore: criteria.reduce((s, c) => s + c.weight, 0),
  criteria,
  breakdown: pub,
  privateBreakdown: priv,
}
fs.writeFileSync(path.join(__dirname, 'grade.json'), JSON.stringify(result, null, 2))
console.log(pub)
console.log(`\nauto ${result.autoScore}/${result.maxAutoScore} · total ${result.totalScore}/${result.maxTotalScore}`)
