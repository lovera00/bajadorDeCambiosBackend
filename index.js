import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

//configurar el cors para que este abierto a todo
import cors from "cors";



dotenv.config();

const app = express();
//configurar el cors para que este abierto a todo
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
    };
app.use(cors(corsOptions));
const port = process.env.PORT;

app.use(express.json()); // Para manejar JSON en las solicitudes

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.post("/chatgpt", async (req, res) => {
  if (!req.body.pregunta) {
    return res.status(400).json({ error: "No se proporcionó una pregunta" });
  }
  const respuesta = await preguntar(req.body.pregunta);
  res.json({ respuesta });
});

async function preguntar(message) {
    console.log(message);
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Deberas transformar los insultos del usuario, a comentarios formales, haciendo que los insultos se conviertan en formalidades",
        },
        { role: "user", content: message },
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 3000,
    });
    console.log(chatCompletion.choices[0].message.content);
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error al llamar a OpenAI:", error);
    return "Error al procesar la solicitud";
  }
}
