const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
var cors = require("cors");
const neo4j = require("neo4j-driver");
var similarity = require("compute-cosine-similarity");
const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "1"),
  { disableLosslessIntegers: true }
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
  var email = req.body.email.toLowerCase();
  var username = req.body.username.toLowerCase();
  var name = req.body.name;
  var surname = req.body.surname;
  var passEncriptada = encriptar(req.body.email, req.body.pass);

  var query1 =
    "MATCH (u:User) WHERE TOLOWER(u.username) = '" +
    username +
    "' return ID(u)";
  var query2 =
    "MATCH (u:User) WHERE TOLOWER(u.email) = '" + email + "' return ID(u)";

  var query3 =
    "CREATE (u:User {username: '" +
    username +
    "', email: '" +
    email +
    "', name: '" +
    name +
    "', surname: '" +
    surname +
    "', password: '" +
    passEncriptada +
    "'}) SET u.id = ID(u) RETURN ID(u)";

  const session = driver.session();

  const resultPromise = session.run(query1);
  resultPromise
    .then((result) => {
      if (result.records.length != 0) {
        res.json({
          msg: "username",
        });
        session.close();
      } else {
        const resultPromise = session.run(query2);
        resultPromise
          .then((result) => {
            if (result.records.length != 0) {
              res.json({
                msg: "email",
              });
              session.close();
            } else {
              const resultPromise = session.run(query3);
              resultPromise
                .then((result) => {
                  var record = result.records[0]._fields[0];
                  res.send(record);
                  session.close();
                })
                .catch((error) => {
                  // handle error
                  res.json({
                    msg: "error",
                  });
                  console.log(error);
                  session.close();
                });
            }
          })
          .catch((error) => {
            // handle error
            res.json({
              msg: "error",
            });
            console.log(error);
            session.close();
          });
      }
    })
    .catch((error) => {
      // handle error
      res.json({
        msg: "error",
      });
      console.log(error);
      session.close();
    });
});

