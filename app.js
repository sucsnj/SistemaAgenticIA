// Estado Global i18n
let currentLang = 'pt';
let translations = {};

// Estado da aplicação
let currentStep = 1;
const totalSteps = 4;
let answers = {
    nivel: '',
    objetivo: '',
    custo: '',
    controle: ''
};

// Histórico de conversas com a IA por sessão
let chatHistory = [];

function getInitialChatHistory() {
    return [
        {
            role: "user",
            parts: [{ text: translations['prompt.system'] || "Você é um assistente de IA focado em ajudar usuários a escolher ferramentas de software. Responda de forma concisa e direta, ajudando-os a entender as opções da etapa atual do formulário." }]
        },
        {
            role: "model",
            parts: [{ text: translations['prompt.system.ack'] || "Entendido! Estou pronto para ajudar o usuário de forma concisa e direta." }]
        }
    ];
}

// Matriz de Decisão (36 Cenários) com descrições bilingues
const decisionMatrix = [
    // --- VERDE (Acessível) ---
    { 
        nivel: 'Verde', objetivo: 'Colaboração', custo: 'Open-source', controle: 'Flexibilidade', 
        ferramenta: 'Gemini CLI', 
        categoria_pt: 'CLI', categoria_en: 'CLI',
        desc_pt: 'Interface de linha de comando baseada no Gemini, flexível e fácil para colaborar e programar rapidamente.', 
        desc_en: 'Gemini-powered command line interface, flexible and easy for quick collaboration and coding.', 
        link: 'https://github.com/google/generative-ai-cli'
    },
    { 
        nivel: 'Verde', objetivo: 'Colaboração', custo: 'Open-source', controle: 'Solução pronta', 
        ferramenta: 'Bolt.new', 
        categoria_pt: 'Plataforma', categoria_en: 'Platform',
        desc_pt: 'Plataforma web de desenvolvimento fullstack em sandbox para construir e compartilhar aplicações instantaneamente.', 
        desc_en: 'Web-based fullstack sandbox development platform to build and share applications instantly.', 
        link: 'https://bolt.new/'
    },
    { 
        nivel: 'Verde', objetivo: 'Colaboração', custo: 'Proprietário', controle: 'Flexibilidade', 
        ferramenta: 'Cursor', 
        categoria_pt: 'IDE', categoria_en: 'IDE',
        desc_pt: 'Editor de código baseado em VS Code com recursos avançados de IA para desenvolvimento colaborativo rápido.', 
        desc_en: 'VS Code-based code editor with advanced AI features for rapid collaborative development.', 
        link: 'https://www.cursor.com/'
    },
    { 
        nivel: 'Verde', objetivo: 'Colaboração', custo: 'Proprietário', controle: 'Solução pronta', 
        ferramenta: 'GitHub Copilot', 
        categoria_pt: 'IDE', categoria_en: 'IDE',
        desc_pt: 'O assistente de IA mais popular integrado diretamente no seu editor, perfeito para trabalhar em equipe.', 
        desc_en: 'The most popular AI pair programmer integrated directly into your editor, perfect for teamwork.', 
        link: 'https://github.com/features/copilot'
    },
    { 
        nivel: 'Verde', objetivo: 'Prototipagem', custo: 'Open-source', controle: 'Flexibilidade', 
        ferramenta: 'Bolt.new', 
        categoria_pt: 'Plataforma', categoria_en: 'Platform',
        desc_pt: 'Criação ágil de protótipos web direto no navegador com geração automática e deploy em um clique.', 
        desc_en: 'Agile web prototyping directly in the browser with automatic generation and one-click deployment.', 
        link: 'https://bolt.new/'
    },
    { 
        nivel: 'Verde', objetivo: 'Prototipagem', custo: 'Open-source', controle: 'Solução pronta', 
        ferramenta: 'Bolt.new', 
        categoria_pt: 'Plataforma', categoria_en: 'Platform',
        desc_pt: 'Ideal para iniciar novos projetos visualmente de forma simples e direta a partir de prompts básicos.', 
        desc_en: 'Ideal for visually starting new projects simply and directly from basic prompts.', 
        link: 'https://bolt.new/'
    },
    { 
        nivel: 'Verde', objetivo: 'Prototipagem', custo: 'Proprietário', controle: 'Flexibilidade', 
        ferramenta: 'Lovable', 
        categoria_pt: 'Plataforma', categoria_en: 'Platform',
        desc_pt: 'Plataforma de IA que permite construir, implantar e iterar em aplicativos web reais e sofisticados.', 
        desc_en: 'AI platform that lets you build, deploy, and iterate on real, sophisticated web applications.', 
        link: 'https://lovable.dev/'
    },
    { 
        nivel: 'Verde', objetivo: 'Prototipagem', custo: 'Proprietário', controle: 'Solução pronta', 
        ferramenta: 'v0 by Vercel', 
        categoria_pt: 'Plataforma', categoria_en: 'Platform',
        desc_pt: 'Sistema generativo da Vercel que cria interfaces de usuário prontas para React e Tailwind a partir de prompts de texto.', 
        desc_en: 'Vercel’s generative system that creates ready-to-use React and Tailwind user interfaces from text prompts.', 
        link: 'https://v0.dev/'
    },
    { 
        nivel: 'Verde', objetivo: 'Automação', custo: 'Open-source', controle: 'Flexibilidade', 
        ferramenta: 'Gemini CLI', 
        categoria_pt: 'CLI', categoria_en: 'CLI',
        desc_pt: 'Excelente para automatizar tarefas de codificação e geração de scripts diretamente no terminal com a API Gemini.', 
        desc_en: 'Excellent for automating coding tasks and script generation directly in the terminal using the Gemini API.', 
        link: 'https://github.com/google/generative-ai-cli'
    },
    { 
        nivel: 'Verde', objetivo: 'Automação', custo: 'Open-source', controle: 'Solução pronta', 
        ferramenta: 'Bolt.new', 
        categoria_pt: 'Plataforma', categoria_en: 'Platform',
        desc_pt: 'Permite automatizar a montagem de layouts e o setup inicial de projetos web sem configurações manuais.', 
        desc_en: 'Automates layout assembly and the initial setup of web projects without manual configurations.', 
        link: 'https://bolt.new/'
    },
    { 
        nivel: 'Verde', objetivo: 'Automação', custo: 'Proprietário', controle: 'Flexibilidade', 
        ferramenta: 'Windsurf', 
        categoria_pt: 'IDE', categoria_en: 'IDE',
        desc_pt: 'A primeira IDE agêntica do mundo, que combina IA contextual com fluxos de automação de código incríveis.', 
        desc_en: 'The world\'s first agentic IDE, combining contextual AI with incredible code automation workflows.', 
        link: 'https://codeium.com/windsurf'
    },
    { 
        nivel: 'Verde', objetivo: 'Automação', custo: 'Proprietário', controle: 'Solução pronta', 
        ferramenta: 'GitHub Copilot', 
        categoria_pt: 'IDE', categoria_en: 'IDE',
        desc_pt: 'Excelente para automação cotidiana de trechos de código recorrentes e refatorações automáticas simples.', 
        desc_en: 'Excellent for everyday automation of recurring code snippets and simple automatic refactoring.', 
        link: 'https://github.com/features/copilot'
    },

    // --- AMARELO (Desafio) ---
    { 
        nivel: 'Amarelo', objetivo: 'Colaboração', custo: 'Open-source', controle: 'Flexibilidade', 
        ferramenta: 'Zed', 
        categoria_pt: 'IDE', categoria_en: 'IDE',
        desc_pt: 'Editor de código ultra-rápido, open-source e focado em colaboração remota fluida com suporte nativo a IA.', 
        desc_en: 'Ultra-fast, open-source code editor focused on fluid remote collaboration with native AI support.', 
        link: 'https://zed.dev/'
    },
    { 
        nivel: 'Amarelo', objetivo: 'Colaboração', custo: 'Open-source', controle: 'Solução pronta', 
        ferramenta: 'Continue.dev', 
        categoria_pt: 'IDE', categoria_en: 'IDE',
        desc_pt: 'Extensão open-source incrível que permite integrar qualquer LLM local ou comercial diretamente ao VS Code/JetBrains.', 
        desc_en: 'Amazing open-source extension that lets you integrate any local or commercial LLM directly into VS Code/JetBrains.', 
        link: 'https://www.continue.dev/'
    },
    { 
        nivel: 'Amarelo', objetivo: 'Colaboração', custo: 'Proprietário', controle: 'Flexibilidade', 
        ferramenta: 'AntigravityRef', 
        categoria_pt: 'Agente autônomo', categoria_en: 'Autonomous agent',
        desc_pt: 'Ferramenta agêntica inovadora de codificação corporativa que aprimora o trabalho em equipe e análises profundas.', 
        desc_en: 'Innovative enterprise coding agentic tool that enhances teamwork and deep analysis.', 
        link: 'https://github.com/'
    },
    { 
        nivel: 'Amarelo', objetivo: 'Colaboração', custo: 'Proprietário', controle: 'Solução pronta', 
        ferramenta: 'Codex', 
        categoria_pt: 'IDE', categoria_en: 'IDE',
        desc_pt: 'Modelo de linguagem especializado da OpenAI que serve como motor inteligente para ferramentas colaborativas de desenvolvimento.', 
        desc_en: 'OpenAI\'s specialized language model that serves as the smart engine for collaborative development tools.', 
        link: 'https://openai.com/blog/openai-codex'
    },
    { 
        nivel: 'Amarelo', objetivo: 'Prototipagem', custo: 'Open-source', controle: 'Flexibilidade', 
        ferramenta: 'Roo Code', 
        categoria_pt: 'IDE', categoria_en: 'IDE',
        desc_pt: 'Extensão de IA altamente customizável para VS Code que suporta instruções e regras personalizadas por projeto.', 
        desc_en: 'Highly customizable AI extension for VS Code supporting custom system prompts and per-project instructions.', 
        link: 'https://github.com/RooVetGit/Roo-Code'
    },
    { 
        nivel: 'Amarelo', objetivo: 'Prototipagem', custo: 'Open-source', controle: 'Solução pronta', 
        ferramenta: 'Cline', 
        categoria_pt: 'IDE', categoria_en: 'IDE',
        desc_pt: 'Agente de IA autônomo de código aberto que lê arquivos, roda comandos e cria aplicações passo a passo no seu VS Code.', 
        desc_en: 'Autonomous open-source AI agent that reads files, runs terminal commands, and builds apps step-by-step in your VS Code.', 
        link: 'https://github.com/cline/cline'
    },
    { 
        nivel: 'Amarelo', objetivo: 'Prototipagem', custo: 'Proprietário', controle: 'Flexibilidade', 
        ferramenta: 'Replit Agent', 
        categoria_pt: 'Plataforma', categoria_en: 'Platform',
        desc_pt: 'Agente potente da Replit que cria aplicações completas em segundos apenas a partir da sua descrição textual.', 
        desc_en: 'Powerful agent by Replit that builds entire applications from scratch in seconds based on your text descriptions.', 
        link: 'https://replit.com/'
    },
    { 
        nivel: 'Amarelo', objetivo: 'Prototipagem', custo: 'Proprietário', controle: 'Solução pronta', 
        ferramenta: 'CodeConductor', 
        categoria_pt: 'Plataforma', categoria_en: 'Platform',
        desc_pt: 'Uma plataforma que simplifica a prototipagem de produtos de software complexos através de interações guiadas por IA.', 
        desc_en: 'A platform that simplifies the prototyping of complex software products through AI-guided interactions.', 
        link: 'https://codeconductor.io/'
    },
    { 
        nivel: 'Amarelo', objetivo: 'Automação', custo: 'Open-source', controle: 'Flexibilidade', 
        ferramenta: 'Aider', 
        categoria_pt: 'CLI', categoria_en: 'CLI',
        desc_pt: 'Ferramenta de programação pareada por IA no terminal que sincroniza de forma fluida com repositórios Git.', 
        desc_en: 'AI pair programming tool in the terminal that seamlessly synchronizes with Git repositories.', 
        link: 'https://aider.chat/'
    },
    { 
        nivel: 'Amarelo', objetivo: 'Automação', custo: 'Open-source', controle: 'Solução pronta', 
        ferramenta: 'Cline', 
        categoria_pt: 'IDE', categoria_en: 'IDE',
        desc_pt: 'Permite orquestrar e testar fluxos repetitivos de automação de desenvolvimento com controle direto de arquivos.', 
        desc_en: 'Allows orchestrating and testing repetitive development automation flows with direct file control.', 
        link: 'https://github.com/cline/cline'
    },
    { 
        nivel: 'Amarelo', objetivo: 'Automação', custo: 'Proprietário', controle: 'Flexibilidade', 
        ferramenta: 'Claude Code', 
        categoria_pt: 'CLI', categoria_en: 'CLI',
        desc_pt: 'Agente de IA interativo da Anthropic focado no terminal, capaz de entender, criar e automatizar fluxos complexos de código.', 
        desc_en: 'Anthropic\'s interactive agent focused on the terminal, capable of understanding, creating, and automating complex code workflows.', 
        link: 'https://support.anthropic.com/'
    },
    { 
        nivel: 'Amarelo', objetivo: 'Automação', custo: 'Proprietário', controle: 'Solução pronta', 
        ferramenta: 'Jules', 
        categoria_pt: 'Agente autônomo', categoria_en: 'Autonomous agent',
        desc_pt: 'Assistente corporativo inteligente proprietário ideal para automação de tarefas rotineiras de desenvolvimento de software.', 
        desc_en: 'Proprietary smart enterprise assistant ideal for automating routine software development tasks.', 
        link: 'https://github.com/'
    },

    // --- VERMELHO (Complexo) ---
    { 
        nivel: 'Vermelho', objetivo: 'Colaboração', custo: 'Open-source', controle: 'Flexibilidade', 
        ferramenta: 'CrewAI', 
        categoria_pt: 'Framework', categoria_en: 'Framework',
        desc_pt: 'Framework avançado para orquestração de agentes autônomos de IA que trabalham de forma colaborativa.', 
        desc_en: 'Advanced framework for orchestrating autonomous AI agents that work collaboratively together.', 
        link: 'https://www.crewai.com/'
    },
    { 
        nivel: 'Vermelho', objetivo: 'Colaboração', custo: 'Open-source', controle: 'Solução pronta', 
        ferramenta: 'n8n com IA', 
        categoria_pt: 'Plataforma', categoria_en: 'Platform',
        desc_pt: 'Poderosa plataforma de automação visual auto-hospedada com nós de IA avançados para fluxos colaborativos integrados.', 
        desc_en: 'Powerful self-hosted visual automation platform with advanced AI nodes for integrated collaborative workflows.', 
        link: 'https://n8n.io/'
    },
    { 
        nivel: 'Vermelho', objetivo: 'Colaboração', custo: 'Proprietário', controle: 'Flexibilidade', 
        ferramenta: 'Microsoft Agent Framework', 
        categoria_pt: 'Framework', categoria_en: 'Framework',
        desc_pt: 'Framework corporativo robusto para construir e integrar agentes inteligentes em ecossistemas de software escaláveis.', 
        desc_en: 'Robust enterprise framework to build and integrate smart agents into scalable software ecosystems.', 
        link: 'https://github.com/microsoft/'
    },
    { 
        nivel: 'Vermelho', objetivo: 'Colaboração', custo: 'Proprietário', controle: 'Solução pronta', 
        ferramenta: 'Kiro', 
        categoria_pt: 'Agente autônomo', categoria_en: 'Autonomous agent',
        desc_pt: 'Plataforma avançada de engenharia de software autônoma e colaborativa para equipes de alta performance.', 
        desc_en: 'Advanced autonomous and collaborative software engineering platform for high-performance teams.', 
        link: 'https://github.com/'
    },
    { 
        nivel: 'Vermelho', objetivo: 'Prototipagem', custo: 'Open-source', controle: 'Flexibilidade', 
        ferramenta: 'LangGraph', 
        categoria_pt: 'Framework', categoria_en: 'Framework',
        desc_pt: 'Biblioteca para construir aplicações multi-agentes cíclicas e baseadas em grafos de estado, fornecendo controle cirúrgico.', 
        desc_en: 'Library for building stateful, multi-actor cyclic agent applications, providing surgical control over flow.', 
        link: 'https://www.langchain.com/langgraph'
    },
    { 
        nivel: 'Vermelho', objetivo: 'Prototipagem', custo: 'Open-source', controle: 'Solução pronta', 
        ferramenta: 'OpenHands', 
        categoria_pt: 'Agente autônomo', categoria_en: 'Autonomous agent',
        desc_pt: 'Agente de software open-source totalmente autônomo projetado para resolver bugs e testar protótipos complexos.', 
        desc_en: 'Fully autonomous open-source software agent designed to fix bugs and test complex prototypes.', 
        link: 'https://github.com/All-Hands-AI/OpenHands'
    },
    { 
        nivel: 'Vermelho', objetivo: 'Prototipagem', custo: 'Proprietário', controle: 'Flexibilidade', 
        ferramenta: 'OpenAI Agents SDK', 
        categoria_pt: 'Framework', categoria_en: 'Framework',
        desc_pt: 'SDK oficial da OpenAI para projetar e prototipar agentes autônomos modulares em cima de seus modelos principais.', 
        desc_en: 'Official OpenAI SDK to design and prototype modular autonomous agents on top of their core models.', 
        link: 'https://github.com/openai/openai-agents-sdk'
    },
    { 
        nivel: 'Vermelho', objetivo: 'Prototipagem', custo: 'Proprietário', controle: 'Solução pronta', 
        ferramenta: 'Devin', 
        categoria_pt: 'Agente autônomo', categoria_en: 'Autonomous agent',
        desc_pt: 'O primeiro engenheiro de software de IA totalmente autônomo do mundo, capaz de criar e implantar protótipos ponta a ponta.', 
        desc_en: 'The world\'s first fully autonomous AI software engineer, capable of creating and deploying prototypes end-to-end.', 
        link: 'https://www.cognition.ai/'
    },
    { 
        nivel: 'Vermelho', objetivo: 'Automação', custo: 'Open-source', controle: 'Flexibilidade', 
        ferramenta: 'LlamaIndex', 
        categoria_pt: 'Framework', categoria_en: 'Framework',
        desc_pt: 'Estrutura de dados robusta para conectar fontes de dados privadas com LLMs, ideal para automação de IA contextual complexa.', 
        desc_en: 'Robust data framework to connect private data sources with LLMs, ideal for complex contextual AI automation.', 
        link: 'https://www.llamaindex.ai/'
    },
    { 
        nivel: 'Vermelho', objetivo: 'Automação', custo: 'Open-source', controle: 'Solução pronta', 
        ferramenta: 'OpenHands', 
        categoria_pt: 'Agente autônomo', categoria_en: 'Autonomous agent',
        desc_pt: 'Plataforma agentic open-source excelente para orquestrar automações em sandbox e pipelines complexos.', 
        desc_en: 'Open-source agentic platform excellent for orchestrating sandbox automations and complex pipelines.', 
        link: 'https://github.com/All-Hands-AI/OpenHands'
    },
    { 
        nivel: 'Vermelho', objetivo: 'Automação', custo: 'Proprietário', controle: 'Flexibilidade', 
        ferramenta: 'OpenAI Agents SDK', 
        categoria_pt: 'Framework', categoria_en: 'Framework',
        desc_pt: 'Permite automatizar interações complexas de API de maneira flexível e estruturada usando agentes inteligentes.', 
        desc_en: 'Enables automating complex API interactions in a flexible and structured manner using intelligent agents.', 
        link: 'https://github.com/openai/openai-agents-sdk'
    },
    { 
        nivel: 'Vermelho', objetivo: 'Automação', custo: 'Proprietário', controle: 'Solução pronta', 
        ferramenta: 'Devin', 
        categoria_pt: 'Agente autônomo', categoria_en: 'Autonomous agent',
        desc_pt: 'Ideal para automatizar migrações de código complexas e execuções completas de pipelines de engenharia de software.', 
        desc_en: 'Ideal for automating complex code migrations and full executions of software engineering pipelines.', 
        link: 'https://www.cognition.ai/'
    }
];

