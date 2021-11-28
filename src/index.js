const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
app.use(express.json());

customers = [];

app.post("/account", (request, response) => {
  const {name , nbi} = request.body;
  const id = uuidv4();
  customers.push({
    id,
    name,
    nbi,
    statement: []
  });
 
  return response.status(201).send();
});

app.get("/see", (require, response) => {
  return response.json(customers);
});

app.listen(3333);