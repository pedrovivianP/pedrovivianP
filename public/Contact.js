//O SITE ESTÁ RODANDO NA HOST RENDER:   https://listadecontatos.onrender.com/
//O SITE ESTÁ RODANDO NA HOST RENDER:   https://listadecontatos.onrender.com/
//O SITE ESTÁ RODANDO NA HOST RENDER:   https://listadecontatos.onrender.com/
//O SITE ESTÁ RODANDO NA HOST RENDER:   https://listadecontatos.onrender.com/
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    number: { type: String, required: true }, // Corrigido de "phone" para "number"
    address: { type: String, required: true } // Adicionado campo "address"
});

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;
