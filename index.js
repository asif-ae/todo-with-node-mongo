const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://tushartd:hxhxsrRJooXPNG$R@cluster0.lq9rh.mongodb.net/tasks?retryWrites=true&w=majority";

const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("tasks").collection("todos");
  console.log("Database Connected");

  // Read something from the database
  app.get('/products', (req, res) => {
    productCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    } )
  })
});

app.listen(3000);