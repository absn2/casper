const mongoose = require('mongoose')

const noticiaSchema = mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  link: String,
  imageurl: String,
  titulo: String,
  descricao: String,
  tema: String,
})

module.exports = mongoose.model('Noticia', noticiaSchema)