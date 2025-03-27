const express = require('express');
const mongoose = require('./database'); 
const Contact = require('./contact'); 
const path = require('path');

const app = express();
app.use(express.json());
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
app.delete('/delete-contact/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "ID não fornecido" });

        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) return res.status(404).json({ error: "Contato não encontrado" });

        res.json({ message: "Contato excluído com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao excluir contato" });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
