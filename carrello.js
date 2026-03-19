/*
// Inizializza il carrello dal localStorage o crea uno nuovo
function getCarrello() {
    const carrello = localStorage.getItem('mhs_carrello');
    return carrello ? JSON.parse(carrello) : [];
}

// Salva il carrello nel localStorage
function salvaCarrello(carrello) {
    localStorage.setItem('mhs_carrello', JSON.stringify(carrello));
    aggiornaContatore();
}

// Aggiorna il contatore nel menu
function aggiornaContatore() {
    const carrello = getCarrello();
    const totaleItems = carrello.reduce((sum, item) => sum + item.quantita, 0);
    const contatori = document.querySelectorAll('#cart-count');
    contatori.forEach(cont => {
        cont.textContent = totaleItems;
    });
}

// Aggiungi prodotto al carrello
function aggiungiCarrello(id, nome, prezzo) {
    const carrello = getCarrello();
    const esistente = carrello.find(item => item.id === id);
    
    if (esistente) {
        esistente.quantita++;
    } else {
        carrello.push({
            id: id,
            nome: nome,
            prezzo: prezzo,
            quantita: 1
        });
    }
    
    salvaCarrello(carrello);
    mostraNotifica(`${nome} aggiunto al carrello!`);
}

// Rimuovi prodotto dal carrello
function rimuoviDalCarrello(id) {
    let carrello = getCarrello();
    carrello = carrello.filter(item => item.id !== id);
    salvaCarrello(carrello);
    mostraCarrello();
}

// Modifica quantità
function modificaQuantita(id, delta) {
    const carrello = getCarrello();
    const item = carrello.find(i => i.id === id);
    
    if (item) {
        item.quantita += delta;
        if (item.quantita <= 0) {
            rimuoviDalCarrello(id);
            return;
        }
    }
    
    salvaCarrello(carrello);
    mostraCarrello();
}

// Mostra notifica
function mostraNotifica(messaggio) {
    // Rimuovi notifica esistente
    const esistente = document.querySelector('.notifica-carrello');
    if (esistente) esistente.remove();
    
    // Crea nuova notifica
    const notifica = document.createElement('div');
    notifica.className = 'notifica-carrello';
    notifica.innerHTML = `
        <i class=\"fas fa-check-circle\"></i>
        ${messaggio}
    `;
    notifica.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notifica);
    
    // Rimuovi dopo 3 secondi
    setTimeout(() => {
        notifica.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notifica.remove(), 300);
    }, 3000);
}

// Aggiungi stili per animazioni
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Mostra contenuto carrello nella pagina carrello
function mostraCarrello() {
    const carrello = getCarrello();
    const container = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const summary = document.getElementById('cart-summary');
    
    if (!container) return;
    
    // Rimuovi contenuto precedente (tranne empty-cart)
    const items = container.querySelectorAll('.cart-item');
    items.forEach(item => item.remove());
    
    if (carrello.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (summary) summary.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (summary) summary.style.display = 'block';
    
    // Mappa icone per prodotto
    const icone = {
        1: 'fa-microchip',
        2: 'fa-home',
        3: 'fa-building',
        4: 'fa-thermometer-half',
        5: 'fa-wind',
        6: 'fa-tint',
        7: 'fa-cog',
        8: 'fa-server'
    };
    
    // Aggiungi ogni prodotto
    carrello.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class=\"cart-item-image\">
                <i class=\"fas ${icone[item.id] || 'fa-box'}\"></i>
            </div>
            <div class=\"cart-item-info\">
                <h4>${item.nome}</h4>
                <p class=\"item-price\">€${item.prezzo.toFixed(2)}</p>
            </div>
            <div class=\"quantity-controls\">
                <button onclick=\"modificaQuantita(${item.id}, -1)\">-</button>
                <span>${item.quantita}</span>
                <button onclick=\"modificaQuantita(${item.id}, 1)\">+</button>
            </div>
            <span class=\"remove-item\" onclick=\"rimuoviDalCarrello(${item.id})\">
                <i class=\"fas fa-trash\"></i>
            </span>
        `;
        container.insertBefore(div, emptyCart);
    });
    
    // Calcola totali
    const subtotale = carrello.reduce((sum, item) => sum + (item.prezzo * item.quantita), 0);
    const spedizione = subtotale > 200 ? 0 : 9.99;
    const totale = subtotale + spedizione;
    
    document.getElementById('subtotale').textContent = `€${subtotale.toFixed(2)}`;
    document.getElementById('spedizione').textContent = spedizione === 0 ? 'GRATIS' : `€${spedizione.toFixed(2)}`;
    document.getElementById('totale').textContent = `€${totale.toFixed(2)}`;
}

// Procedi al checkout
function checkout() {
    const carrello = getCarrello();
    if (carrello.length === 0) {
        alert('Il carrello è vuoto!');
        return;
    }
    
    // Mostra sezione checkout
    const checkoutSection = document.getElementById('checkout-section');
    if (checkoutSection) {
        checkoutSection.style.display = 'block';
        checkoutSection.scrollIntoView({ behavior: 'smooth' });
        
        // Prepara dati per il form
        const subtotale = carrello.reduce((sum, item) => sum + (item.prezzo * item.quantita), 0);
        const spedizione = subtotale > 200 ? 0 : 9.99;
        const totale = subtotale + spedizione;
        
        document.getElementById('carrello-data').value = JSON.stringify(carrello);
        document.getElementById('totale-data').value = totale.toFixed(2);
    }
}

// Svuota carrello
function svuotaCarrello() {
    localStorage.removeItem('mhs_carrello');
    aggiornaContatore();
    mostraCarrello();
}

// Inizializza al caricamento
document.addEventListener('DOMContentLoaded', function() {
    aggiornaContatore();
});*/
/*
// Funzioni base di lettura/scrittura
const getCarrello = () => JSON.parse(localStorage.getItem('mhs_carrello')) || { quantita: 0 };
const salvaCarrello = (dati) => {
    localStorage.setItem('mhs_carrello', JSON.stringify(dati));
    document.querySelectorAll('#cart-count').forEach(c => c.textContent = dati.quantita);
};

// Aggiungi o rimuovi (delta può essere 1 o -1)
function aggiornaProdotto(delta) {
    let carrello = getCarrello();
    carrello.quantita = Math.max(0, carrello.quantita + delta);
    
    salvaCarrello(carrello);
    renderCarrello(); 
}
*/
// Mostra i dati nella pagina
function renderCarrello() {
    const carrello = getCarrello();
    const prezzoUnitario = 49.99; // Imposta il tuo prezzo qui
    const totale = carrello.quantita * prezzoUnitario;

    // Aggiorna i testi se esistono nel DOM
    if (document.getElementById('cart-qty')) {
        document.getElementById('cart-qty').textContent = carrello.quantita;
        document.getElementById('totale').textContent = `€${totale.toFixed(2)}`;
    }
    
    // Mostra/Nascondi messaggio carrello vuoto
    const display = carrello.quantita > 0 ? 'block' : 'none';
    if (document.getElementById('cart-summary')) {
        document.getElementById('cart-summary').style.display = display;
    }
}

// Inizializza al caricamento
document.addEventListener('DOMContentLoaded', renderCarrello);
