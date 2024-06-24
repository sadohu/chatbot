import { createBot, createProvider, createFlow, addKeyword, utils } from '@builderbot/bot';
import { MemoryDB as Database } from '@builderbot/bot';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

const PORT = process.env.PORT ?? 3008;

// Flujo de bienvenida
const welcomeFlow = addKeyword<Provider, Database>(['-hi', '-hello', '-hola'])
    .addAnswer(`🙌 Hello! Welcome to this Chatbot. Choose an option below:`)
    .addAnswer(
        [
            '1️⃣ *Type 1* for Flow 1',
            '2️⃣ *Type 2* for Flow 2',
        ].join('\n'),
        { capture: true },
        async (ctx, { gotoFlow }) => {
            const choice = ctx.body.trim();
            if (choice === '1') {
                return gotoFlow(flow1); // Redirige al Flujo 1
            } else if (choice === '2') {
                return gotoFlow(flow2); // Redirige al Flujo 2
            }
            return; // Si no es 1 o 2, permanece en el flujo de bienvenida
        }
    );

// Flujo 1
const flow1 = addKeyword<Provider, Database>('flow1')
    .addAnswer('Welcome to Flow 1! 🌟')
    .addAnswer('Type *back* to return to the Welcome message.', { capture: true }, async (ctx, { gotoFlow }) => {
        if (ctx.body.toLocaleLowerCase() === 'back') {
            return gotoFlow(welcomeFlow); // Regresa al flujo de bienvenida
        }
        return; // Permanece en el flujo 1 si no se escribe 'back'
    });

// Flujo 2
const flow4 = addKeyword<Provider, Database>('flow4')
    .addAnswer('Welcome to Flow 4! ✨')
    .addAnswer('Type *back* to return to the Welcome message.', { capture: true }, async (ctx, { gotoFlow }) => {
        console.log(ctx);
        if (ctx.body.toLocaleLowerCase() === 'back') {
            return gotoFlow(flow2); // Regresa al flujo de bienvenida
        }
        return; // Permanece en el flujo 2 si no se escribe 'back'
    });

// Flujo 2
const flow3 = addKeyword<Provider, Database>('flow3')
    .addAnswer('Welcome to Flow 3! ✨')
    .addAnswer('Type *back* to return to the Welcome message.', { capture: true }, async (ctx, { gotoFlow }) => {
        if (ctx.body.toLocaleLowerCase() === 'back') {
            return gotoFlow(flow2); // Regresa al flujo de bienvenida
        }
        return; // Permanece en el flujo 2 si no se escribe 'back'
    });
const flow2 = addKeyword<Provider, Database>(['-hi', '-hello', '-hola'])
    .addAnswer(`🙌 Hello! Welcome to flow 2. Choose an option below:`)
    .addAnswer(
        [
            '1️⃣ *Type 1* for Flow 4',
            '2️⃣ *Type 2* for Flow 3',
        ].join('\n'),
        { capture: true },
        async (ctx, { gotoFlow }) => {
            const choice = ctx.body.trim();
            if (choice === '1') {
                return gotoFlow(flow4); // Redirige al Flujo 1
            } else if (choice === '2') {
                return gotoFlow(flow3); // Redirige al Flujo 2
            } else if (choice === 'Back') {
                return gotoFlow(welcomeFlow);
            }
            return; // Si no es 1 o 2, permanece en el flujo de bienvenida
        }
    );


const main = async () => {
    const adapterFlow = createFlow([welcomeFlow, flow1, flow2, flow4]);
    const adapterProvider = createProvider(Provider);
    const adapterDB = new Database();

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    httpServer(+PORT);
};

main();
