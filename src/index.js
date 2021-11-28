const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
app.use(express.json());

customers = [];

app.get("/account", (request, response) => {
  const {name , nbi} = request.body;

  customers.push({
    id = uuidv4,
    name,
    nbi,
    statement: [],
  });
 
  return response.status(201).send();
});

app.listen(3333);