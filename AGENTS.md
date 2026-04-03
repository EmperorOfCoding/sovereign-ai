# AGENTS.md — Sovereign AI

> **Leia este arquivo inteiro antes de escrever qualquer linha de código.**
> Este documento é a fonte única de verdade para agentes de IA que colaboram neste projeto. Qualquer decisão técnica ou de produto deve ser consistente com o que está aqui definido.

---

## 1. Visão Geral do Projeto

**Sovereign AI** é uma ferramenta de validação de ideias de mercado movida por inteligência artificial. Ela resolve um problema crítico no ecossistema empreendedor: a maioria dos negócios falha não por falta de execução, mas por falta de demanda real — a causa nº 1 de morte de startups é "no market need" (35–40% dos casos).

A plataforma substitui pesquisas manuais, entrevistas enviesadas e suposições ("eu acho que as pessoas vão adorar") por uma análise objetiva, baseada em dados reais e atualizados, entregando ao empreendedor um **veredito claro e honesto** sobre o potencial da sua ideia.

### Stack Principal
- **Frontend:** React + Next.js
- **Backend / Orquestração:** Node.js (ou Python, conforme módulo)
- **LLM Principal:** Claude Sonnet (via Anthropic API)
- **LLM Mecânico:** Claude Haiku (tarefas de triagem e classificação)
- **Pesquisa Web:** Tavily / Serper.dev / Exa.ai (integração configurável)
- **Otimização de Custo:** Anthropic Batch API + Prompt Caching

---

## 2. Lógica de Negócio — Pipeline Obrigatório

Todo agente que tocar no core da aplicação **deve** respeitar este fluxo na íntegra e nesta ordem. Não pule etapas. Não invente etapas novas sem aprovação explícita.

```
[INPUT: Ideia do usuário]
        │
        ▼
[ETAPA 1] Coleta de Dados via Pesquisa Web
        │  → Usar apenas dados dos últimos 2 anos
        │  → Fontes: pesquisas acadêmicas, sites de reclamação,
        │    comunidades (Reddit, Reclame Aqui, G2, Trustpilot,
        │    Product Hunt, Hacker News, fóruns de nicho)
        │  → API de pesquisa aprimorada obrigatória (Tavily/Serper/Exa)
        ▼
[ETAPA 2] Triagem de Relevância
        │  → Claude Haiku classifica cada dado: relevante | não-relevante
        │  → Apenas dados relevantes avançam no pipeline
        │  → Critério de relevância: evidencia dor real do mercado,
        │    disposição de pagamento, tendência ou comportamento
        ▼
[ETAPA 3] Análise e Scoring (Claude Sonnet)
        │  → Indicador de Dor: 0–10
        │  → Indicador de Willing-to-Pay (WTP): 0–10
        │  → Ambos devem ser calculados com base em evidências,
        │    nunca em inferências abstratas
        ▼
[ETAPA 4] Seção "Problema Real" (Honestidade Radical)
        │  → A IA deve ser brutalmente honesta
        │  → Exemplos de outputs válidos:
        │    - "Muita gente sofre com isso, mas a dor não é suficiente
        │       para gerar disposição de pagamento."
        │    - "Dor alta, mas mercado já saturado com soluções gratuitas."
        │    - "Nicho pequeno, mas alta disposição de pagar — oportunidade
        │       de negócio viável."
        │  → PROIBIDO: outputs vagos, diplomáticos ou que evitem a verdade
        ▼
[ETAPA 5] Evidências Encontradas
        │  → Sinais de dor do mercado
        │  → Pesquisas e dados quantitativos
        │  → Tendências identificadas
        │  → Apenas itens com fonte verificável
        ▼
[ETAPA 6] Resumo da IA
        │  → Síntese de todas as evidências coletadas
        │  → Deve ser objetivo, sem repetir palavra por palavra
        │    o que já foi mostrado nas evidências
        ▼
[ETAPA 7] Recomendação de Próximos Passos
        │  → Baseado nos resultados, sugerir ações concretas
        │  → Obrigatório: incluir sugestões de Nichos específicos
        │  → Ex: "Testar com clínicas odontológicas de pequeno porte
        │    antes de escalar para toda área de saúde"
        ▼
[ETAPA 8] Veredito Final
           → VÁLIDO: Dor real + disposição de pagar identificadas
           → INVÁLIDO: Dor insuficiente ou ausência de WTP
           → O veredito deve ser explícito, sem ambiguidade
```

---

## 3. Regras de Dados