// Metadados adicionais ricos de cada ferramenta
const toolMetadata = {
    'Gemini CLI': {
        desenvolvedor: 'Google / Community',
        plataforma_pt: 'CLI (Linha de Comando)',
        plataforma_en: 'CLI (Command Line)',
        custo_pt: 'Grátis (Requer chave de API própria)',
        custo_en: 'Free (Requires own API Key)',
        licenca: 'Apache 2.0 (Open-Source)',
        interface_pt: 'Interface de Linha de Comando (CLI)',
        interface_en: 'Command Line Interface (CLI)',
        usabilidade_pt: 'Direta e leve, ideal para desenvolvedores de terminal',
        usabilidade_en: 'Direct and lightweight, ideal for terminal developers',
        intervencao_pt: 'Total. O usuário interage e modifica os comandos diretamente no terminal',
        intervencao_en: 'Total. The user interacts and modifies commands directly in the terminal'
    },
    'Bolt.new': {
        desenvolvedor: 'StackBlitz',
        plataforma_pt: 'Web (Navegador)',
        plataforma_en: 'Web (Browser)',
        custo_pt: 'Grátis (Limites diários) / Planos pagos a partir de US$ 9/mês',
        custo_en: 'Free (Daily limits) / Paid plans starting at $9/month',
        licenca: 'Proprietária (Núcleo Open-Source)',
        interface_pt: 'Plataforma Sandbox Web',
        interface_en: 'Web Sandbox Platform',
        usabilidade_pt: 'Excelente. Ambiente de desenvolvimento web completo sem configurações manuais',
        usabilidade_en: 'Excellent. Complete web development environment without manual configuration',
        intervencao_pt: 'Total. Possui editor de código completo integrado no navegador',
        intervencao_en: 'Total. Features a complete in-browser code editor'
    },
    'Cursor': {
        desenvolvedor: 'Anysphere',
        plataforma_pt: 'Desktop (Windows, macOS, Linux)',
        plataforma_en: 'Desktop (Windows, macOS, Linux)',
        custo_pt: 'Grátis (Uso básico) / Pro por US$ 20/mês',
        custo_en: 'Free (Basic usage) / Pro for $20/month',
        licenca: 'Proprietária',
        interface_pt: 'IDE (Editor de Código)',
        interface_en: 'IDE (Code Editor)',
        usabilidade_pt: 'Excepcional. Baseado no VS Code, oferecendo transição imediata e natural',
        usabilidade_en: 'Exceptional. Based on VS Code, offering an immediate and natural transition',
        intervencao_pt: 'Total. Editor de código completo onde o desenvolvedor escreve e edita livremente',
        intervencao_en: 'Total. Full-fledged code editor where developers write and edit freely'
    },
    'GitHub Copilot': {
        desenvolvedor: 'GitHub / Microsoft',
        plataforma_pt: 'IDE Extension (VS Code, JetBrains, Visual Studio, Neovim)',
        plataforma_en: 'IDE Extension (VS Code, JetBrains, Visual Studio, Neovim)',
        custo_pt: 'US$ 10/mês (Individual) ou US$ 19/mês (Business)',
        custo_en: '$10/month (Individual) or $19/month (Business)',
        licenca: 'Proprietária',
        interface_pt: 'Extensão de IDE',
        interface_en: 'IDE Extension',
        usabilidade_pt: 'Excelente. Integrado ao editor, oferecendo completamento de código em tempo real',
        usabilidade_en: 'Excellent. Integrated into the editor, offering real-time code completion',
        intervencao_pt: 'Total. Sugestões aparecem no editor e podem ser aceitas, rejeitadas ou modificadas',
        intervencao_en: 'Total. Suggestions appear in the editor and can be accepted, rejected, or modified'
    },
    'Lovable': {
        desenvolvedor: 'Lovable Co.',
        plataforma_pt: 'Web (Navegador)',
        plataforma_en: 'Web (Browser)',
        custo_pt: 'Grátis (Uso básico) / Planos premium a partir de US$ 20/mês',
        custo_en: 'Free (Basic usage) / Premium plans starting at $20/month',
        licenca: 'Proprietária',
        interface_pt: 'Plataforma No-Code/Low-Code com IA',
        interface_en: 'AI No-Code/Low-Code Platform',
        usabilidade_pt: 'Excepcional. Construção visual rica em tempo real orientada a chat',
        usabilidade_en: 'Exceptional. Rich visual real-time chat-oriented building',
        intervencao_pt: 'Sim. Permite exportar para o GitHub e editar código diretamente',
        intervencao_en: 'Yes. Allows exporting to GitHub and editing code directly'
    },
    'v0 by Vercel': {
        desenvolvedor: 'Vercel',
        plataforma_pt: 'Web (Navegador)',
        plataforma_en: 'Web (Browser)',
        custo_pt: 'Grátis (200 créditos premium/mês) / Pro por US$ 20/mês',
        custo_en: 'Free (200 premium credits/month) / Pro for $20/month',
        licenca: 'Proprietária',
        interface_pt: 'Plataforma de UI Generativa Web',
        interface_en: 'Web Generative UI Platform',
        usabilidade_pt: 'Extraordinária. Geração visual instantânea de componentes React e Tailwind',
        usabilidade_en: 'Extraordinary. Instant visual generation of React and Tailwind components',
        intervencao_pt: 'Sim. Permite copiar o código gerado ou intervir via prompts adicionais',
        intervencao_en: 'Yes. Allows copying generated code or intervening via additional prompts'
    },
    'Windsurf': {
        desenvolvedor: 'Codeium',
        plataforma_pt: 'Desktop (Windows, macOS, Linux)',
        plataforma_en: 'Desktop (Windows, macOS, Linux)',
        custo_pt: 'Grátis (Uso básico) / Pro por US$ 15/mês',
        custo_en: 'Free (Basic usage) / Pro for $15/month',
        licenca: 'Proprietária',
        interface_pt: 'IDE Agêntica',
        interface_en: 'Agentic IDE',
        usabilidade_pt: 'Fantástica. Integração profunda entre editor e agente inteligente (Cascade)',
        usabilidade_en: 'Fantastic. Deep integration between editor and smart agent (Cascade)',
        intervencao_pt: 'Total. Editor de código local com total liberdade para alterar arquivos',
        intervencao_en: 'Total. Local code editor with full freedom to modify files'
    },
    'Zed': {
        desenvolvedor: 'Zed Industries',
        plataforma_pt: 'Desktop (macOS, Linux, Windows em Beta)',
        plataforma_en: 'Desktop (macOS, Linux, Windows in Beta)',
        custo_pt: 'Grátis (Código Aberto)',
        custo_en: 'Free (Open-Source)',
        licenca: 'GPL-3.0 / Apache 2.0 (Open-Source)',
        interface_pt: 'IDE (Editor de Código de Alto Desempenho)',
        interface_en: 'IDE (High Performance Code Editor)',
        usabilidade_pt: 'Excelente. Ultra-rápido, escrito em Rust, com suporte nativo a IA',
        usabilidade_en: 'Excellent. Ultra-fast, written in Rust, with native AI support',
        intervencao_pt: 'Total. Editor de arquivos de código tradicionais com controle local',
        intervencao_en: 'Total. Traditional code file editor with local control'
    },
    'Continue.dev': {
        desenvolvedor: 'Continue Dev, Inc.',
        plataforma_pt: 'IDE Extension (VS Code, JetBrains)',
        plataforma_en: 'IDE Extension (VS Code, JetBrains)',
        custo_pt: 'Grátis (Código Aberto)',
        custo_en: 'Free (Open-Source)',
        licenca: 'Apache 2.0 (Open-Source)',
        interface_pt: 'Extensão de Assistente de IDE',
        interface_en: 'IDE Assistant Extension',
        usabilidade_pt: 'Alta. Painel lateral amigável e atalhos rápidos integrados ao editor',
        usabilidade_en: 'High. Friendly side panel and quick shortcuts integrated into the editor',
        intervencao_pt: 'Total. Insere e altera trechos de código diretamente no arquivo ativo',
        intervencao_en: 'Total. Inserts and modifies code snippets directly in the active file'
    },
    'AntigravityRef': {
        desenvolvedor: 'Google DeepMind (Advanced Agentic Coding team)',
        plataforma_pt: 'IDE / Agente CLI',
        plataforma_en: 'IDE / CLI Agent',
        custo_pt: 'Sob consulta (Corporativo)',
        custo_en: 'On request (Enterprise)',
        licenca: 'Proprietária',
        interface_pt: 'Agente de Engenharia de Software Autônomo',
        interface_en: 'Autonomous Software Engineering Agent',
        usabilidade_pt: 'Muito alta, com fluxos agênticos avançados e interface de controle',
        usabilidade_en: 'Very high, with advanced agentic workflows and control interface',
        intervencao_pt: 'Total. Permite rever e ajustar planos de alteração e intervir nos arquivos gerados',
        intervencao_en: 'Total. Allows reviewing and adjusting change plans and intervening in generated files'
    },
    'Codex': {
        desenvolvedor: 'OpenAI',
        plataforma_pt: 'Nuvem (API)',
        plataforma_en: 'Cloud (API)',
        custo_pt: 'Pago por uso de API (Descontinuado/Substituído por modelos GPT-4o)',
        custo_en: 'Paid per API usage (Deprecated/Replaced by GPT-4o models)',
        licenca: 'Proprietária',
        interface_pt: 'API de Engine de IA',
        interface_en: 'AI Engine API',
        usabilidade_pt: 'Requer integração via código (ideal para programadores)',
        usabilidade_en: 'Requires integration via code (ideal for developers)',
        intervencao_pt: 'Total. Como é uma API, o desenvolvedor consome e gerencia o código recebido como quiser',
        intervencao_en: 'Total. As an API, the developer consumes and manages the received code as desired'
    },
    'Roo Code': {
        desenvolvedor: 'RooVetGit / Open Source',
        plataforma_pt: 'IDE Extension (VS Code)',
        plataforma_en: 'IDE Extension (VS Code)',
        custo_pt: 'Grátis (Código Aberto, paga apenas consumo de API)',
        custo_en: 'Free (Open-source, only pay for API usage)',
        licenca: 'MIT (Open-Source)',
        interface_pt: 'Extensão de IDE (Agente Interativo)',
        interface_en: 'IDE Extension (Interactive Agent)',
        usabilidade_pt: 'Alta. Integração de chat no VS Code com permissões dinâmicas de arquivos',
        usabilidade_en: 'High. Chat integration in VS Code with dynamic file permissions',
        intervencao_pt: 'Total. O agente edita arquivos com sua supervisão constante',
        intervencao_en: 'Total. The agent edits files with your constant supervision'
    },
    'Cline': {
        desenvolvedor: 'Cline / Open Source',
        plataforma_pt: 'IDE Extension (VS Code)',
        plataforma_en: 'IDE Extension (VS Code)',
        custo_pt: 'Grátis (Código Aberto, paga apenas consumo de API)',
        custo_en: 'Free (Open-source, only pay for API usage)',
        licenca: 'Apache 2.0 (Open-Source)',
        interface_pt: 'Extensão de IDE (Agente de Software Autônomo)',
        interface_en: 'IDE Extension (Autonomous Software Agent)',
        usabilidade_pt: 'Muito boa. Painel lateral poderoso no VS Code com console de aprovação de ações',
        usabilidade_en: 'Very good. Powerful sidebar in VS Code with actions approval console',
        intervencao_pt: 'Total. Permite aprovar, rejeitar ou intervir em cada alteração de arquivo sugerida',
        intervencao_en: 'Total. Allows approving, rejecting, or intervening in every suggested file change'
    },
    'Replit Agent': {
        desenvolvedor: 'Replit',
        plataforma_pt: 'Web (Navegador, integrado ao Replit)',
        plataforma_en: 'Web (Browser, integrated into Replit)',
        custo_pt: 'Incluso no Replit Core (US$ 15-25/mês)',
        custo_en: 'Included in Replit Core ($15-25/month)',
        licenca: 'Proprietária',
        interface_pt: 'IDE Web / Plataforma Cloud Agêntica',
        interface_en: 'Web IDE / Agentic Cloud Platform',
        usabilidade_pt: 'Excepcional. Criação e publicação rápida a partir de prompts naturais',
        usabilidade_en: 'Exceptional. Rapid creation and publication from natural prompts',
        intervencao_pt: 'Total. Workspace completo online editável a qualquer momento',
        intervencao_en: 'Total. Complete online workspace editable at any time'
    },
    'CodeConductor': {
        desenvolvedor: 'CodeConductor Co.',
        plataforma_pt: 'Web (Navegador)',
        plataforma_en: 'Web (Browser)',
        custo_pt: 'Planos comerciais (Foco em empresas e startups)',
        custo_en: 'Commercial plans (Focused on enterprises and startups)',
        licenca: 'Proprietária',
        interface_pt: 'Plataforma Web Low-Code com IA',
        interface_en: 'AI Low-Code Web Platform',
        usabilidade_pt: 'Alta. Guia interativo visual voltado para gerentes de projeto',
        usabilidade_en: 'High. Visual interactive guide targeted at project managers',
        intervencao_pt: 'Sim. Permite exportar ou editar as soluções geradas de forma guiada',
        intervencao_en: 'Yes. Allows exporting or editing generated solutions in a guided manner'
    },
    'Aider': {
        desenvolvedor: 'Paul Gauthier / Open Source',
        plataforma_pt: 'CLI (Linha de Comando no Terminal)',
        plataforma_en: 'CLI (Terminal Command Line)',
        custo_pt: 'Grátis (Código Aberto, paga uso de tokens da API externa)',
        custo_en: 'Free (Open-source, only pays for external API tokens)',
        licenca: 'Apache 2.0 (Open-Source)',
        interface_pt: 'Interface de Linha de Comando com Pareamento de IA',
        interface_en: 'Command Line Interface with AI Pairing',
        usabilidade_pt: 'Excelente para quem gosta do terminal; integração automática com Git',
        usabilidade_en: 'Excellent for terminal lovers; automatic Git integration',
        intervencao_pt: 'Total. Edita arquivos locais e gera commits automáticos na sua branch',
        intervencao_en: 'Total. Edits local files and generates automatic commits in your branch'
    },
    'Claude Code': {
        desenvolvedor: 'Anthropic',
        plataforma_pt: 'CLI (Terminal)',
        plataforma_en: 'CLI (Terminal)',
        custo_pt: 'Cobrado por tokens consumidos (Estágio de Beta Pública)',
        custo_en: 'Charged per tokens consumed (Public Beta Stage)',
        licenca: 'Proprietária',
        interface_pt: 'CLI Agêntico Inteligente',
        interface_en: 'Intelligent Agentic CLI',
        usabilidade_pt: 'Excepcional para desenvolvedores experientes; comandos rápidos e precisos',
        usabilidade_en: 'Exceptional for experienced developers; fast and precise commands',
        intervencao_pt: 'Total. Lida com arquivos locais, comanda testes e aceita intervenção imediata',
        intervencao_en: 'Total. Handles local files, drives tests, and accepts immediate intervention'
    },
    'Jules': {
        desenvolvedor: 'GitHub / Microsoft',
        plataforma_pt: 'Web (Integração do GitHub Enterprise)',
        plataforma_en: 'Web (GitHub Enterprise Integration)',
        custo_pt: 'Sob consulta (Adicional corporativo)',
        custo_en: 'On request (Corporate add-on)',
        licenca: 'Proprietária',
        interface_pt: 'Agente Autônomo Integrado ao GitHub',
        interface_en: 'GitHub-Integrated Autonomous Agent',
        usabilidade_pt: 'Excelente para empresas. Funciona direto nos fluxos de Pull Request',
        usabilidade_en: 'Excellent for companies. Works directly within Pull Request workflows',
        intervencao_pt: 'Sim. Gera Pull Requests editáveis e revisáveis antes do merge',
        intervencao_en: 'Yes. Generates editable and reviewable Pull Requests before merging'
    },
    'CrewAI': {
        desenvolvedor: 'CrewAI, Inc. / Open Source',
        plataforma_pt: 'Biblioteca de Programação (Python / JavaScript)',
        plataforma_en: 'Coding Library (Python / JavaScript)',
        custo_pt: 'Grátis (Código Aberto)',
        custo_en: 'Free (Open-Source)',
        licenca: 'MIT (Open-Source)',
        interface_pt: 'Framework de Código de Orquestração Multi-Agente',
        interface_en: 'Multi-Agent Orchestration Code Framework',
        usabilidade_pt: 'Média. Requer programação de software, focado puramente em engenheiros',
        usabilidade_en: 'Medium. Requires software programming, purely focused on engineers',
        intervencao_pt: 'Absoluta. Você desenvolve e gerencia a lógica interna de cada agente',
        intervencao_en: 'Absolute. You develop and manage the internal logic of each agent'
    },
    'n8n com IA': {
        desenvolvedor: 'n8n.io',
        plataforma_pt: 'Web / Servidor (Auto-hospedado ou Cloud)',
        plataforma_en: 'Web / Server (Self-hosted or Cloud)',
        custo_pt: 'Grátis (Auto-hospedado de uso comunitário) / Planos Cloud de US$ 20/mês',
        custo_en: 'Free (Self-hosted community usage) / Cloud plans at $20/month',
        licenca: 'Faircode (Sustainable Use License)',
        interface_pt: 'Plataforma de Automação Visual Drag-and-Drop',
        interface_en: 'Drag-and-Drop Visual Automation Platform',
        usabilidade_pt: 'Muito Alta. Layout visual por nós extremamente compreensível',
        usabilidade_en: 'Very High. Node-based visual layout is extremely comprehensible',
        intervencao_pt: 'Sim. Permite programar nós de código customizados em JavaScript/Python',
        intervencao_en: 'Yes. Allows programming custom JavaScript/Python code nodes'
    },
    'Microsoft Agent Framework': {
        desenvolvedor: 'Microsoft',
        plataforma_pt: 'Biblioteca / SDK (Python / .NET)',
        plataforma_en: 'Library / SDK (Python / .NET)',
        custo_pt: 'Grátis (Código Aberto)',
        custo_en: 'Free (Open-Source)',
        licenca: 'MIT (Open-Source)',
        interface_pt: 'Framework de Desenvolvimento de Agentes',
        interface_en: 'Agent Development Framework',
        usabilidade_pt: 'Baixa/Média. Requer conhecimentos avançados de engenharia de software',
        usabilidade_en: 'Low/Medium. Requires advanced software engineering knowledge',
        intervencao_pt: 'Total. Controle absoluto de código e estrutura por parte do programador',
        intervencao_en: 'Total. Absolute control of code and structure by the programmer'
    },
    'Kiro': {
        desenvolvedor: 'Kiro Software',
        plataforma_pt: 'Web / Nuvem (Corporativo)',
        plataforma_en: 'Web / Cloud (Enterprise)',
        custo_pt: 'Sob consulta (Planos Empresariais)',
        custo_en: 'On request (Enterprise Plans)',
        licenca: 'Proprietária',
        interface_pt: 'Plataforma de Agentes de Engenharia Autônoma',
        interface_en: 'Autonomous Engineering Agent Platform',
        usabilidade_pt: 'Alta. Dashboard centralizado com gerenciamento de tarefas de TI',
        usabilidade_en: 'High. Centralized dashboard with IT task management',
        intervencao_pt: 'Sim. Integração direta e transparente com repositórios e branches Git',
        intervencao_en: 'Yes. Direct and transparent integration with Git repositories and branches'
    },
    'LangGraph': {
        desenvolvedor: 'LangChain Inc.',
        plataforma_pt: 'Biblioteca de Software (Python / TS)',
        plataforma_en: 'Software Library (Python / TS)',
        custo_pt: 'Grátis (Código Aberto)',
        custo_en: 'Free (Open-Source)',
        licenca: 'MIT (Open-Source)',
        interface_pt: 'Biblioteca de Orquestração Cíclica baseada em Grafos',
        interface_en: 'Graph-based Cyclic Orchestration Library',
        usabilidade_pt: 'Média/Baixa. Projetada para desenvolvedores de IA construírem fluxos complexos',
        usabilidade_en: 'Medium/Low. Designed for AI developers to build complex flows',
        intervencao_pt: 'Absoluta. Controle micro-estruturado de estados, loops e transições',
        intervencao_en: 'Absolute. Micro-structured control of states, loops, and transitions'
    },
    'OpenHands': {
        desenvolvedor: 'All-Hands AI / Community',
        plataforma_pt: 'Web (Docker Local / Nuvem)',
        plataforma_en: 'Web (Local Docker / Cloud)',
        custo_pt: 'Grátis (Código Aberto)',
        custo_en: 'Free (Open-Source)',
        licenca: 'MIT (Open-Source)',
        interface_pt: 'Agente de Engenharia Autônomo com Sandbox',
        interface_en: 'Autonomous Engineering Agent with Sandbox',
        usabilidade_pt: 'Muito boa. Interface web completa com console, editor de arquivos e browser',
        usabilidade_en: 'Very good. Complete web interface with terminal, file editor, and browser',
        intervencao_pt: 'Total. Edite diretamente arquivos no editor web ou interaja via terminal',
        intervencao_en: 'Total. Directly edit files in the web editor or interact via terminal'
    },
    'OpenAI Agents SDK': {
        desenvolvedor: 'OpenAI',
        plataforma_pt: 'SDK / Biblioteca (Python)',
        plataforma_en: 'SDK / Library (Python)',
        custo_pt: 'Grátis (SDK aberto, paga créditos de API consumidos)',
        custo_en: 'Free (Open SDK, only pay for API credits consumed)',
        licenca: 'MIT (Open-Source)',
        interface_pt: 'Kit de Desenvolvimento de Agentes de IA',
        interface_en: 'AI Agent Development Kit',
        usabilidade_pt: 'Média. Voltado para criação ágil de protótipos de agentes programados',
        usabilidade_en: 'Medium. Oriented towards agile prototyping of programmed agents',
        intervencao_pt: 'Total. Controle absoluto de código Python no desenvolvimento do agente',
        intervencao_en: 'Total. Absolute control of Python code during agent development'
    },
    'Devin': {
        desenvolvedor: 'Cognition AI',
        plataforma_pt: 'Web (Navegador)',
        plataforma_en: 'Web (Browser)',
        custo_pt: 'Corporativo / Individual estimado em US$ 500+/mês',
        custo_en: 'Enterprise / Individual estimated at $500+/month',
        licenca: 'Proprietária',
        interface_pt: 'Agente de Software Autônomo de Ponta a Ponta',
        interface_en: 'End-to-End Autonomous Software Agent',
        usabilidade_pt: 'Excelente. Interface premium que mostra chat, terminal, editor e navegação gráfica',
        usabilidade_en: 'Excellent. Premium interface showing chat, terminal, editor, and graphical browsing',
        intervencao_pt: 'Total. Permite parar a execução, editar arquivos no workspace e continuar',
        intervencao_en: 'Total. Allows stopping execution, editing files in the workspace, and continuing'
    },
    'LlamaIndex': {
        desenvolvedor: 'LlamaIndex Inc.',
        plataforma_pt: 'Biblioteca de Software (Python / TS)',
        plataforma_en: 'Software Library (Python / TS)',
        custo_pt: 'Grátis (Código Aberto)',
        custo_en: 'Free (Open-Source)',
        licenca: 'MIT (Open-Source)',
        interface_pt: 'Framework de Conexão de Dados para IA',
        interface_en: 'Data Connection Framework for AI',
        usabilidade_pt: 'Média. Ótimas abstrações de dados para engenheiros de software',
        usabilidade_en: 'Medium. Excellent data abstractions for software engineers',
        intervencao_pt: 'Total. Você codifica toda a estrutura de RAG e agentes usando as APIs do framework',
        intervencao_en: 'Total. You code the entire RAG and agent structure using the framework\'s APIs'
    }
};

