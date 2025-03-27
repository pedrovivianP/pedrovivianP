const mongoose = require('mongoose');

const uri = "mongodb+srv://pedropassarello:7RrocZ2XF2cFwlfX@cluster0.0fahvdt.mongodb.net/nomeDoBanco?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, {})
.then(() => console.log("MongoDB Atlas conectado com sucesso!"))
.catch(err => console.error("Erro ao conectar ao MongoDB:", err));

module.exports = mongoose;
