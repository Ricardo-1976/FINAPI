const express = require("express");
const app = express();

app.get("/", (request, response) => {
return response.json("Hello word! Ricardo");
});

app.listen(3000);