const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
var cors = require("cors");
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "1")
);
const session = driver.session();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function encriptar(user, pass) {
  var crypto = require("crypto");
  // usamos el metodo CreateHmac y le pasamos el parametro user y actualizamos el hash con la password
  var hmac = crypto.createHmac("sha1", user).update(pass).digest("hex");
  return hmac;
}


app.post("/SignUp", function (req, res) {
  var email = req.body.email;
  var username = req.body.username;
  var name = req.body.name;
  var surname = req.body.surname
  var passEncriptada = encriptar(req.body.email, req.body.pass);
  var query = "CREATE (u:User {username: '"+username+"', email: '"+email+"', name: '"+name+"', surname: '"+surname+"', password: '"+passEncriptada+"'})";
  

  const session = driver.session();

  const resultPromise = session.run(query);
  resultPromise.then(result => {
      
      res.json({
          msg: 'Bien'
      });
      session.close();
  })
  .catch((error) => {
      // handle error
      res.json({
          msg: 'error'
      });
      console.log(error)
      session.close();
  })

  
});



app.post("/Login", (req, res) => {
  var email = req.body.email;
  var passEncriptada = encriptar(req.body.email, req.body.pass);
  var query =
    "MATCH (u:User) WHERE TOLOWER(u.email) =~ TOLOWER('" +
    email +
    "') AND (u.password) = '" +
    passEncriptada +
    "' RETURN ID(u)";

  const session = driver.session();

  const resultPromise = session.run(query);
  resultPromise
    .then((result) => {
      if (result.records.length == 0) {
        res.json({
          msg: "Error",
        });
      } else {        
        var record = result.records[0]._fields[0];
        res.send(record);
      }
      session.close();
    })
    .catch((error) => {
      // handle error
      res.json({
        msg: "Error",
      });
      console.log(error);
      session.close();
    });
});

app.post("/searchAWById", function (req, res) {
  var id = req.body.id;
  var artworks = [];
  var query =
    "MATCH (w:ArtWork), (a)-[:MADE]->(w), (w)-[:USES_TECHNIQUE]->(t), (w)-[:LOCATED_AT]->(l), (w)-[:ITS_FORM_IS]->(f), (w)-[:ITS_TYPE_IS]->(y), (w)-[:ITS_SCHOOL_IS]->(s) WHERE (w.id)=(" +
    parseInt(id) +
    ") return w.id, w.title, w.url, a.author_name, w.date, t.technique, l.location, f.art_form, y.arttype, s.school";

  const session = driver.session();

  const resultPromise = session.run(query);
  resultPromise
    .then((result) => {
      if (result.records.length == 0) {
        res.json({
          msg: "Error",
        });
      } else {
        for (var i = 0; i < result.records.length; i++) {
          var artwork = {
            id: result.records[i]._fields[0].low,
            title: result.records[i]._fields[1],
            img_url: imageUrlParser(result.records[i]._fields[2]),
            author: result.records[i]._fields[3],
            date: result.records[i]._fields[4],
            technique: result.records[i]._fields[5],
            location: result.records[i]._fields[6],
            art_form: result.records[i]._fields[7],
            art_type: result.records[i]._fields[8],
            school: result.records[i]._fields[9],
          };
          artworks.push(artwork);
        }
        res.send(artworks);
      }
      session.close();
    })
    .catch((error) => {
      // handle error
      res.json({
        msg: "Error",
      });
      console.log(error);
      session.close();
    });
});

app.post("/searchAWByTitle", function (req, res) {
  var title = req.body.title;
  var artworks = [];
  var query =
    "MATCH (w:ArtWork), (a)-[:MADE]->(w), (w)-[:USES_TECHNIQUE]->(t), (w)-[:LOCATED_AT]->(l), (w)-[:ITS_FORM_IS]->(f), (w)-[:ITS_TYPE_IS]->(y), (w)-[:ITS_SCHOOL_IS]->(s) WHERE TOLOWER(w.title)=~TOLOWER('.*" +
    title +
    ".*') return w.id, w.title, w.url, a.author_name, w.date, t.technique, l.location, f.art_form, y.arttype, s.school";

  const session = driver.session();

  const resultPromise = session.run(query);
  resultPromise
    .then((result) => {
      if (result.records.length == 0) {
        res.json({
          msg: "Error",
        });
      } else {
        for (var i = 0; i < result.records.length; i++) {
          var artwork = {
            id: result.records[i]._fields[0].low,
            title: result.records[i]._fields[1],
            img_url: imageUrlParser(result.records[i]._fields[2]),
            author: result.records[i]._fields[3],
            date: result.records[i]._fields[4],
            technique: result.records[i]._fields[5],
            location: result.records[i]._fields[6],
            art_form: result.records[i]._fields[7],
            art_type: result.records[i]._fields[8],
            school: result.records[i]._fields[9],
          };
          artworks.push(artwork);
        }
        res.send(artworks);
      }
      session.close();
    })
    .catch((error) => {
      // handle error
      res.json({
        msg: "Error",
      });
      console.log(error);
      session.close();
    });
});

function imageUrlParser(url) {
  img_url = url.replace("html", "detail").replace("html", "jpg");
  return img_url;
}

app.listen(port, function () {
  console.log("App listening on port " + 3000);
});
