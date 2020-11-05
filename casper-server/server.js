const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const func = require('./function.js')
const mongoose = require('mongoose')
const Noticia = require('./models/noticias.js')

mongoose.connect(process.env.MongooseLink,
                {
                  useUnifiedTopology: true,
                  useNewUrlParser: true
                })


var cors = require('cors');
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
  }
app.use(cors(corsOptions));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// request dialogflow
app.post("/casper", (request, response) => {
  var intentName = request.body.queryResult.intent.displayName
  
  if (intentName == 'Esportes' || intentName == 'Politica' || 
      intentName == 'Entretenimento' || intentName == 'Famosos') {
    
      Noticia.find({}).exec()
        .then(doc => {
          doc = func.filterMap(doc,intentName.toLowerCase())
          if (doc.length == 0) {
            let res = func.semNoticia()
            response.json(res)
          } else {
            let res = func.carousel(doc)
            response.json(res)        
          }
      })
      .catch(err => {
        response.status(500).json({error : err})
      })
    }
});

app.get('/noticias', (req,res) => {
  
  Noticia.find({}).exec()
    .then(doc => {
      res.status(201).send(doc)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
})

app.post('/noticias', (req,res) => {
  
  const noticia = new Noticia({
    _id: new mongoose.Types.ObjectId(),
    link: req.body.link,
    imageurl: req.body.imageurl,
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    tema: req.body.tema,
  })
  
  Noticia.find({}).exec()
    .then(doc => {
      let checkRepeat = doc.filter(el => el['link'] == req.body.link)
      if (checkRepeat.length > 0) res.status(404).send("Noticia já cadastrada no sistema!");
      else {
        doc = doc.filter(el => el['tema'] == req.body.tema)
        if (doc.length == 10) res.status(404).send("Limite de 10 notícias por tema antigido!");
        else {
          noticia
            .save()
            .then(result => {
              console.log(result);
              res.status(201).json({
                message: "Handling POST requests to /products",
                createdProduct: result
              });
          })
        }
      }    
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
})

app.put("/noticias", (req, res) =>{
  
  let {tema,link,imageurl,descricao,titulo} = req.body;
  
  const noticia = {
    link: link,
    tema: tema,
    imageurl: imageurl,
    descricao: descricao,
    titulo: titulo
  }
  
  Noticia.find({}).exec()
    .then(doc => {
      doc = doc.filter(el => el['tema'] == tema);
      let verify = doc.filter(el => el['link'] == link);
      if (verify.length == 0 && doc.length == 10) res.status(404).send("Limite de 10 notícias por tema antigido!");
      else {
        Noticia.replaceOne({"link": link}, noticia).exec()
          .then(doc => {
            console.log("bora ver né")
            res.status(200).send(doc)
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})
    })
})

app.delete('/noticias', (req,res) => {
  console.log(req.query.id)
  Noticia.remove({ "link" : req.query.id}).exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error : err})
    })
})



// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

