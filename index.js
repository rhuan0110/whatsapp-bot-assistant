// ====== LOG INICIAL ======
console.log("🤖 Iniciando bot - Clínica Veterinária...");

const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// ====== CRIA CLIENTE SEM LocalAuth ======
const client = new Client({
    puppeteer: { headless: true }
});

console.log("📦 Dependências carregadas");

// Map para armazenar estado dos chats
const chatState = new Map();

// Map para saber se já mostrou menu
const firstMessage = new Map();

// ====== FUNÇÃO MENU PRINCIPAL ======
function menuPrincipal() {
    return (
        "🐾 Olá, bem-vindo à nossa Clínica Veterinária!\n\n" +
        "Escolha uma opção digitando o número:\n" +
        "1️⃣ - Sobre a clínica\n" +
        "2️⃣ - Agendar retorno\n" +
        "3️⃣ - Agendar exame\n" +
        "4️⃣ - Agendar cirurgia\n" +
        "5️⃣ - Dicas de cuidados com pets\n" +
        "6️⃣ - Falar com atendente"
    );
}

// ====== EVENTO QR CODE ======
client.on("qr", (qr) => {
    console.log("🟢 QR Code gerado, escaneie no WhatsApp!");
    qrcode.generate(qr, { small: true });
});

// ====== EVENTO DE READY ======
client.on("ready", () => {
    console.log("✅ Bot conectado ao WhatsApp!");
});

// ====== EVENTO DE MENSAGEM ======
client.on("message", async (msg) => {
    const chatId = msg.from;
    const chat = msg.body.trim().toLowerCase();

    // ---- Se é a primeira mensagem do usuário, mostra o menu ----
    if (!firstMessage.get(chatId)) {
        msg.reply(menuPrincipal());
        firstMessage.set(chatId, true);
        return;
    }

    // ---- FLUXOS DE AGENDAMENTO ----
    if (chatState.get(chatId) === "agendar_retorno") {
        msg.reply(
            `✅ Agendamento de retorno recebido:\n"${msg.body}"\nNossa equipe confirmará em breve.`
        );
        chatState.delete(chatId);
        msg.reply(menuPrincipal()); // volta para o menu
        return;
    }

    if (chatState.get(chatId) === "agendar_exame") {
        msg.reply(
            `✅ Agendamento de exame recebido:\n"${msg.body}"\nEm breve entraremos em contato.`
        );
        chatState.delete(chatId);
        msg.reply(menuPrincipal());
        return;
    }

    if (chatState.get(chatId) === "agendar_cirurgia") {
        msg.reply(
            `✅ Agendamento de cirurgia recebido:\n"${msg.body}"\nUm veterinário confirmará todos os detalhes.`
        );
        chatState.delete(chatId);
        msg.reply(menuPrincipal());
        return;
    }

    // ---- MENU PRINCIPAL ----
    if (chat === "menu") {
        msg.reply(menuPrincipal());
        return;
    }

    // ---- OPÇÕES DO MENU ----
    else if (chat === "1") {
        msg.reply(
            "🏥 Nossa Clínica Veterinária oferece atendimento completo para seu pet, " +
            "com profissionais especializados em consultas, exames e cirurgias.\n\nDigite 'menu' para voltar ao início."
        );
        return;
    }

    else if (chat === "2") {
        msg.reply("📅 Envie o *nome do pet* e *data/horário desejado* para o retorno.");
        chatState.set(chatId, "agendar_retorno");
        return;
    }

    else if (chat === "3") {
        msg.reply("🧪 Envie o *nome do pet*, *tipo de exame* e *data/horário desejado*.");
        chatState.set(chatId, "agendar_exame");
        return;
    }

    else if (chat === "4") {
        msg.reply("🔪 Envie o *nome do pet*, *tipo de cirurgia* e *data/horário desejado*.");
        chatState.set(chatId, "agendar_cirurgia");
        return;
    }

    else if (chat === "5") {
        msg.reply(
            "🐶🐱 Dicas enviadas com sucesso!\n" +
            "- Mantenha a vacinação em dia.\n" +
            "- Alimente seu pet corretamente.\n" +
            "- Consulte regularmente o veterinário.\n\nDigite 'menu' para voltar ao início."
        );
        return;
    }

    else if (chat === "6") {
        msg.reply(
            "📞 Um atendente humano entrará em contato em breve.\nMensagem enviada com sucesso!"
        );
        return;
    }

    // ---- RESPOSTA PADRÃO ----
    else {
        msg.reply("❓ Digite o número da opção que deseja ou 'menu' para voltar ao início.");
    }
});

// ====== INICIALIZA CLIENTE ======
client.initialize();
