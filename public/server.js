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
        console.error("❌ Erro ao salvar contato:", err);
        res.status(500).json({ error: 'Erro ao salvar contato' });
    }
});

// Rota para listar contatos
app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        console.error("❌ Erro ao buscar contatos:", err);
        res.status(500).json({ error: 'Erro ao buscar contatos' });
    }
});

// Rota para excluir contato
app.delete('/delete-contact/:id', async (req, res) => {
    console.log("🔹 Rota DELETE acionada");
    console.log("🔹 URL Recebida:", req.originalUrl);
    console.log("🔹 ID recebido:", req.params.id);

    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("⚠️ ID inválido:", id);
            return res.status(400).json({ error: "ID inválido" });
        }

        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            console.log("⚠️ Contato não encontrado no banco:", id);
            return res.status(404).json({ error: "Contato não encontrado" });
        }

        console.log("✅ Contato excluído com sucesso:", id);
        res.json({ message: "Contato excluído com sucesso!" });
    } catch (err) {
        console.error("❌ Erro ao excluir contato:", err);
        res.status(500).json({ error: "Erro ao excluir contato" });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
