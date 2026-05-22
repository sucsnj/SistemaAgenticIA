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
            
            // Store active result for translation updates
            window.activeResult = result;
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
    }
}

window.restartWizard = function() {
    // Reset answers
    answers = { nivel: '', objetivo: '', custo: '', controle: '' };
    currentStep = 1;
    window.activeResult = null;
    
    // Reset inputs
    document.getElementById('skill-level').value = "";
    const radiosObj = document.querySelectorAll('input[name="objective"]');
    radiosObj.forEach(r => r.checked = false);
    const radiosCost = document.querySelectorAll('input[name="cost"]');
    radiosCost.forEach(r => r.checked = false);
    document.getElementById('control-level').value = "";
    document.getElementById('result-category').textContent = "";

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
                    maxOutputTokens: 150
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
