# Grader — Lab Playwright PWA (10 pts)

Validator **estrutural** (parse-only, nunca executa código do aluno) da rubrica do `../enunciado.md`.
A nota comentada no PR é o **piso automático** (8,5 pts); a missão livre e o `RESPOSTAS.md` (1,5 pt, 📝)
entram na nota final no Canvas.

```bash
npm install
npx ts-node validator.ts --entrega ..            # ou ../../../_pr/exercicios/04-lab-playwright-pwa/ no CI
```

Smoke local obrigatório antes de distribuir: scaffold → score baixo; testes do gabarito copiados
por cima de `pratica/tests` → 8,5/8,5 automático.
