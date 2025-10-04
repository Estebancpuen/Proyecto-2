// Cargar JSON dinámicamente
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    renderEventos(data.actividades, "actividadesGrid");
    renderEventos(data.proximos, "eventosGrid");
    renderCategorias(data.categorias, "categoriasGrid");
  });

// Renderizar tarjetas de eventos
function renderEventos(lista, containerId) {
  const container = document.getElementById(containerId);
  lista.forEach(evento => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${evento.imagen}" alt="${evento.titulo}">
      <div class="card-content">
        <span class="tag ${evento.tipo.toLowerCase()}">${evento.tipo}</span>
        <h3>${evento.titulo}</h3>
        <p>${evento.descripcion}</p>
      </div>
      <a href="#" class="btn-secondary">Ver más</a>
    `;

    container.appendChild(card);
  });
}

// Renderizar categorías
function renderCategorias(lista, containerId) {
  const container = document.getElementById(containerId);
  lista.forEach(cat => {
    const div = document.createElement("div");
    div.className = "categoria-card";
    div.textContent = cat;
    container.appendChild(div);
  });
}

// Desplazamiento suave personalizado
document.querySelectorAll('a[href^="#"]').forEach(enlace => {
  enlace.addEventListener('click', function(e) {
    e.preventDefault();
    const destino = document.querySelector(this.getAttribute('href'));
    if (destino) {
      window.scrollTo({
        top: destino.offsetTop - 60, // ajusta según la altura del navbar
        behavior: 'smooth'
      });
    }
  });
});


