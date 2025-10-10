document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener la categoría de la URL
    const categoria = getCategoryFromUrl();
    const tituloElement = document.getElementById('categoriaTitulo');
    const gridElement = document.getElementById('eventosFiltradosGrid');
    const loadingMessage = document.getElementById('loadingMessage');
    
    // Si no hay categoría en la URL
    if (!categoria) {
        tituloElement.textContent = 'Error: Categoría no especificada.';
        gridElement.innerHTML = '<p class="text-center p-8">Por favor, selecciona una categoría válida desde la página principal.</p>';
        return;
    }

    // Mostrar la categoría en el título mientras se carga
    tituloElement.textContent = `Eventos en la categoría: ${categoria}`;
    
    // 2. Iniciar la carga y renderizado
    fetchAndFilterEvents(categoria, gridElement, loadingMessage);
});

/**
 * Obtiene el valor del parámetro 'nombre' de la URL actual.
 * @returns {string | null} El nombre de la categoría o null si no se encuentra.
 */
function getCategoryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('nombre');
}

/**
 * Carga el JSON, filtra los eventos por categoría y los renderiza.
 * @param {string} categoria - El nombre de la categoría a filtrar.
 * @param {HTMLElement} gridElement - El elemento donde se renderizará el contenido.
 * @param {HTMLElement} loadingMessage - El elemento para mensajes de estado.
 */
async function fetchAndFilterEvents(categoria, gridElement, loadingMessage) {
    const dataUrl = 'data.json';
    try {
        const response = await fetch(dataUrl);
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo data.json');
        }
        const data = await response.json();
        
        // Combinar todos los eventos para la búsqueda
        let todosLosEventos = [];
        if (data.secciones?.actividadesSemana?.eventos) {
            todosLosEventos = todosLosEventos.concat(data.secciones.actividadesSemana.eventos);
        }
        
        if (data.secciones?.eventosDestacados?.eventos) {
            todosLosEventos = todosLosEventos.concat(data.secciones.eventosDestacados.eventos);
        }
        
        // FILTRADO CLAVE: Buscar todos los eventos cuya 'etiqueta' coincida con la categoría
        const eventosFiltrados = todosLosEventos.filter(evento => 
            evento.etiqueta === categoria // Filtra por la clave 'etiqueta'
        );
        
        loadingMessage.style.display = 'none'; // Oculta el mensaje de carga

        if (eventosFiltrados.length > 0) {
            // Reutilizamos la función de renderizado de la cuadrícula de eventos
            renderEventGridFiltered(gridElement.id, eventosFiltrados);
            
            // 🔥 MODIFICACIÓN CLAVE: Llamar a la función de sonido aquí
            attachClickSound(); 
        } else {
            gridElement.innerHTML = `
                <div class="w-full text-center p-12 bg-gray-100 rounded-lg shadow-sm">
                    <p class="text-xl font-bold text-gray-700">🎉 No hay eventos de "${categoria}" programados por ahora.</p>
                    <p class="text-md text-gray-500 mt-2">¡Vuelve pronto para ver las novedades!</p>
                </div>
            `;
            gridElement.style.display = 'block'; 
            gridElement.style.maxWidth = '1000px'; 
        }

    } catch (error) {
        console.error("Error al cargar o filtrar eventos:", error);
        loadingMessage.textContent = `Error al cargar los datos: ${error.message}`;
        loadingMessage.className = 'text-center text-red-600 p-8';
    }
}

/**
 * Genera el HTML para la cuadrícula de eventos filtrados (Copia de renderEventGrid en script.js)
 * @param {string} elementId - El ID del elemento donde renderizar.
 * @param {array} eventos - La lista de eventos filtrados.
 */
function renderEventGridFiltered(elementId, eventos) {
    const grid = document.getElementById(elementId);
    if (!grid) return;

    // Aseguramos que la cuadrícula esté visible y como grid
    grid.style.display = 'grid'; 

    grid.innerHTML = eventos.map(evento => {
        // Determinar si es destacado.
        const isFeatured = evento.hasOwnProperty('categoria'); 
        
        const cardClass = isFeatured 
            ? 'card-evento destacado-filtrado' 
            : 'card-evento';
        
        // Enlace a evento.html con el ID
        const linkUrl = `evento.html?id=${evento.id}`;

        return `
            <div class="${cardClass}">
                <img src="${evento.imagenUrl}" alt="${evento.titulo}">
                
                <div class="card-evento-info">
                    <span class="tag ${evento.etiqueta}">${evento.etiqueta}</span>
                    
                    <h3>${evento.titulo}</h3>
                    
                    <p class="fecha">${evento.fecha}</p>
                    
                    <p class="descripcion">${evento.descripcionCorta}</p>
                </div>
                
                <a href="${linkUrl}" class="btn-secondary">
                    Ver Detalle
                </a>
            </div>
        `;
    }).join('');
}

/**
 * Asigna el sonido de click a los enlaces de "Ver Detalle" después del renderizado.
 */
function attachClickSound() {
    // La ruta es relativa al HTML de la subpágina (categoria.html)
    const clickSound = new Audio('recursos/digital-click-357350.mp3');
    // Selecciona los enlaces de las tarjetas que acaban de ser inyectadas
     const detailLinks = document.querySelectorAll(
        '.card-evento a.btn-secondary, nav a' // <-- ¡Añadido nav a!
    );

    detailLinks.forEach(link => {
        // Evita asignar el listener dos veces
        if (!link.hasAttribute('data-sound-attached')) {
            link.addEventListener('click', () => {
                clickSound.pause();
                clickSound.currentTime = 0;
                clickSound.play().catch(error => {
                    // Si falla la reproducción, no pasa nada
                });
            });
            link.setAttribute('data-sound-attached', 'true');
        }
    });
}