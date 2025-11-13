import express from "express";
import passageirosRoutes from "./routes/passageiros.routes";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

// Define routes
app.get("/", async (req, res) => {
  res.send(
    `
  <h1>🚀Connect REST API</h1>
  <h2>Available Routes</h2>
  <pre>
    GET, POST /passageiros
    GET, PUT, DELETE /passageiros/:id
  </pre>
  `.trim(),
  );
}); 

// Import and use passageiros routes
app.use("/api/passageiros", passageirosRoutes);

app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Connect app listening at http://localhost:${port}`);
});
