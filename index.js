require('dotenv').config()

const express = require("express");
const cors = require('cors');
const app = express();
const Person = require('./models/person')

app.use(cors())
app.use(express.json())

// express display static content
app.use(express.static('build'))

var morgan = require('morgan')

morgan.token('content', function (req) {
  return JSON.stringify(req.body);
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//let persons = [
//  {
//    id: 1,
//    name: "Arto Hellas",
//    number: "040-123456",
//  },
//  {
//    id: 2,
//    name: "Ada Lovelace",
//    number: "39-44-5323523",
//  },
//  {
//    id: 3,
//    name: "Dan Abramov",
//    number: "12-43-234345",
//  },
//  {
//    id: 4,
//    name: "Mary Poppendieck",
//    number: "39-23-6423122",
//  },
//];

app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
});

app.get("/api/info", (request, response) => {
  const date = new Date().toString();
  const personsAmount = persons.length;
  response.send(`<h1> ${personsAmount}</h1> <h1> ${date}</h1>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  console.log("persons", persons);
  response.status(204).end()
})

app.post("/api/persons", (request, response) => {
  const person = request.body
  let errorMsg = ''
  if(!person){
    errorMsg = 'missing'
    return response.status(400).json({
      error: errorMsg
    })
  }else if(!person.name){
    errorMsg = 'name missing'
    return response.status(400).json({
      error: errorMsg
    })
  }else if(!person.number){
    errorMsg = 'number missing'
    return response.status(400).json({
      error: errorMsg
    })
  }else if(persons.find(a => a.name == person.name)) {
    errorMsg = 'name must be unique'
    return response.status(400).json({
      error: errorMsg
    })
  }else{
    const id = getRandomInt(100000)
    person.id = id
    persons = persons.concat(person)
    response.json(person)
  }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
