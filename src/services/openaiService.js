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
            - Devuelve SOLO la consulta SQL, sin explicaciones.
            - No agregues backticks, markdown ni texto adicional.
            - Si no puedes generar la consulta correctamente, devuelve: el porque.

            ### Esquema de la base de datos
            ${dbSchema}
        `;

        const completion = await client.chat.completions.create({
            model: "gpt-3.5-turbo", // O el modelo que desees
            temperature: 0.1,
            messages: [
                { role: "system", content: systemInstructions },
                { role: "user", content: userPrompt }
            ],
        });

        const rawResponse = completion.choices[0].message.content.trim();

        // if (!rawResponse || rawResponse.toUpperCase() === "ERROR") {
        //     return {
        //         generatedQuery: null,
        //         statusQuery: "error",
        //         MessageQuery: "No pude generar una consulta SQL válida basada en tu solicitud.",
        //     };
        // }

        return {
            generatedQuery: rawResponse,
            statusQuery: "success",
            MessageQuery: "Consulta generada correctamente.",
        };

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
