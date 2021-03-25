const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

// This is require for delete
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://tushartd:hxhxsrRJooXPNG$R@cluster0.lq9rh.mongodb.net/tasks?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/scripts.js', function(req, res) {
  res.sendFile(__dirname + '/scripts.js');
});

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const jobCollection = client.db("tasks").collection("todos");
  console.log("Database Connected");

  // Read something from the database
  app.get('/jobs', (req, res) => {
    jobCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    } );
  });

  // Create or add something in the database
  app.post('/addJob', (req, res) => {
    const job = req.body;
    jobCollection.insertOne(job)
    .then(result => {
      console.log('data added successfully');
      res.redirect('/');
    })
  });

  // Delete something from database
  app.delete('/delete/:id', (req, res) => {
    const job = ObjectId(req.params.id);
    jobCollection.deleteOne({_id: job})
    .then((result) => {
      console.log(result);
      res.send(result.deletedCount > 0);
    });
  });

  // Load single product
  app.get('/job/:id', (req, res) => {
    const job = ObjectId(req.params.id);
    jobCollection.find({_id: job})
    .toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  // Update product
  app.patch('/update/:id', (req, res) => {
    console.log(req.body.jobName, req.body.jobDescription)
    const job = ObjectId(req.params.id);
    jobCollection.updateOne(
      {_id: job},
      { $set: { jobName: req.body.jobName, jobDescription: req.body.jobDescription } }
    )
    .then((result) => {
      res.send(result.modifiedCount > 0);
    });
  });
});

app.listen(3000);