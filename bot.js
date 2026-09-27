const mineflayer = require('mineflayer');

función createBot() {
    const bot = mineflayer.createBot({
        host: 'c00lkidd1279w.aternos.me', // <--- REEMPLAZA ESTO POR LA IP DE TU SERVER
        puerto: 19132, // Puerto predeterminado de Minecraft
        nombre de usuario: 'c00lkidd_bot.124', // Nombre genérico del bot/NPC dentro del juego
        version: false // Autodetecta la versión exacta del servidor (1.8 a 1.21+)
    });

    bot.on('spawn', () => {
        console.log(`[NPC] El bot ha aparecido correctamente en el mapa.`);
        // Si tu servidor No-Premium requiere contraseña, descomenta la línea de abajo:
        // setTimeout(() => bot.chat('/login'), 4000);
    });

    bot.on('login', () => {
        console.log(`[NPC] Conexión establecida con el servidor de Minecraft.`);
    });

    // Rutina automatizada del NPC: Buscar cofre, interactuar, cerrar y saltar (Cada 45 segundos)
    setInterval(async () => {
        si (!bot || !bot.entity) regresar;

        intentar {
            // 1. Localizar el bloque de cofre en una radio de 5 bloques
            const chestBlock = bot.findBlock({
                Coincidencia: bot.registro.blocksByName.chest.id,
                distancia máxima: 5
            });

            si (bloqueo de pecho) {
                console.log('[NPC] Interactuando con el contenedor cercano...');
                
                // 2. Abrir el contenedor (genera la animación y sonido físico en el servidor)
                const cofre = await bot.openChest(chestBlock);
                console.log('[NPC] Contenedor abierto.');
                
                // Mantener la interfaz abierta durante 2 segundos simulando actividad de inventario
                esperar nueva promesa(resolver => establecerTiempoDeEspera(resolver, 2000));
                
                // 3. Cerrar la interfaz del contenedor
                cofre.close();
                console.log('[NPC] Contenedor cerrado.');
            } demás {
                console.log('[NPC] Aviso: No se detectó ningún contenedor válido cerca.');
            }

            // 4. Ejecutar acción de salto físico para evitar la inactividad (Anti-AFK)
            esperar nueva Promise(resolver => establecerTimeout(resolver, 1000));
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
            console.log('[NPC] Acción anti-inactividad completada con éxito.');

        } capturar (error) {
            console.log(`[NPC] Error en el ciclo de ejecución: ${err.message}`);
        }
    }, 45000);

    // Sistema de autorreconexión segura tras expulsiones o reinicios del servidor
    bot.on('end', (reason) => {
        console.log(`[NPC] Conexión finalizada por: ${reason}. Reintentando en 25 segundos...`);
        setTimeout(createBot, 25000);
    });

    bot.on('error', (err) => console.log(`[NPC] Error crítico de red detectado: ${err}`));
}

crearBot();
