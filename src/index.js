const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
app.use(express.json());

customers = [];

app.post("/account", (request, response) => {
  const {name , cpf} = request.body;

  const customersAlreadyExists = customers.some(
    (customers) => customers.cpf === cpf
  );

  if(customersAlreadyExists) {
    return response.status(400).json({error: "Customers Already Exists"});
  }
  const id = uuidv4();
  customers.push({
    id,
    name,
    cpf,
    statement: []
  });
 
  return response.status(201).send();
});

app.get("/statement/:cpf", (request, response) => {
  
  const { cpf } = request.params;

  const customer = customers.find((customer) => customer.cpf === cpf);
  
  return response.json(customer.statement);
});

app.listen(3333);