app.post("/Login", (req, res) => {
  var email = req.body.email;
  var passEncriptada = encriptar(req.body.email, req.body.pass);
  var query =
    "MATCH (u:User) WHERE (u.email) =~ ('" +
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
    "MATCH (w:ArtWork), (a)-[:MADE]->(w), (w)-[:USES_TECHNIQUE]->(t), (w)-[:LOCATED_AT]->(l), (w)-[:ITS_FORM_IS]->(f), (w)-[:ITS_TYPE_IS]->(y), (w)-[:ITS_SCHOOL_IS]->(s) WHERE ID(w)=(" +
    parseInt(id) +
    ") return ID(w), w.title, w.url, a.author_name, w.date, t.technique, l.location, f.art_form, y.arttype, s.school";

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
            art_id: result.records[i]._fields[0],
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
  var title = req.body.title.toString().toLowerCase();
  var idUser = req.body.idUser;
  var artworks = [];
  var query =
    "MATCH (w:ArtWork), (a)-[:MADE]->(w), (w)-[:USES_TECHNIQUE]->(t), (w)-[:LOCATED_AT]->(l), (w)-[:ITS_FORM_IS]->(f), " +
    "(w)-[:ITS_TYPE_IS]->(y), (w)-[:ITS_SCHOOL_IS]->(s) WHERE TOLOWER(w.title) CONTAINS '" +
    title +
    "' OPTIONAL MATCH ((u:User {id: " +
    idUser +
    "})-[r:RATED]->(w:ArtWork)) " +
    "RETURN ID(w), w.title, w.url, a.author_name, w.date, t.technique, l.location, f.art_form, y.arttype, s.school, r.score";

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
            art_id: result.records[i]._fields[0],
            title: result.records[i]._fields[1],
            img_url: imageUrlParser(result.records[i]._fields[2]),
            author: result.records[i]._fields[3],
            date: result.records[i]._fields[4],
            technique: result.records[i]._fields[5],
            location: result.records[i]._fields[6],
            art_form: result.records[i]._fields[7],
            art_type: result.records[i]._fields[8],
            school: result.records[i]._fields[9],
            rating: result.records[i]._fields[10],
          };
          if (artwork.rating == null) {
            artwork.rating = 0;
          }
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

app.post("/submitRating", function (req, res) {
  var idUser = req.body.idUser;
  var idArtwork = req.body.idArtwork;
  var rating = req.body.rating;

  var query =
    "MATCH (u:User) WHERE ID(u) = " +
    idUser +
    " WITH u MATCH (w:ArtWork) WHERE ID(w) = " +
    idArtwork +
    " WITH u,w MERGE (u)-[r:RATED]->(w) ON CREATE SET r.score = " +
    rating +
    " ON MATCH SET r.score = " +
    rating +
    " RETURN null";

  const session = driver.session();

  const resultPromise = session.run(query);
  resultPromise
    .then((result) => {
      if (result.records[0]._fields[0] != null) {
        res.json({
          msg: "Error",
        });
      } else {
        res.json({
          msg: "Success",
        });
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

app.post("/searchMyRatings", function (req, res) {
  var idUser = req.body.idUser;
  var artworks = [];
  var query =
    "MATCH (u:User)-[r:RATED]->(w:ArtWork), (a)-[:MADE]->(w), (w)-[:USES_TECHNIQUE]->(t), (w)-[:LOCATED_AT]->(l), " +
    "(w)-[:ITS_FORM_IS]->(f), (w)-[:ITS_TYPE_IS]->(y), (w)-[:ITS_SCHOOL_IS]->(s)" +
    "WHERE ID(u) = " +
    idUser +
    " RETURN ID(w), w.title, w.url, a.author_name, w.date, t.technique, l.location, f.art_form, y.arttype, s.school, r.score";

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
            art_id: result.records[i]._fields[0],
            title: result.records[i]._fields[1],
            img_url: imageUrlParser(result.records[i]._fields[2]),
            author: result.records[i]._fields[3],
            date: result.records[i]._fields[4],
            technique: result.records[i]._fields[5],
            location: result.records[i]._fields[6],
            art_form: result.records[i]._fields[7],
            art_type: result.records[i]._fields[8],
            school: result.records[i]._fields[9],
            rating: result.records[i]._fields[10],
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

app.post("/recommend1", function (req, res) {
  var idUser = req.body.idUser;
  var vectorProfile = [];
  var vectorNonRated = [];
  var artworks = [];
  var queryProfile =
    'MATCH (feature)  WHERE "Author" in labels(feature) OR "Technique" in labels(feature) OR "Art_form" in labels(feature) OR "Art_Type" in labels(feature) OR "School" in labels(feature) OR "TimeFrame" in labels(feature)  WITH feature  ORDER BY id(feature) MATCH (w:ArtWork)-[r1:RATED]-(u:User)  WHERE u.id = ' +
    idUser +
    " AND r1.score >= 3 OPTIONAL MATCH (w)-[r:MADE|USES_TECHNIQUE|ITS_FORM_IS|ITS_TYPE_IS|ITS_SCHOOL_IS|AT_TIMEFRAME]-(feature) WITH w, collect (CASE WHEN r IS null THEN 0 ELSE 1 END) as value RETURN value ";

  var queryNonRated =
    'MATCH (feature) WHERE "Author" in labels(feature) OR "Technique" in labels(feature) OR "Art_form" in labels(feature) OR "Art_Type" in labels(feature) OR "School" in labels(feature) OR "TimeFrame" in labels(feature)  WITH feature ORDER BY id(feature) MATCH (w:ArtWork) WHERE NOT EXISTS ((:User{id:' +
    idUser +
    "})-[:RATED]->(w)) OPTIONAL MATCH (w)-[r:MADE|USES_TECHNIQUE|ITS_FORM_IS|ITS_TYPE_IS|ITS_SCHOOL_IS|AT_TIMEFRAME]-(feature) WITH w, collect (CASE WHEN r IS null THEN 0 ELSE 1 END) as value RETURN w.id, value";


  const session = driver.session();

  const resultPromise = session.run(queryProfile);
  resultPromise
    .then((result) => {
      if (result.records.length == 0) {
        res.json({
          msg: "Error",
        });
        session.close();
      } else {
        var vector = [];
        for (var i = 0; i < result.records.length; i++) {
          vector.push(result.records[i]._fields[0]);
        }
        for (var i = 0; i < vector[0].length; i++) {
          var avg = 0;
          for (var j = 0; j < vector.length; j++) {
            avg = avg + vector[j][i];
          }
          vectorProfile.push(avg / vector.length);
        }
        const session2 = driver.session();
        const resultPromise = session2.run(queryNonRated);
        resultPromise
          .then((result2) => {
            if (result2.records.length == 0) {
              res.json({
                msg: "Error",
              });
            } else {
              for (var i = 0; i < result2.records.length; i++) {
                var pair = {
                  id: result2.records[i]._fields[0],
                  vector: result2.records[i]._fields[1],
                };
                vectorNonRated.push(pair);
                
              }
              session.close();
              vectorNonRated = computeSimilarity(vectorProfile, vectorNonRated);
              res.send(vectorNonRated.slice(0,20));
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

function getUserVector(idUser) {
  var vector = [];
  var res_vector = [];
  var query =
    'MATCH (feature)  WHERE "Author" in labels(feature) OR "Technique" in labels(feature) OR "Art_form" in labels(feature) OR "Art_Type" in labels(feature) OR "School" in labels(feature) OR "TimeFrame" in labels(feature)  WITH feature  ORDER BY id(feature) MATCH (w:ArtWork)-[r1:RATED]-(u:User)  WHERE u.id = ' +
    idUser +
    " AND r1.score >= 3 OPTIONAL MATCH (w)-[r:MADE|USES_TECHNIQUE|ITS_FORM_IS|ITS_TYPE_IS|ITS_SCHOOL_IS|AT_TIMEFRAME]-(feature) WITH w, collect (CASE WHEN r IS null THEN 0 ELSE 1 END) as value RETURN value ";
  const session = driver.session();

  const resultPromise = session.run(query);
  resultPromise
    .then((result) => {
      //console.log(result.records[0]._fields[0])
      for (var i = 0; i < result.records.length; i++) {
        vector.push(result.records[i]._fields[0]);
      }
      session.close();
      for (var i = 0; i < vector[0].length; i++) {
        var avg = 0;
        for (var j = 0; j < vector.length; j++) {
          avg = avg + vector[j][i];
        }
        res_vector.push(avg / vector.length);
      }
    })
    .catch((error) => {
      console.log(error);
      session.close();
    });
  return res_vector;
}

function getNonRatedVector(idUser, res) {
  var res_vector = [];
  var query =
    'MATCH (feature) WHERE "Author" in labels(feature) OR "Technique" in labels(feature) OR "Art_form" in labels(feature) OR "Art_Type" in labels(feature) OR "School" in labels(feature) OR "TimeFrame" in labels(feature)  WITH feature ORDER BY id(feature) MATCH (w:ArtWork) WHERE NOT EXISTS ((:User{id:' +
    idUser +
    "})-[:RATED]->(w)) OPTIONAL MATCH (w)-[r:MADE|USES_TECHNIQUE|ITS_FORM_IS|ITS_TYPE_IS|ITS_SCHOOL_IS|AT_TIMEFRAME]-(feature) WITH w, collect (CASE WHEN r IS null THEN 0 ELSE 1 END) as value RETURN w.id as id, value as value";

  const session = driver.session();

  session.run(query).subscribe({
    onNext: function (record) {
      res_var = {
        id: record.get("id"),
        vector: record.get("value"),
      };
      res_vector.push(res_var);
    },
    onCompleted: function () {
      session.close();
      console.log(res_vector);
      return res_vector;
    },
    onError: function (error) {
      console.log(error);
    },
  });
  // const resultPromise = session.run(query);
  // resultPromise
  //   .then((result) => {
  //     //console.log(result.records[0]._fields[0])
  //     for (var i = 0; i < result.records.length; i++) {
  //       res_var = {
  //         id: result.records[i]._fields[0],
  //         vector: result.records[i]._fields[1],
  //       };
  //       res_vector.push(res_var);
  //     }
  //     session.close();
  //     return res_vector;
  //     //console.log(res_vector)

  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     session.close();
  //   });
}

function computeSimilarity(v1, v2) {
  for (var i = 0; i < v2.length; i++) {
    v2[i].similarity = similarity(v1, v2[i].vector);
  }
  v2.sort((a,b)=> (a.similarity < b.similarity ? 1 : -1))
  return v2;
}

function imageUrlParser(url) {
  img_url = url.replace("html", "detail").replace("html", "jpg");
  return img_url;
}

app.listen(port, function () {
  console.log("App listening on port " + 3000);
});