// i18n Functions
async function initI18n() {
    const navLang = navigator.language.toLowerCase();
    currentLang = navLang.startsWith('en') ? 'en' : 'pt';
    await loadTranslations(currentLang);
    updateLangUI();
    chatHistory = getInitialChatHistory(); // Set initial prompts in active lang
}

async function loadTranslations(lang) {
    try {
        const response = await fetch(`/translations_${lang}.json`);
        if (!response.ok) throw new Error('Translation not found');
        translations = await response.json();
        applyTranslations();
    } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to PT if EN fails somehow
        if (lang !== 'pt') {
            currentLang = 'pt';
            await loadTranslations('pt');
        }
    }
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[key]) {
            el.placeholder = translations[key];
        }
    });

    // Update Result Description if visible
    if (document.getElementById('step-result').classList.contains('active')) {
        updateResultDescription();
    }
}

window.toggleLanguage = async function() {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    await loadTranslations(currentLang);
    updateLangUI();
    
    // Reset initial chat history to new lang ONLY IF user hasn't typed yet, otherwise append system message?
    // Let's just update the first hidden system messages
    if (chatHistory.length > 0) {
        chatHistory[0].parts[0].text = translations['prompt.system'];
        chatHistory[1].parts[0].text = translations['prompt.system.ack'];
    }
}

