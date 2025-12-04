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
            - No agregues palabras reservadas para los nombres alias de las tablas como "if, IF" o cualquier palabra reservada de SQL
            - Que los ALIAS de tablas sean minimo de 4 letras
            - Si no puedes generar la consulta correctamente, devuelve: el porque.
            - Que la query tenga una validación tipo IF de si existe el dato relacionado en la otra tabla cuando haya cruces si no existe que ponga null

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


        // const rawResponse = completion.choices[0].message.content.trim();
        const rawResponse = response.output_text;

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
