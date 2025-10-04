document.addEventListener('DOMContentLoaded', () => {
    const eventoDetalleContainer = document.getElementById('evento-detalle');
    const eventId = getEventIdFromUrl();

    if (!eventId) {
        renderError('Error: No se encontró el ID del evento en la URL.', eventoDetalleContainer);
        return;
    }

    fetchAndRenderEvent(eventId, eventoDetalleContainer);
});

/**
 * Obtiene el valor del parámetro 'id' de la URL actual.
 * @returns {string | null} El ID del evento o null si no se encuentra.
 */
function getEventIdFromUrl() {
    // URLSearchParams simplifica la lectura de parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * Carga el JSON, busca el evento por ID y lo renderiza.
 * @param {string} id - El ID del evento a buscar.
 * @param {HTMLElement} container - El elemento donde se renderizará el contenido.
 */
async function fetchAndRenderEvent(id, container) {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo data.json');
        }
        const data = await response.json();
        
        // Creamos un array combinado con todos los eventos para una búsqueda unificada
        let todosLosEventos = [];

        // 1. Añadir eventos de Actividades de la Semana
        if (data.secciones && data.secciones.actividadesSemana && data.secciones.actividadesSemana.eventos) {
            todosLosEventos = todosLosEventos.concat(data.secciones.actividadesSemana.eventos);
        }

        // 2. Añadir eventos de Próximos Eventos Destacados
        if (data.secciones && data.secciones.eventosDestacados && data.secciones.eventosDestacados.eventos) {
            todosLosEventos = todosLosEventos.concat(data.secciones.eventosDestacados.eventos);
        }

        // Busca el evento que coincide con el ID en el array combinado
        const eventoEncontrado = todosLosEventos.find(e => e.id === id);

        if (eventoEncontrado) {
            container.innerHTML = renderEventDetail(eventoEncontrado);
        } else {
            // Si el ID es válido pero no se encuentra en NINGUNA lista.
            renderError(`Evento con ID "${id}" no encontrado en ninguna sección.`, container);
        }

    } catch (error) {
        console.error("Error al cargar o renderizar el evento:", error);
        // El error literal "Cannot read properties of null..." se resuelve 
        // porque ahora revisamos la existencia de data.secciones antes de acceder.
        renderError(`Ocurrió un error al cargar los datos: ${error.message}`, container);
    }
}

/**
 * Genera el HTML de la vista de detalle del evento con estructura de dos columnas.
 * @param {object} evento - El objeto del evento.
 * @returns {string} El HTML generado.
 */
function renderEventDetail(evento) {
    // 1. Extracción de datos de metadatos (ahora desde los campos separados)
    const fechaISO = evento.fecha; // Espera formato 'YYYY-MM-DD'
    const horaTexto = evento.hora || '09:00-17:00'; 
    const ubicacionTexto = evento.ubicacion || 'Lugar no especificado';
    const capacidadTexto = evento.capacidad || 'N/A';
    const organizaTexto = evento.organiza || 'No especificado';
    
    // 2. Procesamiento de la fecha para los bloques de metadatos
    let dia = '25';
    let mes = 'NOV';
    let diaSemana = 'Viernes';
    
    try {
        const fechaObj = new Date(fechaISO + 'T12:00:00'); // Añadimos hora para evitar problemas de zona horaria
        if (!isNaN(fechaObj)) {
            dia = fechaObj.getDate().toString();
            mes = fechaObj.toLocaleString('es-ES', { month: 'short' }).toUpperCase().replace('.', ''); // Ej. NOV
            diaSemana = fechaObj.toLocaleString('es-ES', { weekday: 'long' });
        }
    } catch (e) {
        // En caso de error, mantenemos los valores por defecto
        console.error("Error al procesar la fecha:", e);
    }
    
    // 3. Fallback para la URL de la imagen.
    const imagenUrl = evento.imagenUrlDetalle || evento.imagenUrl || 'https://placehold.co/900x450/960000/fff?text=Imagen+del+Evento';

    // Generamos la plantilla con la nueva estructura de dos columnas
    return `
        <div class="evento-detalle-container">
            <h1 class="evento-titulo-principal">${evento.titulo}</h1>

            <div class="evento-layout">
                
                <div class="evento-col-principal">
                    <img src="${imagenUrl}" alt="${evento.titulo}" class="evento-detalle-imagen">
                    
                    <h2 class="evento-descripcion-titulo">Descripción del Evento</h2>
                    <div class="evento-detalle-descripcion">
                        <p>${evento.descripcionLarga || 
                            evento.descripcionCorta || 'Descripción detallada no disponible.'}</p>
                    </div>

                    <div class="evento-acciones-principal">
                        <a href="#" class="btn-inscripcion">¡Inscríbete aquí!</a>
                    </div>
                </div>

                <div class="evento-col-metadatos">
                    <div class="evento-metadatos-titulo-bloque">
                        ${evento.subtitulo || 'Detalles Importantes'}
                    </div>

                    <div class="evento-metadatos-bloque evento-fecha-bloque">
                        <span class="metadato-dia">${dia}</span> 
                        <span class="metadato-mes">${mes}</span>
                        <span class="metadato-dia-semana">${diaSemana}</span>
                        <span class="metadato-hora-rango">${horaTexto}</span>
                    </div>

                    <div class="evento-metadatos-bloque">
                        <h3 class="metadato-subtitulo">Detalles del Evento</h3>
                        
                        <p class="metadato-linea"><span class="metadato-icono">📍</span> <span class="metadato-label">Ubicación</span>: ${ubicacionTexto}</p>
                        <p class="metadato-linea"><span class="metadato-icono">👥</span> <span class="metadato-label">Capacidad</span>: ${capacidadTexto} personas</p>
                        <p class="metadato-linea"><span class="metadato-icono">🏢</span> <span class="metadato-label">Organiza</span>: ${organizaTexto}</p>
                    </div>

                </div>

            </div>

             <div class="evento-detalle-acciones">
                <a href="index.html" class="btn-action-secondary">← Volver a Eventos</a>
            </div>
        </div>
    `;
}

/**
 * Renderiza un mensaje de error o evento no encontrado.
 * @param {string} message - El mensaje de error.
 * @param {HTMLElement} container - El elemento donde se renderizará el mensaje.
 */
function renderError(message, container) {
    container.innerHTML = `
        <div class="error-state">
            <h2>¡Lo sentimos!</h2>
            <p>${message}</p>
            <a href="index.html" class="btn-action-primary">Ir a la página principal</a>
        </div>
    `;
}