function updateLangUI() {
    const label = document.getElementById('lang-label');
    label.textContent = currentLang.toUpperCase();
}

// Funções de Navegação do Wizard
window.nextStep = function(step) {
    if (validateStep(step)) {
        saveAnswer(step);
        document.getElementById(`step-${step}`).classList.remove('active');
        document.getElementById(`step-${step + 1}`).classList.add('active');
        currentStep++;
    }
}

window.prevStep = function(step) {
    document.getElementById(`step-${step}`).classList.remove('active');
    document.getElementById(`step-${step - 1}`).classList.add('active');
    currentStep--;
}

function validateStep(step) {
    if (step === 1) {
        const val = document.getElementById('skill-level').value;
        if (!val) { showToast(translations['error.step1']); return false; }
    } else if (step === 2) {
        const val = document.querySelector('input[name="objective"]:checked');
        if (!val) { showToast(translations['error.step2']); return false; }
    } else if (step === 3) {
        const val = document.querySelector('input[name="cost"]:checked');
        if (!val) { showToast(translations['error.step3']); return false; }
    } else if (step === 4) {
        const val = document.getElementById('control-level').value;
        if (!val) { showToast(translations['error.step4']); return false; }
    }
    return true;
}

function saveAnswer(step) {
    if (step === 1) answers.nivel = document.getElementById('skill-level').value;
    if (step === 2) answers.objetivo = document.querySelector('input[name="objective"]:checked').value;
    if (step === 3) answers.custo = document.querySelector('input[name="cost"]:checked').value;
    if (step === 4) answers.controle = document.getElementById('control-level').value;
}

