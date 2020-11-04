const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const func = require('./function.js')

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
    
      var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        user     : process.env.MYSQL_USER,
        password : process.env.MYSQL_PASS,
        database : process.env.MYSQL_DB  
      });

      connection.connect(); 
      var query = 'select * from noticias'

      connection.query(query, function(error, results, fields) {
        if (error) throw error;
        connection.end()
        results = func.filterMap(results,intentName.toLowerCase())
        if (results.length == 0) {
          let res = func.semNoticia()
          response.json(res)
        } else {
          let res = func.carousel(results)
          response.json(res)        
        }
      })    
    }
});

app.get("/noticias", (request, response) => {
    var connection = mysql.createConnection({
      host     : process.env.MYSQL_HOST,
      user     : process.env.MYSQL_USER,
      password : process.env.MYSQL_PASS,
      database : process.env.MYSQL_DB  
    });
  
    connection.connect(); 
    var query = "select * from noticias"
  
    connection.query(query, function(error, results, fields) {
      if (error) throw error;
      connection.end()
      response.send(results)
    })
});

app.post("/noticias", (request, response) => {
  
    let {tema,link,imageurl,descricao,titulo} = request.body;
  
    var connection = mysql.createConnection({
      host     : process.env.MYSQL_HOST,
      user     : process.env.MYSQL_USER,
      password : process.env.MYSQL_PASS,
      database : process.env.MYSQL_DB  
    });
  
    connection.connect(); 
    
    var querySelect = 'select * from noticias'
  
    connection.query(querySelect, function(error, results, fields) {
      if (error) {
        console.log(error)
        response.status(404).send("Oh uh, something went wrong")
      } else {
        let checkRepeat = results.filter(el => el['link'] == link)
        if (checkRepeat.length > 0) response.status(404).send("Noticia já cadastrada no sistema!");
        else {
          results = results.filter(el => el['tema'] == tema)
          if (results.length == 10) response.status(404).send("Limite de 10 notícias por tema antigido!");
          else {
            var query = 
              "insert into noticias values ('"+link+"','"+titulo+"','"+imageurl+"','"+tema+"','"+descricao+"')"
            connection.query(query, function(error, results, fields) {
               if (error) console.log(error), response.status(404).send("Oh uh, something went wrong");
              connection.end()
              response.send(results)
            }) 
          }
        }
      }
    })
});

app.put("/noticias", (request, response) => {
  
    let {tema,link,imageurl,descricao,titulo} = request.body;
  
    var connection = mysql.createConnection({
      host     : process.env.MYSQL_HOST,
      user     : process.env.MYSQL_USER,
      password : process.env.MYSQL_PASS,
      database : process.env.MYSQL_DB  
    });
  
    connection.connect(); 
    
  
    var queryUpdate = 
    'UPDATE noticias SET tema = "'+tema+'", imageurl = "'+imageurl+'", descricao = "'+descricao+'", titulo = "'+titulo+'" WHERE link = "'+link+'"'
    
    console.log(queryUpdate)
    
    var querySelect = 'select * from noticias'
  
    connection.query(querySelect, function(error, results, fields) {
      if (error) {
        console.log(error)
        response.status(404).send("Oh uh, something went wrong")
      } else {
          results = results.filter(el => el['tema'] == tema)
          let verify = results.filter(el => el['link'] == link)
          if (results.length == 10 && verify.length == 0) response.status(404).send("Limite de 10 notícias por tema antigido!");
          else {
            connection.query(queryUpdate, function(error, results, fields) {
              if (error) response.status(404).send("Oh uh, something went wrong");
              connection.end()
              response.send(results)
            }) 
          }
      }
    })
});

app.delete("/noticias", (request, response) => {
  
    var id = request.query.id
    
    var connection = mysql.createConnection({
      host     : process.env.MYSQL_HOST,
      user     : process.env.MYSQL_USER,
      password : process.env.MYSQL_PASS,
      database : process.env.MYSQL_DB  
    });
  
    connection.connect(); 
  
    var query = 
        'DELETE FROM noticias WHERE link = "'+id+'"'
    console.log(query)
    connection.query(query, function(error, results, fields) {
      if (error) response.status(404).send("Algo deu errado no servidor! Tente novamente mais tarde.");
      connection.end()
      response.send(results)
    })
});




// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

