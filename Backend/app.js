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
                  res.send(record.toString());
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

        res.send(record.toString());
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
  var idUser = req.body.idUser;
  var idAW = req.body.idAW;
  var artworks = [];
  var query =
    "MATCH (w:ArtWork), (a)-[:MADE]->(w), (w)-[:USES_TECHNIQUE]->(t), (w)-[:LOCATED_AT]->(l), (w)-[:ITS_FORM_IS]->(f), (w)-[:ITS_TYPE_IS]->(y), (w)-[:ITS_SCHOOL_IS]->(s)" +
    " WHERE ID(w) = " +
    idAW +
    " OPTIONAL MATCH ((u:User {id: " +
    idUser +
    " })-[r:RATED]->(w))" +
    " WITH w,a,t,l,f,y,s,r" +
    " OPTIONAL MATCH (:User)-[ra:RATED]->(w)" +
    " RETURN ID(w), w.title, w.url, a.author_name, w.date, t.technique, l.location, f.art_form, y.arttype, s.school, r.score, avg(ra.score)";

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
            avg: result.records[i]._fields[11],
          };
          if (artwork.rating == null) {
            artwork.rating = 0;
          }
          if (artwork.avg == null) {
            artwork.avg = 0;
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

app.post("/searchAWByTitle", function (req, res) {
  var title = req.body.title.toString().toLowerCase();
  var idUser = req.body.idUser;
  var artworks = [];
  var query =
    "MATCH (w:ArtWork), (a)-[:MADE]->(w), (w)-[:USES_TECHNIQUE]->(t), (w)-[:LOCATED_AT]->(l)," +
    " (w)-[:ITS_FORM_IS]->(f), (w)-[:ITS_TYPE_IS]->(y), (w)-[:ITS_SCHOOL_IS]->(s)" +
    " WHERE TOLOWER(w.title) CONTAINS '" +
    title +
    "'" +
    " OPTIONAL MATCH ((u:User {id: " +
    idUser +
    " })-[r:RATED]->(w))" +
    " WITH w,a,t,l,f,y,s,r" +
    " OPTIONAL MATCH (:User)-[ra:RATED]->(w)" +
    " RETURN ID(w), w.title, w.url, a.author_name, w.date, t.technique," +
    " l.location, f.art_form, y.arttype, s.school, r.score, avg(ra.score)";

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
            avg: result.records[i]._fields[11],
          };
          if (artwork.rating == null) {
            artwork.rating = 0;
          }
          if (artwork.avg == null) {
            artwork.avg = 0;
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
    " WHERE ID(u) = " +
    idUser +
    " OPTIONAL MATCH (:User)-[ra:RATED]->(w:ArtWork)" +
    " RETURN ID(w), w.title, w.url, a.author_name, w.date, t.technique, l.location, " +
    "f.art_form, y.arttype, s.school, r.score, avg(ra.score) as punt";

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
            avg: result.records[i]._fields[11],
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

app.post("/bestRated", function (req, res) {
  var idUser = req.body.idUser;
  var artworks = [];
  var query =
    "MATCH (:User)-[r:RATED]->(w:ArtWork), (a)-[:MADE]->(w), (w)-[:USES_TECHNIQUE]->(t), (w)-[:LOCATED_AT]->(l), (w)-[:ITS_FORM_IS]->(f), (w)-[:ITS_TYPE_IS]->(y), (w)-[:ITS_SCHOOL_IS]->(s)" +
    " OPTIONAL MATCH ((u:User {id: " +
    idUser +
    "})-[ru:RATED]->(w:ArtWork)) " +
    " RETURN ID(w), w.title, w.url, a.author_name, w.date, t.technique, l.location, f.art_form, y.arttype, s.school, ru.score, avg(r.score) as punt order by punt desc limit 20";

  const session = driver.session();

  const resultPromise = session.run(query);
  resultPromise
    .then((result) => {
      if (result.records.length == 0) {
        res.json({
          msg: "Error",
        });
      } else {
        //console.log(result.records[0]._fields[11])
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
            avg: result.records[i]._fields[11],
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

app.post("/recommendContentBased", function (req, res) {
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
              res.send(vectorNonRated.slice(0, 20));
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

app.post("/recommendCollaborative", function (req, res) {
  var idUser = req.body.idUser;
  var vectorProfile = [];
  var vectorNonRated = [];
  var artworks = [];

  var query =
    "MATCH (u1:User {id:" +
    idUser +
    "})-[r:RATED]->(w:ArtWork)" +
    " WITH u1, avg(r.score) AS u1_mean" +
    " MATCH (u1)-[r1:RATED]->(w:ArtWork)<-[r2:RATED]-(u2)" +
    " WITH u1, u1_mean, u2, COLLECT({r1: r1, r2: r2}) AS ratings WHERE size(ratings) > 3" +
    " MATCH (u2)-[r:RATED]->(w:ArtWork)" +
    " WITH u1, u1_mean, u2, avg(r.score) AS u2_mean, ratings" +
    " UNWIND ratings AS r" +
    " WITH sum( (r.r1.score-u1_mean) * (r.r2.score-u2_mean) ) AS nom," +
    " sqrt( sum( (r.r1.score - u1_mean)^2) * sum( (r.r2.score - u2_mean) ^2)) AS denom," +
    " u1, u2 WHERE denom <> 0" +
    " WITH u1, u2, nom/denom AS pearson" +
    " ORDER BY pearson DESC LIMIT 10" +
    " MATCH (u2)-[r:RATED]->(w:ArtWork) WHERE NOT EXISTS( (u1)-[:RATED]->(w) )" +
    " WITH w, r, pearson, u1" +
    " MATCH (a)-[:MADE]->(w), (w)-[:USES_TECHNIQUE]->(t), (w)-[:LOCATED_AT]->(l)," +
    " (w)-[:ITS_FORM_IS]->(f), (w)-[:ITS_TYPE_IS]->(y), (w)-[:ITS_SCHOOL_IS]->(s)" +
    " RETURN ID(w), w.title, w.url, a.author_name, w.date, t.technique, l.location, " +
    " f.art_form, y.arttype, s.school, SUM( pearson * r.score) AS p" +
    " ORDER BY p DESC LIMIT 20";

  const session = driver.session();

  const resultPromise = session.run(query);
  resultPromise
    .then((result) => {
      if (result.records.length == 0) {
        res.json({
          msg: "Error",
        });
      } else {
        //console.log(result.records[0]._fields[11])
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
            //rating: result.records[i]._fields[10],
            //avg: result.records[i]._fields[11],
            avg: 0.0
          };
          // if (artwork.rating == null) {
          //   artwork.rating = 0;
          // }
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


function computeSimilarity(v1, v2) {
  for (var i = 0; i < v2.length; i++) {
    v2[i].similarity = similarity(v1, v2[i].vector);
  }
  v2.sort((a, b) => (a.similarity < b.similarity ? 1 : -1));
  return v2;
}

function imageUrlParser(url) {
  img_url = url.replace("html", "detail").replace("html", "jpg");
  return img_url;
}

function encriptar(user, pass) {
  var crypto = require("crypto");
  // usamos el metodo CreateHmac y le pasamos el parametro user y actualizamos el hash con la password
  var hmac = crypto.createHmac("sha1", user).update(pass).digest("hex");
  return hmac;
}

app.listen(port, function () {
  console.log("App listening on port " + 3000);
});
