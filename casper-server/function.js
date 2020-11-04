function filterMap(noticias, tema) {
  noticias = noticias.filter(el => el['tema'] == tema)
  return noticias = noticias.map(el => {
        return {
          "title": el['titulo'],
          "image_url": el['imageurl'],
          "subtitle": el['descricao'],
          "buttons": [{
            "type":"web_url",
            "url": el['link'],
            "title":"Veja mais"
          }]
        }
      })
}

function semNoticia () {
  return {
          "fulfillmentMessages": [
            {
              "payload": {
                "facebook": {
                    "text": "Desculpe não foi possível achar nenhuma notícia sobre. Tente outro tópico.",
                    "quick_replies":[
                      {
                        "content_type":"text",
                        "title":"Esportes",
                        "payload":"Esportes"
                      },
                      {
                        "content_type":"text",
                        "title":"Política",
                        "payload": "Política"
                      },
                      {
                        "content_type":"text",
                        "title":"Entretenimento",
                        "payload":"Entretenimento"
                      },
                      {
                        "content_type":"text",
                        "title":"Famosos",
                        "payload":"Famosos"
                      },
                    ] 
                  }
                }
              }
            ]
          }
}

function carousel(noticias) {
  return {
          "fulfillmentMessages": [
            {
              "payload": {
                "facebook": {
                  "attachment": {
                    "type": "template",
                    "payload": {
                      "template_type": "generic",
                      "elements": noticias
                    } 
                  }
                } 
              }
            }
          ]
        }
}

module.exports = {
  semNoticia,
  carousel,
  filterMap
}