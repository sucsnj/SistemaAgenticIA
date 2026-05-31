# Sistema de Recomendação de Ferramentas Agênticas

## 📌 Visão Geral
Aplicação web interativa (wizard) que recomenda ferramentas agênticas com base em quatro critérios: **Nível de habilidade**, **Objetivo do projeto**, **Custo e licença** e **Controle**.  
O sistema apresenta interface moderna, suporte multilíngue (Português Brasileiro / English), assistente de ajuda integrado via IA (Gemini) e uma matriz de decisão que mapeia todas as **36 combinações possíveis** para ferramentas agênticas específicas.

---

## 🎯 Proposta do Projeto
Fornecer uma ferramenta prática e acessível para equipes e desenvolvedores escolherem a solução agêntica mais adequada ao seu contexto, reduzindo tempo de pesquisa e alinhando requisitos técnicos, custo e governança.  
O sistema deve ser leve, responsivo e auditável, com explicações concisas sobre cada recomendação e possibilidade de reiniciar o fluxo para testar outras combinações.

---

## ⚙️ Principais Funcionalidades
- **Wizard em etapas**: cada pergunta em uma janela separada; validação obrigatória por etapa.  
- **Quatro critérios de entrada**:
  - Nível de habilidade: Verde (Acessível), Amarelo (Desafio), Vermelho (Complexo).
  - Objetivo: Colaboração, Prototipagem, Automação.
  - Custo e licença: Open-source, Proprietário.
  - Controle: Flexibilidade total, Solução pronta.
- **Matriz de decisão**: 36 cenários (3 × 3 × 2 × 2) mapeados para ferramentas agênticas.
- **Assistente de Ajuda**: modal integrado com IA (Gemini).
- **Suporte multilíngue**: Português e Inglês com arquivos de tradução separados.
- **Responsividade aprimorada**: otimizado para smartphones e tablets.
- **Reinício do fluxo**: reiniciar o wizard sem recarregar a página.

---

## 🛠️ Ferramentas Agênticas Cobertas
A matriz contempla exclusivamente as seguintes ferramentas:

- Cursor (Anysphere)  
- Windsurf (Cognition AI)  
- Claude Code (Anthropic)  
- GitHub Copilot (Microsoft / GitHub)  
- Google AntigravityRef (Google)  
- OpenAI Codex (OpenAI)  
- Cline (Open-source)  
- Replit Agent (Replit)  
- Aider (Open-source)  
- Continue.dev (Open-source)  
- Devin (Cognition AI)  
- Kiro (AWS / Amazon)  
- OpenHands (All-Hands AI)  
- Roo Code (Open-source)  
- Zed (Zed Industries)  
- Bolt.new (StackBlitz)  
- Lovable (Lovable)  
- v0 by Vercel (Vercel)  
- Gemini CLI (Google)  
- Jules (Google)  
- Emergent (Emergent Labs)  
- CodeConductor (CodeConductor)  
- LangGraph (LangChain)  
- CrewAI (CrewAI Inc.)  
- Microsoft Agent Framework (Semantic Kernel / AutoGen)  
- OpenAI Agents SDK (OpenAI)  
- n8n com IA (n8n.io)  
- LlamaIndex (LlamaIndex Inc.)  

---

## 🔄 Como Funciona (Resumo de Fluxo)
1. Usuário abre o wizard e responde, em sequência, as quatro perguntas obrigatórias.  
2. Cada etapa exige seleção; ao tentar avançar sem resposta, o sistema exibe notificação de validação.  
3. Ao completar todas as etapas, o sistema consulta a matriz de decisão e apresenta a ferramenta recomendada com:
   - Nome
   - Categoria
   - Breve descrição
   - Link oficial  
4. Em qualquer etapa, o usuário pode abrir o modal de ajuda.  
5. O usuário pode reiniciar o fluxo para testar outras combinações.

---

## 🌐 Localização e Traduções
- Traduções mantidas em arquivos separados: `translations_pt.json` e `translations_en.json`.  
- Todas as strings da interface, mensagens de validação, textos do modal de ajuda e labels de acessibilidade devem estar presentes em ambos os arquivos.  
- Troca de idioma atualiza a interface dinamicamente sem perder o estado do wizard.  

---

## 🤖 Integração com IA (Ajuda)
- Modal de ajuda envia contexto da etapa atual e pergunta do usuário para o modelo configurado (Gemini).  
- Respostas exibidas de forma concisa e contextualizada.  
- Mensagens padronizadas de erro:
  - **Português**:  
    - "Limite diário atingido, por favor tente novamente amanhã."  
    - "Erro ao conectar à IA. Tente novamente."  
  - **English**:  
    - "Daily limit reached, please try again tomorrow."  
    - "Error connecting to the AI. Please try again."  

---

## 📱 Responsividade e Acessibilidade
- Layout adaptado para smartphones e tablets.  
- Notificações de erro exibidas apenas quando necessário.  
- Suporte a leitores de tela com `aria-labels` traduzidos.  
- Micro‑interações e transições suaves para melhor experiência em touch.  

---

## ✅ Testes e Verificação
- Avançar sem responder para validar mensagens de erro.  
- Trocar idioma em diferentes etapas e confirmar atualização instantânea.  
- Abrir modal de ajuda e validar respostas da IA no idioma ativo.  
- Testar todas as 36 combinações e confirmar que cada uma retorna uma ferramenta válida.  
- Testar comportamento em múltiplas resoluções (desktop, tablet, smartphone).  
- Testar fallback de tradução quando uma chave estiver ausente.  

---

## 🤝 Contribuição
- Verifique se nenhuma chave de API foi incluída em commits.  
- Mantenha consistência nas chaves de tradução e complete ambos os arquivos de idioma.  
- Documente alterações na matriz de decisão e justifique mapeamentos novos ou alterados.  

---

## 📜 Licença
- Código do projeto: licenciado sob **MIT License** (ou outra escolhida pelo mantenedor).  
- Ferramentas listadas: cada uma possui sua própria licença e termos.  
- Modelos e APIs de terceiros: sujeitos às políticas e termos dos provedores.  

---

## ⚠️ Avisos e Boas Práticas
- Nunca comitar chaves de API ou credenciais.  
- Em produção, gerenciar quotas e limites de uso da IA.  
- Para ambientes sensíveis, priorizar ferramentas com suporte a auditoria e hospedagem local.  

---

## 📬 Contato
Para dúvidas sobre o projeto, sugestões de mapeamento da matriz ou contribuições, entre em contato com o mantenedor do repositório.