### 3.1 Atualidade dos Dados
- **Obrigatório:** Usar apenas dados e publicações dos **últimos 2 anos** a partir da data atual.
- Dados mais antigos só podem ser usados como contexto histórico, nunca como evidência principal.
- O agente deve verificar e, quando possível, incluir a data de publicação de cada fonte.

### 3.2 Fontes Prioritárias
| Tipo | Exemplos |
|---|---|
| Comunidades e fóruns | Reddit, Hacker News, Stack Overflow, fóruns de nicho |
| Sites de reclamação | Reclame Aqui, Trustpilot, G2, Capterra |
| Lançamentos e tração | Product Hunt, Indie Hackers |
| Pesquisas de mercado | Statista, CB Insights, relatórios setoriais |
| Notícias e tendências | Google Trends, mídia especializada |

### 3.3 Dados Proibidos como Evidência
- Opiniões hipotéticas ("Você usaria isso?") — leading the witness
- Surveys sem metodologia clara
- Dados sem data ou fonte identificável
- Afirmações do próprio usuário sobre sua ideia

---

## 4. Regras de Comportamento dos Agentes

### 4.1 Honestidade Radical
O agente **nunca deve suavizar um resultado negativo** para não "desanimar" o usuário. O propósito da ferramenta é poupar tempo e dinheiro do empreendedor. Um falso positivo é pior do que nenhuma resposta.

```
❌ ERRADO: "Sua ideia tem potencial, mas pode precisar de alguns ajustes."
✅ CERTO:  "Os dados indicam baixa disposição de pagamento. A dor existe,
            mas o mercado tende a buscar soluções gratuitas neste segmento."
```

### 4.2 Sem Alucinações
- Nunca invente dados, estatísticas ou fontes.
- Se não houver evidências suficientes, declare explicitamente: `"Evidências insuficientes encontradas para este critério."`
- Prefira um veredito "Inconclusivo" a um veredito fabricado.

### 4.3 Separação Clara de Responsabilidades por Modelo
| Tarefa | Modelo |
|---|---|
| Triagem de relevância de dados | Claude Haiku |
| Análise profunda, scoring, resumo, veredito | Claude Sonnet |
| Tarefas de classificação em lote | Batch API |

### 4.4 Sem Viés Confirmatório
O agente não deve tentar "confirmar" a ideia do usuário. Ele deve agir como um analista de mercado neutro. Se os dados apontam contra a ideia, o relatório deve refletir isso sem hesitação.

---

## 5. Boas Práticas de Desenvolvimento

### 5.1 Estrutura de Arquivos
```
sovereign-ai/
├── AGENTS.md              ← Este arquivo
├── README.md
├── .env.example
├── src/
│   ├── pipeline/          ← Lógica do pipeline de validação
│   │   ├── collector.ts   ← Etapa 1: Coleta de dados
│   │   ├── filter.ts      ← Etapa 2: Triagem de relevância
│   │   ├── analyzer.ts    ← Etapas 3–6: Análise e scoring
│   │   ├── verdict.ts     ← Etapa 8: Veredito final
│   │   └── index.ts       ← Orquestra o pipeline completo
│   ├── api/               ← Endpoints REST / API routes
│   ├── prompts/           ← Todos os prompts centralizados aqui
│   │   ├── haiku/
│   │   └── sonnet/
│   ├── lib/               ← Utilitários, clientes de API externos
│   └── types/             ← Tipos TypeScript compartilhados
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/          ← Ideias de teste mock
└── docs/
```

### 5.2 Gerenciamento de Prompts
- **Todos os prompts vivem em `src/prompts/`**, nunca inline no código de negócio.
- Cada prompt deve ter um comentário explicando seu papel no pipeline.
- Alterações em prompts devem ser versionadas e testadas antes de ir para produção.
- Use variáveis de template explícitas: `{{user_idea}}`, `{{evidence_list}}`, etc.

### 5.3 Variáveis de Ambiente
- Nunca hardcode API keys ou segredos.
- Sempre usar `.env` + `.env.example` (sem valores reais).
- Variáveis obrigatórias documentadas em `.env.example`.

```env
# .env.example
ANTHROPIC_API_KEY=
TAVILY_API_KEY=
SERPER_API_KEY=
EXA_API_KEY=
SEARCH_PROVIDER=tavily   # tavily | serper | exa
```

### 5.4 Tratamento de Erros
- Toda chamada de API externa deve ter try/catch explícito.
- Erros de API de pesquisa não devem derrubar o pipeline inteiro — degradar graciosamente e sinalizar no relatório.
- Timeout máximo configurável por etapa do pipeline.
- Logar erros com contexto suficiente para debug (etapa, input, erro recebido).