function findAlternativeTool(primary) {
    if (!primary) return null;
    
    // Tenta encontrar uma ferramenta diferente com o mesmo nivel, objetivo e custo diferente
    let alt = decisionMatrix.find(item => 
        item.nivel === primary.nivel &&
        item.objetivo === primary.objetivo &&
        item.custo !== primary.custo &&
        item.ferramenta !== primary.ferramenta
    );
    
    // Se não encontrar, tenta qualquer outra ferramenta diferente com o mesmo nivel e objetivo
    if (!alt) {
        alt = decisionMatrix.find(item => 
            item.nivel === primary.nivel &&
            item.objetivo === primary.objetivo &&
            item.ferramenta !== primary.ferramenta
        );
    }
    
    // Se ainda não encontrar, tenta qualquer outra ferramenta com o mesmo nivel
    if (!alt) {
        alt = decisionMatrix.find(item => 
            item.nivel === primary.nivel &&
            item.ferramenta !== primary.ferramenta
        );
    }
    
    return alt;
}

window.submitWizard = function() {
    if (validateStep(4)) {
        saveAnswer(4);
        
        // Procurar na matriz
        const result = decisionMatrix.find(item => 
            item.nivel === answers.nivel &&
            item.objetivo === answers.objetivo &&
            item.custo === answers.custo &&
            item.controle === answers.controle
        );

        if (result) {
            document.getElementById('result-title').textContent = result.ferramenta;
            document.getElementById('result-link').href = result.link;
            
            // Store active result and alternative for translation updates
            window.activeResult = result;
            window.activeAlternative = findAlternativeTool(result);
            updateResultDescription();
            
            document.getElementById('step-4').classList.remove('active');
            document.getElementById('step-result').classList.add('active');
        } else {
            showToast(translations['error.notfound']);
        }
    }
}

