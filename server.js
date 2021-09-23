const express = require("express");

const mgconnect = require("./config/db");

const app = express();

mgconnect();

app.use(express.json());

app.use("/api/admin", require("./route/api/admin"));
app.use("/api/profile", require("./route/api/profile"));
app.use("/api/auth", require("./route/api/auth"));
app.use("/api/product", require("./route/api/product"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("work"));
