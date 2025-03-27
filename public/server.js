const express = require('express');
const mongoose = require('./database'); // Conexão com o banco
const Contact = require('./contact'); // Modelo Contact
const path = require('path');

const app = express();
app.use(express.json());

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para adicionar contato
app.post('/add-contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.json(contact);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao salvar contato' });
    }
});

// Rota para listar contatos
app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar contatos' });
    }
});

// Rota para excluir contato
app.post('/delete-contact', async (req, res) => {
    try {
        const { id } = req.body;
        await Contact.findByIdAndDelete(id);
        res.json({ message: 'Contato excluído' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir contato' });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
