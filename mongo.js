const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://Bobby:${password}@cluster1.me6ro8z.mongodb.net/PersonApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
console.log("url", url);
mongoose.connect(url).catch((error) => console.log("error", error));

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  id: 6,
  name: name,
  number: number,
});

if (name && number) {
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}else if(!name && !number){
  Person.find({}).then(result => {
    console.log("Phonebook:")
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
