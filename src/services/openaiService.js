// src/services/openaiService.js
const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Genera una consulta SQL basada en un prompt del usuario y el esquema de DB.
 */
async function generateQueryFromPrompt(userPrompt, dbSchema) {
    try {
        const systemInstructions = `
            Eres un generador de queries SQL para MariaDB. Tu tarea es convertir preguntas en lenguaje natural a queries SQL.
            Reglas estrictas:
            - No agregues backticks, markdown ni texto adicional.
            - No agregues palabras reservadas para los nombres alias de las tablas como "if, IF" o cualquier palabra reservada de SQL
            - Que los ALIAS de tablas sean minimo de 4 letras
            - Cuando se pregunte por algún nombre de persona, detecta cual es el nombre y cuales los apellidos y que la búsqueda sea con LIKE %% para que no haya errores en mayusculas o minúsculas
            - Si no puedes generar la consulta correctamente, devuelve: el porque.
            - Que la query tenga una validación tipo IF de si existe el dato relacionado en la otra tabla cuando haya cruces si no existe que ponga null
            - Recuerda que las columnas de los reportes vengan en español, ejemplo users.first_name AS Nombre, users.last_name AS Apellido, en caso de que no sepas a que se refiere, dejala como en la base de datos

            - Devuelve el resultado en formato json de la siguiente manera:
                {
                    "query": 'la_query_generada en caso de que no, que regrese null',
                    "mensaje": 'Mensaje amigable si fue generada con éxito, en caso de que no, que regrese un mensaje del por qué no la pudo generar',
                    "status": '200 si regresa la query, 500 si no pudo generarla'
                }

            ### Esquema de la base de datos
            ${dbSchema}
        `;

        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            input: [
                { role: "system", content: systemInstructions },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.1
        });


        const rawResponse = response.output_text;


        let parsedResponse;
        try {
            parsedResponse = JSON.parse(rawResponse);

            // Paso 4: Extraer las variables del objeto
            const query = parsedResponse.query;
            const mensaje = parsedResponse.mensaje;
            const status = parsedResponse.status;

            // O de forma más concisa con Destructuring:
            // const { query, mensaje, status } = JSON.parse(rawResponse);

            // Muestra las variables para verificar
            console.log("=========================");
            console.log("OPEN AI")
            console.log('Query:', query);
            console.log('Mensaje:', mensaje);
            console.log('Status:', status);
            console.log("=========================");
            

            return {
                generatedQuery: query,
                statusQuery: status,
                MessageQuery: mensaje,
            };

        } catch (e) {
            // Manejo de error si la IA no devuelve un JSON válido
            console.error("Error al parsear la respuesta JSON de la IA:", e);
            // Podrías devolver un error genérico al cliente en este caso.
            const query = null;
            const mensaje = "La IA no pudo generar una respuesta válida. Intenta reformular tu solicitud.";
            const status = 500;
        }

    } catch (err) {
        console.error("❌ Error en generateQueryFromPrompt:", err);

        return {
            generatedQuery: null,
            statusQuery: "error",
            MessageQuery: "Error interno al generar la consulta SQL.",
        };
    }
}

module.exports = { generateQueryFromPrompt };
