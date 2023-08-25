const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const path = require("path");
const port = 3000;
const morgan = require("morgan");
const { indexContent, content } = require("./routes/index.routes");
const fetch = require("node-fetch");

//middLewares - mostrar logs por consola
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.engine(
  ".hbs",
  engine({
    layoutsDir: path.join(__dirname + "/views"),
    defaultLayout: "index",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index", { indexContent });
});
app.post("/", (req, res) => {
    let param = req.body.search
    const encodedString = encodeURIComponent(param);
    let url =
    `https://api.themoviedb.org/3/search/movie?query=${encodedString}include_adult=false&language=es-ES&page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMmIzMTY4MmY2NmZlZmJmYWI4YmNiMWRhZThjOWEwYyIsInN1YiI6IjY0ZTg0ZmZjMWZlYWMxMDExYjJkMTY4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nkb5QEudxVfsyKMQQbSjcYqNOcg6AKFg02bxSNMIeLk",
    },
  };
  let first
  let title
  let desc
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => first=json.results[0])
    .catch((err) => console.error("error:" + err));
    console.log(first.title)
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