function updateResultDescription() {
    if (window.activeResult) {
        const descKey = currentLang === 'en' ? 'desc_en' : 'desc_pt';
        document.getElementById('result-desc').textContent = window.activeResult[descKey];
        
        const catKey = currentLang === 'en' ? 'categoria_en' : 'categoria_pt';
        document.getElementById('result-category').textContent = window.activeResult[catKey];

        // Buscar metadados adicionais ricos
        const toolName = window.activeResult.ferramenta;
        const metadata = toolMetadata[toolName];
        if (metadata) {
            document.getElementById('result-developer').textContent = metadata.desenvolvedor;
            
            const platKey = currentLang === 'en' ? 'plataforma_en' : 'plataforma_pt';
            document.getElementById('result-platform').textContent = metadata[platKey];
            
            const costKey = currentLang === 'en' ? 'custo_en' : 'custo_pt';
            document.getElementById('result-cost').textContent = metadata[costKey];
            
            document.getElementById('result-license').textContent = metadata.licenca;
            
            const intKey = currentLang === 'en' ? 'interface_en' : 'interface_pt';
            document.getElementById('result-interface').textContent = metadata[intKey];
            
            const usabKey = currentLang === 'en' ? 'usabilidade_en' : 'usabilidade_pt';
            document.getElementById('result-usability').textContent = metadata[usabKey];
            
            const codeKey = currentLang === 'en' ? 'intervencao_en' : 'intervencao_pt';
            document.getElementById('result-code-intervention').textContent = metadata[codeKey];
        }

        // Buscar e renderizar a ferramenta alternativa
        if (window.activeAlternative) {
            document.querySelector('.alternative-suggestion').style.display = 'block';
            document.getElementById('alt-title').textContent = window.activeAlternative.ferramenta;
            document.getElementById('alt-desc').textContent = window.activeAlternative[descKey];
            document.getElementById('alt-category').textContent = window.activeAlternative[catKey];
            document.getElementById('alt-link').href = window.activeAlternative.link;
        } else {
            document.querySelector('.alternative-suggestion').style.display = 'none';
        }
    }
}

