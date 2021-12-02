const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
app.use(express.json());

customers = [];
// Middleware

function VeriflyIsExistsAccountCPF (request, response, next){
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if(!customer) {
    return response.status(400).json({ error: "Customer not found"})
  }
  request.customer = customer;
  return next();
}

function getBalance(statement){
  const balance = statement.reduce((acc, operation) => {
    if(operation.type === "credit"){
      return acc + operation.amount;
    }else {
      return acc - operation.amount;
    }
  }, 0);

  return balance;
}
// Create account
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
// Show statement
app.get("/statement", VeriflyIsExistsAccountCPF, (request, response) => {
  const {customer} = request;
  
  return response.json(customer.statement);
});
// Deposit to account
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
// Withdraw from the account
app.post("/withdraw", VeriflyIsExistsAccountCPF, (request, response) => {
const { amount } = request.body;
const { customer } = request;

const balance = getBalance(customer.statement);

if(balance < amount) {
  return response.status(400).json({ error: "Insufficient funds!" });
}

const statementOperation = {
  amount,
  created_at: new Date(),
  type: "debit",
};

customer.statement.push(statementOperation);

return response.status(201).send();
});

app.get("/statement/date", VeriflyIsExistsAccountCPF, (request, response) => { 

  const { customer } = request;
  const { date } = request.query;

  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter(
    (statement) => (statement.created_at) ===
    new Date(dateFormat).toDateString()
  );

  return response.json(customer.statement);
});

app.put("/account",VeriflyIsExistsAccountCPF, (request, response) => {
  const {name} = request.body;
  const {customer} = request;

  customer.name = name;

  return response.status(201).send();
});

app.get("/account",VeriflyIsExistsAccountCPF, (request,response) => {
  const {customer} = request;

  return response.json(customer);
});

app.delete("/account", VeriflyIsExistsAccountCPF, (request, response) => {
  const {customer} = request;
  customers.splice(customer, 1);
  return response.status(200).json(customers);
});

app.get("/balance",VeriflyIsExistsAccountCPF, (request, response) => {
  const {customer} = request;

  const balance = getBalance(customer.statement);

  return response.json(balance);
});
   
app.listen(3333);