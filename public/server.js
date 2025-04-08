const express = require('express');
const cors = require('cors');
const mongoose = require('./database'); // Conexão com MongoDB
const Contact = require('./Contact'); // Modelo do contato
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/add-contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.json(contact);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao salvar contato' });
    }
});

app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar contatos' });
    }
});

app.post('/delete-contact', async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Contact.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Contato não encontrado' });
        }

        res.json({ message: 'Contato excluído' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir contato' });
    }
});

app.put('/update-contact/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Contact.findByIdAndUpdate(id, req.body, { new: true });

        if (!updated) {
            return res.status(404).json({ error: 'Contato não encontrado' });
        }

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar contato' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});