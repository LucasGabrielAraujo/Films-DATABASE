const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const path = require("path");
const port = 3000;
const morgan = require("morgan");
const { APIurl, plotFull, withYear } = require("./routes/index.routes");
const axios =require('axios')

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

//metodos get y post
app.get("/", (req, res) => {
  res.render("index", { h5content:"Bienvenido", sinopsiscontent:"<span>Utilice el buscador de la parte superior derecha para buscar el titulo deseado</span>" });
});
app.post("/", (req, res) => {
  let fullURL
  if (req.body.year) {
    fullURL = APIurl + "+" + req.body.search + withYear + req.body.year + plotFull;
  }else{
    fullURL = APIurl + "+" + req.body.search + plotFull;
  }
  axios.get(fullURL)
  .then(response => {
    const movieData = response.data;
    console.log(movieData)
    res.render('index', {
      h5content:`<h5>${movieData.Title}</h5>`,
      content:`<div class="container-fluid text-aling-start">
        <p>Fecha de lanzamiento:</p> <span>${movieData.Released}</span>
        <p>Duracion:</p> <span>${movieData.Runtime}</span>
        <p>Genero:</p> <span>${movieData.Genre}</span>
        <p>Director:</p> <span>${movieData.Director}</span>
        <p>Actores:</p> <span>${movieData.Actors}</span>
        <p>Idioma/s:</p> <span>${movieData.Language}</span>
        <p>Valoraciones: IMDB:</p> <span>${movieData.Ratings[0].Value}</span>
        </div>`
      ,
      imgcontent:`<img class="img-fluid" src="${movieData.Poster}"/>`,
      sinopsiscontent:`<p>Sinopsis:</p> <span>${movieData.Plot}</span>`})
  })
  .catch(error => {
    res.render('index', {h5content:"No se encontro el titulo"})
    console.error('Error al obtener la información:', error);
  });

  
} );

app.listen(port, () => console.log(`App listening on port ${port}!`));
