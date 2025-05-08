//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
const SERVER_URL = "https://listadecontatos.onrender.com";
let isSorted = false;
let originalContacts = [];

document.addEventListener("DOMContentLoaded", () => {
    loadContacts();

    formatPhone(document.getElementById('number'));
    formatPhone(document.getElementById('editNumber'));

    const sortBtn = document.getElementById('sortAlphaBtn');
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            isSorted = !isSorted;
            renderContacts();
            sortBtn.textContent = isSorted ? "↻ Ordem Original" : "Ordenar A-Z";
        });
    }
});

async function loadContacts() {
    try {
        let response = await fetch(`${SERVER_URL}/contacts`);
        let contacts = await response.json();
        originalContacts = contacts;
        renderContacts();
    } catch (error) {
        console.error("Erro ao carregar contatos:", error);
        showToast("Erro ao carregar contatos", "danger");
    }
}

function renderContacts() {
    let contacts = [...originalContacts];

    if (isSorted) {
        contacts.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    }

    let contactList = document.getElementById("contactList");
    contactList.innerHTML = "";

    contacts.forEach(contact => {
        let contactCard = `
            <div class="col-md-4">
                <div class="card mb-3 contact-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <h5 class="card-title">${contact.name}</h5>
                            <div class="dropdown">
                                <button class="btn btn-light btn-sm" type="button" data-bs-toggle="dropdown">⋮</button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <button class="dropdown-item" onclick="toggleFavorite('${contact._id}', ${contact.favorite})">
                                            ${contact.favorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="dropdown-item" onclick="openEditModal('${contact._id}', '${contact.name}', '${contact.number}', '${contact.address}', '${contact.email}')">Editar</button>
                                    </li>
                                    <li>
                                        <button class="dropdown-item text-danger" onclick="deleteContact('${contact._id}')">Excluir</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <p class="card-text">📞 ${contact.number || 'Não informado'}</p>
                        <p class="card-text">🏠 ${contact.address || 'Não informado'}</p>
                        <p class="card-text">✉️ ${contact.email || 'Não informado'}</p>
                        ${contact.favorite ? '<span class="badge bg-warning text-dark">★ Favorito</span>' : ''}
                    </div>
                </div>
            </div>`;
        contactList.innerHTML += contactCard;
    });
}

document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    let name = document.getElementById('name').value.trim();
    let number = document.getElementById('number').value.trim();
    let address = document.getElementById('address').value.trim();
    let email = document.getElementById('email').value.trim();

    if (!name && !number && !address && !email) {
        showToast("Preencha pelo menos um campo!", "danger");
        return;
    }

    let contact = { name, number, address, email };

    let response = await fetch(`${SERVER_URL}/add-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });

    if (response.ok) {
        const newContact = await response.json();
        originalContacts.push(newContact);
    
        // NÃO renderiza com ordenação se isSorted for false
        renderContacts();
    
        document.getElementById('contactForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('addContactModal')).hide();
        showToast("Contato salvo com sucesso!", "success");
    } else {
        const data = await response.json();
        showToast(data.message || "Erro ao salvar contato", "danger");
    }
});

async function deleteContact(id) {
    let response = await fetch(`${SERVER_URL}/delete-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });

    if (response.ok) {
        originalContacts = originalContacts.filter(contact => contact._id !== id);
        renderContacts();
        showToast("Contato excluído com sucesso", "success");
    } else {
        showToast("Erro ao excluir contato", "danger");
    }
}

function openEditModal(id, name, number, address, email) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editNumber').value = number;
    document.getElementById('editAddress').value = address;
    document.getElementById('editEmail').value = email;

    new bootstrap.Modal(document.getElementById('editContactModal')).show();
}

document.getElementById('editForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('editId').value;
    const updatedContact = {
        name: document.getElementById('editName').value,
        number: document.getElementById('editNumber').value,
        address: document.getElementById('editAddress').value,
        email: document.getElementById('editEmail').value
    };

    const campos = [
        updatedContact.name,
        updatedContact.number,
        updatedContact.address,
        updatedContact.email
    ];
    const algumPreenchido = campos.some(campo => campo.trim() !== "");
    
    if (!algumPreenchido) {
        showToast("Preencha pelo menos um campo para atualizar!", "danger");
        return;
    }

    let response = await fetch(`${SERVER_URL}/update-contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContact)
    });

    if (response.ok) {
        const index = originalContacts.findIndex(c => c._id === id);
        if (index !== -1) {
            originalContacts[index] = { ...originalContacts[index], ...updatedContact };
        }
        renderContacts();
        bootstrap.Modal.getInstance(document.getElementById('editContactModal')).hide();
        showToast("Contato atualizado com sucesso", "success");
    } else {
        showToast("Erro ao atualizar contato", "danger");
    }
});

async function toggleFavorite(id, currentStatus) {
    try {
        await fetch(`${SERVER_URL}/update-contact/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favorite: !currentStatus })
        });

        const contact = originalContacts.find(c => c._id === id);
        if (contact) contact.favorite = !currentStatus;

        renderContacts();
    } catch (err) {
        console.error("Erro ao atualizar favorito:", err);
        showToast("Erro ao atualizar favorito", "danger");
    }
}

function formatPhone(input) {
    input.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        let formatted = '';
        if (value.length > 0) formatted += '(' + value.substring(0, 2);
        if (value.length >= 3) formatted += ') ' + value.substring(2, 7);
        if (value.length >= 8) formatted += '-' + value.substring(7, 11);

        e.target.value = formatted;
    });
}

function showToast(message, type = "info") {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0 show`;
    toast.setAttribute('role', 'alert');
    toast.style.marginBottom = '10px';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';  // POSICIONA NO CANTO INFERIOR DIREITO
    container.style.zIndex = '9999';
    container.style.maxWidth = '300px';
    document.body.appendChild(container);
    return container;
}