const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
app.use(express.json());

customers = [];

function VeriflyIsExistsAccountCPF (request, response, next){
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if(!customer) {
    return response.status(400).json({ error: "Customer not found"})
  }
  request.customer = customer;
  return next();
}

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

app.get("/statement", VeriflyIsExistsAccountCPF, (request, response) => {
  const {customer} = request;
  
  return response.json(customer.statement);
});

app.post("/deposit", VeriflyIsExistsAccountCPF, (request, response) =>{
  const { description, amount} = request.body;

  const { customer } = request;

  const statementOperation = {
    description,
    amount,
    creatd_at: new Date(),
    type: "credit",
  };
  customer.statement.push(statementOperation);

  return response.status(201).send();
});

app.listen(3333);