window.restartWizard = function() {
    // Reset answers
    answers = { nivel: '', objetivo: '', custo: '', controle: '' };
    currentStep = 1;
    window.activeResult = null;
    window.activeAlternative = null;
    
    // Reset inputs
    document.getElementById('skill-level').value = "";
    const radiosObj = document.querySelectorAll('input[name="objective"]');
    radiosObj.forEach(r => r.checked = false);
    const radiosCost = document.querySelectorAll('input[name="cost"]');
    radiosCost.forEach(r => r.checked = false);
    document.getElementById('control-level').value = "";
    document.getElementById('result-category').textContent = "";
    document.getElementById('alt-category').textContent = "";

    // Reset UI
    document.getElementById('step-result').classList.remove('active');
    document.getElementById('step-1').classList.add('active');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('show');
}

// Lógica da IA (Modal)
window.openHelpModal = function() {
    document.getElementById('ai-modal').classList.add('open');
    document.getElementById('chat-input').focus();
}

window.closeHelpModal = function() {
    document.getElementById('ai-modal').classList.remove('open');
}

function getStepContext() {
    if (document.getElementById('step-result').classList.contains('active')) {
        const primary = window.activeResult ? window.activeResult.ferramenta : 'Nenhuma';
        const alternative = window.activeAlternative ? window.activeAlternative.ferramenta : 'Nenhuma';
        const langText = currentLang === 'en' 
            ? `The primary recommended tool is: ${primary}. The alternative recommended tool is: ${alternative}.` 
            : `A ferramenta principal recomendada foi: ${primary}. A ferramenta alternativa recomendada foi: ${alternative}.`;
        return (translations['context.result'] || '') + ' ' + langText;
    }
    if (currentStep === 1) return translations['context.step1'];
    if (currentStep === 2) return translations['context.step2'];
    if (currentStep === 3) return translations['context.step3'];
    if (currentStep === 4) return translations['context.step4'];
    return translations['context.result'];
}

