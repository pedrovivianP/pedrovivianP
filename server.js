const express = require('express');
const cors = require('cors');
const mongoose = require('./database');
const Contact = require('./contact');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Adicionar contato
app.post('/add-contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.json(contact);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao salvar contato' });
    }
});

// Listar contatos
app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar contatos' });
    }
});

// Excluir contato
app.post('/delete-contact', async (req, res) => {
    try {
        const { name } = req.body;
        const result = await Contact.deleteOne({ name });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Contato não encontrado' });
        }
        res.json({ message: 'Contato excluído' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir contato' });
    }
});

// Atualizar contato
app.put('/update-contact/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedContact = await Contact.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedContact) {
            return res.status(404).json({ error: 'Contato não encontrado' });
        }
        res.json(updatedContact);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar contato' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});