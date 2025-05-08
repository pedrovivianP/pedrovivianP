//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    number: { type: String },
    address: { type: String },
    favorite: { type: Boolean, default: false } // novo campo
});

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;
