require('dotenv').config()

const express = require("express");
//const cors = require('cors');
const app = express();
const Person = require('./models/person')

// express display static content
app.use(express.static('build'))

//app.use(cors())
app.use(express.json())


var morgan = require('morgan')

morgan.token('content', function (req) {
  return JSON.stringify(req.body);
})

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

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id).then(
    person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    }).catch(error => { next(error) }
    )
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  Person.findByIdAndUpdate(request.params.id, person).then(updatedPerson => {
    response.json(updatedPerson)
  }).catch(error => next(error))
})

app.post("/api/persons", (request, response) => {
  const body = request.body
  let errorMsg = ''
  if (!body) {
    errorMsg = 'missing'
    return response.status(400).json({
      error: errorMsg
    })
  } else if (!body.name) {
    errorMsg = 'name missing'
    return response.status(400).json({
      error: errorMsg
    })
  } else if (!body.number) {
    errorMsg = 'number missing'
    return response.status(400).json({
      error: errorMsg
    })
  } else {
    const person = new Person({
      name: body.name,
      number: body.number
    })
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  }
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