### 5.5 Código Limpo
- Funções pequenas com responsabilidade única.
- Nomes em inglês para código; comentários em português são aceitáveis.
- Evitar lógica de negócio dentro de componentes de UI.
- Nenhuma função deve ter mais de 50 linhas sem justificativa documentada.

---

## 6. Testes

### 6.1 Estratégia de Testes

**Unitários** — Testar cada etapa do pipeline isoladamente com mocks.
```
tests/unit/
├── collector.test.ts    → Mock de API de pesquisa; verificar parsing
├── filter.test.ts       → Haiku mock; verificar triagem relevante/não-relevante
├── analyzer.test.ts     → Sonnet mock; verificar scoring e formato de saída
└── verdict.test.ts      → Verificar lógica de VÁLIDO/INVÁLIDO
```

**Integração** — Testar o pipeline completo com fixtures realistas.
```
tests/integration/
├── pipeline.test.ts     → Ideia de entrada → Relatório de saída completo
└── api.test.ts          → Endpoints HTTP end-to-end
```

**Fixtures de Teste** — Manter casos de teste representativos:
```
tests/fixtures/
├── idea_high_pain.json        → Ideia com dor alta e WTP alto (espera: VÁLIDO)
├── idea_low_wtp.json          → Dor real mas sem disposição de pagar (espera: INVÁLIDO)
├── idea_saturated_market.json → Mercado saturado (espera: INVÁLIDO ou nicho)
└── idea_insufficient_data.json → Dados insuficientes (espera: INCONCLUSIVO)
```

### 6.2 O Que Sempre Testar
- [ ] O pipeline não quebra com ideias vagas ou mal-formuladas.
- [ ] O scoring (0–10) nunca retorna valor fora do intervalo.
- [ ] O veredito nunca é omitido do output.
- [ ] Dados com mais de 2 anos são filtrados.
- [ ] Fontes sem data são marcadas como não-verificadas, não descartadas silenciosamente.
- [ ] A seção "Problema Real" sempre contém texto (nunca vazia).
- [ ] Falha na API de pesquisa não retorna relatório vazio — retorna erro tratado.

### 6.3 Não Testar com Chamadas Reais de LLM em CI
- Sempre mockar Anthropic API e APIs de pesquisa em ambiente de teste.
- Reservar chamadas reais para testes manuais de validação de qualidade de prompt.

---

## 7. Otimização de Custo

| Estratégia | Aplicação |
|---|---|
| **Claude Haiku** | Triagem de relevância (alto volume, baixa complexidade) |
| **Claude Sonnet** | Análise, scoring, veredito (baixo volume, alta complexidade) |
| **Batch API** | Processar múltiplas ideias em lote fora do horário de pico |
| **Prompt Caching** | System prompts estáticos longos (ex: instruções do pipeline) |
| **Truncamento de contexto** | Não passar dados não-relevantes para o Sonnet |

---

## 8. Checklist Antes de Cada PR / Entrega

- [ ] A lógica respeita o pipeline de 8 etapas na ordem correta?
- [ ] O agente está sendo honesto? (sem suavização de resultados negativos)
- [ ] Não há API keys ou segredos no código?
- [ ] Todos os prompts estão em `src/prompts/`, não inline?
- [ ] Os dados coletados são filtrados por data (últimos 2 anos)?
- [ ] A seção "Problema Real" gera output honesto e não-vago?
- [ ] Os testes unitários das etapas afetadas estão passando?
- [ ] Erros de API externa têm fallback e não derrubam o pipeline?
- [ ] O veredito final é explícito: VÁLIDO, INVÁLIDO ou INCONCLUSIVO?
- [ ] Nichos específicos estão incluídos nos próximos passos?

---

## 9. O Que Este Agente NUNCA Deve Fazer

- ❌ Inventar fontes, estatísticas ou dados de mercado.
- ❌ Emitir veredito VÁLIDO sem evidências concretas de WTP.
- ❌ Usar dados hipotéticos ou opiniões do usuário como evidência.
- ❌ Suavizar um resultado negativo para "motivar" o usuário.
- ❌ Pular etapas do pipeline para economizar tokens.
- ❌ Hardcodar API keys no código.
- ❌ Alterar a lógica de negócio sem atualizar este documento.
- ❌ Usar dados com mais de 2 anos como evidência primária.
- ❌ Retornar a seção "Problema Real" vazia ou genérica.
- ❌ Confundir "muita gente sofre" com "as pessoas pagarão por isso".

---

*Última atualização: abril de 2025 — Sovereign AI v0.1*
*Mantenha este documento atualizado a cada mudança significativa de produto ou arquitetura.*