window.handleChatKeyPress = function(e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
}

window.sendChatMessage = async function() {
    const inputField = document.getElementById('chat-input');
    const message = inputField.value.trim();
    if (!message) return;

    appendMessage('user', message);
    inputField.value = '';
    
    const sendBtn = document.querySelector('.btn-send');
    sendBtn.disabled = true;
    
    const contextStr = getStepContext();
    const promptContext = translations['prompt.context'] || 'Contexto atual do usuário:';
    const promptQuestion = translations['prompt.question'] || 'Dúvida do usuário:';
    
    const finalPrompt = `${promptContext} ${contextStr}\n${promptQuestion} ${message}`;

    // Add user message to history
    chatHistory.push({
        role: "user",
        parts: [{ text: finalPrompt }]
    });

    const typingIndicator = showTypingIndicator();
    
    // Ler chave do import.meta.env do Vite
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
        removeElement(typingIndicator);
        appendMessage('ai', translations['error.nokey']);
        sendBtn.disabled = false;
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: chatHistory,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000
                }
            })
        });

        removeElement(typingIndicator);

        if (response.status === 429) {
            appendMessage('ai', translations['error.daily_limit']);
            // Remove the failed user message from history
            chatHistory.pop();
        } else if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const data = await response.json();
            const aiResponseText = data.candidates[0].content.parts[0].text;
            
            appendMessage('ai', aiResponseText);
            
            // Add model response to history
            chatHistory.push({
                role: "model",
                parts: [{ text: aiResponseText }]
            });
        }
    } catch (error) {
        console.error("Erro Gemini API:", error);
        removeElement(typingIndicator);
        appendMessage('ai', translations['error.connection']);
        chatHistory.pop(); // Remove user message if failed
    } finally {
        sendBtn.disabled = false;
        scrollToBottom();
    }
}

function appendMessage(sender, text) {
    const chatContainer = document.getElementById('chat-container');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message');
    msgDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
    
    msgDiv.textContent = text;
    
    chatContainer.appendChild(msgDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const chatContainer = document.getElementById('chat-container');
    const indicatorDiv = document.createElement('div');
    indicatorDiv.classList.add('chat-message', 'ai-message', 'typing-indicator');
    
    for(let i=0; i<3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('typing-dot');
        indicatorDiv.appendChild(dot);
    }
    
    chatContainer.appendChild(indicatorDiv);
    scrollToBottom();
    return indicatorDiv;
}

function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

function scrollToBottom() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Inicializar i18n ao carregar
initI18n();

// Colocar funções no escopo global explicitamente se usar Vite type="module"
window.toggleLanguage = toggleLanguage;
window.openHelpModal = openHelpModal;
window.closeHelpModal = closeHelpModal;
window.sendChatMessage = sendChatMessage;
window.handleChatKeyPress = handleChatKeyPress;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitWizard = submitWizard;
window.restartWizard = restartWizard;

// Adicionar eventos para ocultar notificação ao preencher campo
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('skill-level').addEventListener('change', hideToast);
    document.getElementById('control-level').addEventListener('change', hideToast);
    document.querySelectorAll('input[name="objective"]').forEach(r => r.addEventListener('change', hideToast));
    document.querySelectorAll('input[name="cost"]').forEach(r => r.addEventListener('change', hideToast));
});
