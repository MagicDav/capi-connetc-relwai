import express from "express";
import passageirosRoutes from "./routes/passageiros.routes.js"; // use .js se estiver compilado

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

// Rotas principais
app.get("/", (req, res) => {
  res.send(`
    <h1>🚀 Connect REST API</h1>
    <h2>Available Routes</h2>
    <pre>
      GET, POST /passageiros
      GET, PUT, DELETE /passageiros/:id
    </pre>
  `.trim());
});

// Rotas de passageiros
app.use("/passageiros", passageirosRoutes);

// Inicia o servidor
app.listen(port, () => console.log(`App rodando na porta ${port}`));
