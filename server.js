const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(parser.urlencoded({extended: true}));

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

MongoClient.connect('mongodb://localhost:27017', function(err, client){
  if (err) {
    console.log(err);
    return;
  }

  const db = client.db("marvel");
  console.log("Connected to Database, Yaldi!!!");
  
  server.post("/marvel/characters", function(req, res, next) {
    const marvelCollection = db.collection("characters");
    const charToSave = req.body;

    marvelCollection.save(charToSave, function(err, result) {
      if (err) next(err);
      res.status(201);
      res.json(result.ops[0]);
      console.log("Character saved to Database!");
      
    });
  });

  server.get('/marvel/characters', function(req, res, next) {
    const marvelCollection = db.collection("characters");
    marvelCollection.find().toArray(function(err, allChars){
      if (err) next(err);
      res.json(allChars);
    });
  });

  server.delete('marvel/characters', function(req, res, next) {
    const marvelCollection = db.collection("characters");
    marvelCollection.remove({}, function(err, result) {
      if (err) next (err);
      res.status(200).send();
    });
  });

  server.delete('/marvel/characters/:id', function(req, res, next){
    const marvelCollection = db.collection("characters");
    const objectID = ObjectID(req.params.id);

    marvelCollection.remove({_id: objectID}, function(err, result){
      if (err) next (err);
      res.status(200).send();
    });
  });

  server.post('/marvel/characters/:id', function(req, res, next) {
    const marvelCollection = db.collection("characters");
    const objectID = ObjectID(req.params.id);

    marvelCollection.update({_id: objectID}, req.body, function(err, result){
      if(err) next(err);
      res.status(200).send();
    });
  });

  server.listen(3000, function () {
    console.log("Listening on port 3000");
  });
});




