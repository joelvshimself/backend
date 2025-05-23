require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger");
const authRoutes = require("./routes/auth");
const usuariosRoutes = require("./routes/crud");
const app = express();


app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);


app.listen(process.env.PORT, () => console.log(`Servidor corriendo en http://localhost:${process.env.PORT}\n Documentación en http://localhost:${process.env.PORT}/api-docs`));