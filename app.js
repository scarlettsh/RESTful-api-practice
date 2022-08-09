const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const e = require("express");
const { title } = require("process");
require("dotenv").config();

const app = express();

mongoose.connect(
  "mongodb+srv://admin-scarlett:" +
    process.env.mongodbPassword +
    "@cluster0.y3z9a.mongodb.net/wikiDB"
);

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {});

// app.get("/articles");

// app.post("/articles",);

// app.delete("/articles", );

//chained handlers
app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, docs) => {
      res.send(docs);
    });
  })
  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    article.save((err) => {
      if (!err) {
        res.send("Successfully inserted");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("Successfully deleted all the corresponding articles");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:title")
  .get((req, res) => {
    Article.findOne({ title: req.params.title }, (err, doc) => {
      if (doc) {
        res.send(doc);
      } else {
        res.send("No article found");
      }
    });
  })
  .put((req, res) => {
    Article.replaceOne( //put with replaceOne to overwrite
      { title: req.params.title },
      { content: req.body.content },
      (err) => {
        if (!err) {
          res.send("Succesfully overwrited");
        } else {
          console.log("whats up");
          console.log(err);
          res.send(err);
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne({ title: req.params.title }, req.body, (err) => {
      if (!err) {
        res.send("Successfully updated the fields");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteOne({title: req.params.title}, (err) => {
        if(!err){
            res.send("Sueccesfully deleted the article");
        }else {
            res.send(err);
        }
    })
  })

app.listen(process.env.PORT, (req, res) => {
  console.log("Server started");
});
