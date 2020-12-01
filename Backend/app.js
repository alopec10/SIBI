const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
var cors = require("cors");
const neo4j = require("neo4j-driver");
const driver = neo4j.driver("bolt://localhost:7687",neo4j.auth.basic("neo4j", "1"));
const session = driver.session();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/searchTitle", function (req, res) {
  var title = req.body.title;
  var artworks = [];
  var query =
    "MATCH (w:ArtWork), (a)-[:MADE]->(w) WHERE TOLOWER(w.title)=~TOLOWER('.*The Rose.*') return w.id as w_id, w.title as w_title, w.url as w_url, a.author_name as a_name"

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
