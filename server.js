const express = require('express');
const mongoose = require('./database'); // Importa a conexão com o banco
const Contact = require('./public/Contact'); // Importa o modelo Contact
const path = require('path');

const app = express();
app.use(express.json());

// Servir arquivos estáticos (como o HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Servir a página principal
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
        const { name } = req.body;
        await Contact.deleteOne({ name });
        res.json({ message: 'Contato excluído' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir contato' });
    }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
