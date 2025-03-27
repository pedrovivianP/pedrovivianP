document.addEventListener("DOMContentLoaded", loadContacts);

async function loadContacts() {
    try {
        let response = await fetch("https://listadecontatos.onrender.com/contacts");
        let contacts = await response.json();

        let contactList = document.getElementById("contactList");
        contactList.innerHTML = "";

        contacts.forEach(contact => {
            let contactCard = `
                <div class="col-md-4" data-id="${contact._id}">
                    <div class="card mb-3 contact-card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <h5 class="card-title">${contact.name}</h5>
                                <div class="dropdown">
                                    <button class="btn btn-light btn-sm" type="button" data-bs-toggle="dropdown">⋮</button>
                                    <ul class="dropdown-menu">
                                        <li><button class="dropdown-item text-danger" onclick="deleteContact('${contact._id}', this)">Excluir</button></li>
                                    </ul>
                                </div>
                            </div>
                            <p class="card-text">📞 ${contact.number}</p>
                            <p class="card-text">🏠 ${contact.address}</p>
                            <p class="card-text">✉️ ${contact.email}</p>
                        </div>
                    </div>
                </div>`;
            
            contactList.innerHTML += contactCard;
        });
    } catch (error) {
        console.error("❌ Erro ao carregar contatos:", error);
    }
}

document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    let contact = {
        name: document.getElementById('name').value,
        number: document.getElementById('number').value,
        address: document.getElementById('address').value,
        email: document.getElementById('email').value
    };
    
    let response = await fetch('https://listadecontatos.onrender.com/add-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });

    if (response.ok) {
        console.log("✅ Contato adicionado com sucesso!");
        loadContacts();
        document.getElementById('contactForm').reset();
        let modal = new bootstrap.Modal(document.getElementById('addContactModal'));
        modal.hide();
    } else {
        console.error("❌ Erro ao adicionar contato");
    }
});

async function deleteContact(id, button) {
    if (!id) {
        console.error("❌ ID do contato não encontrado!");
        return;
    }

    console.log(`🟡 Tentando excluir contato com ID: ${id}`);
    console.log(`🟡 URL da requisição: https://listadecontatos.onrender.com/delete-contact/${id}`);

    let response = await fetch(`https://listadecontatos.onrender.com/delete-contact/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        console.log("✅ Contato excluído com sucesso");
        button.closest('.col-md-4').remove();
    } else {
        console.error("❌ Erro ao excluir contato:", response.status);
    }
}
