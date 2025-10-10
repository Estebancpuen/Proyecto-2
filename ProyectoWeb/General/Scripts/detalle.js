document.addEventListener('DOMContentLoaded', () => {
    const eventoDetalleContainer = document.getElementById('evento-detalle');
    const eventId = getEventIdFromUrl();

    if (!eventId) {
        renderError('Error: No se encontró el ID del evento en la URL.', eventoDetalleContainer);
        return;
    }

    // Llama a la única función fetchAndRenderEvent
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
        if (data.secciones?.actividadesSemana?.eventos) {
            todosLosEventos = todosLosEventos.concat(data.secciones.actividadesSemana.eventos);
        }

        // 2. Añadir eventos de Próximos Eventos Destacados
        if (data.secciones?.eventosDestacados?.eventos) {
            todosLosEventos = todosLosEventos.concat(data.secciones.eventosDestacados.eventos);
        }

        // Busca el evento que coincide con el ID en el array combinado
        const eventoEncontrado = todosLosEventos.find(e => e.id === id);

        if (eventoEncontrado) {
            // 1. Inyecta el HTML
            container.innerHTML = renderEventDetail(eventoEncontrado);
            
            // 2. 🔥 LLAMADA CLAVE: Adjunta los listeners de sonido SOLO después de que el HTML existe.
            attachDetailSound(); 
        } else {
            // Si el ID es válido pero no se encuentra en NINGUNA lista.
            renderError(`Evento con ID "${id}" no encontrado en ninguna sección.`, container);
        }

    } catch (error) {
        console.error("Error al cargar o renderizar el evento:", error);
        renderError(`Ocurrió un error al cargar los datos: ${error.message}`, container);
    }
}

/**
 * Genera el HTML de la vista de detalle del evento con estructura de dos columnas.
 * @param {object} evento - El objeto del evento.
 * @returns {string} El HTML generado.
 */
function renderEventDetail(evento) {
    // 1. Extracción de datos comunes
    // Usamos el campo 'fecha' ya que es el que viene de data.json (ej: "Lunes, Miércoles, Viernes" o "2025-09-24")
    const fechaCompleta = evento.fecha; 
    const horaTexto = evento.hora || '09:00-17:00';
    const ubicacionTexto = evento.ubicacion || 'Lugar no especificado';
    const capacidadTexto = evento.capacidad || 'N/A';
    const organizaTexto = evento.organiza || 'No especificado';

    // 2. Procesamiento de la fecha y generación del bloque de metadato de fecha/hora
    let metadatoFechaHoraHTML;
    
    // Intentamos parsear la fecha si se parece a 'YYYY-MM-DD' para usar el estilo de calendario
    // Usamos fecha.match para determinar si es un formato de fecha ISO estándar.
    const esFechaEstandar = fechaCompleta && fechaCompleta.match(/^\d{4}-\d{2}-\d{2}$/);

    if (esFechaEstandar) {
        // LÓGICA DE FECHA ESTÁNDAR (CALENDARIO VISUAL)
        const dateObj = new Date(fechaCompleta + 'T00:00:00'); // Asegura zona horaria neutra
        const opcionesDia = { weekday: 'long' };
        const opcionesMes = { month: 'short' };
        const opcionesDiaNum = { day: '2-digit' };
        
        const dia = dateObj.toLocaleDateString('es-CO', opcionesDiaNum);
        const mes = dateObj.toLocaleDateString('es-CO', opcionesMes).toUpperCase().replace('.', '');
        const diaSemana = dateObj.toLocaleDateString('es-CO', opcionesDia).toUpperCase();
        
        metadatoFechaHoraHTML = `
            <div class="metadato-bloque metadato-fecha-hora">
                <span class="metadato-dia-num">${dia}</span>
                <span class="metadato-mes">${mes}</span>
                <span class="metadato-dia-semana">${diaSemana}</span>
                <span class="metadato-hora-rango">${horaTexto}</span>
            </div>
        `;

    } else {
        // LÓGICA DE FECHA NO ESTÁNDAR (TEXTO SIMPLE, EVITANDO EL CALENDARIO GRANDE)
        // Esto evita usar las clases .metadato-dia-num y .metadato-mes que causan el error de estilo/color.
        metadatoFechaHoraHTML = `
            <div class="metadato-bloque metadato-fecha-hora-texto">
                <h3 class="metadato-subtitulo">Fecha y Hora</h3>
                <p class="metadato-linea">
                    <span class="metadato-icono">🗓️</span>
                    <span class="metadato-label">Fechas:</span> ${fechaCompleta}
                </p>
                <p class="metadato-linea">
                    <span class="metadato-icono">⏰</span>
                    <span class="metadato-label">Horario:</span> ${horaTexto}
                </p>
            </div>
        `;
    }


    // 3. Generación del HTML final
    return `
        <div class="evento-detalle-container">
            <h1 class="evento-titulo-principal">${evento.titulo}</h1>

            <div class="evento-layout">
                
                <div class="evento-col-principal">
                    <img src="${evento.imagenUrl}" alt="Imagen del evento: ${evento.titulo}" class="evento-detalle-imagen">
                    <p class="evento-descripcion-larga">${evento.descripcionLarga}</p>
                </div>
                
                <div class="evento-col-metadatos">

                    ${metadatoFechaHoraHTML}

                    <div class="metadato-bloque">
                        <h3 class="metadato-subtitulo">Detalles</h3>
                        
                        <p class="metadato-linea">
                            <span class="metadato-icono">📍</span>
                            <span class="metadato-label">Ubicación:</span> ${ubicacionTexto}
                        </p>
                        
                        <p class="metadato-linea">
                            <span class="metadato-icono">👥</span>
                            <span class="metadato-label">Capacidad:</span> ${capacidadTexto}
                        </p>
                        
                        <p class="metadato-linea">
                            <span class="metadato-icono">🏢</span>
                            <span class="metadato-label">Organiza:</span> ${organizaTexto}
                        </p>

                        <p class="metadato-linea">
                            <span class="tag tag-detalle ${evento.etiqueta}">${evento.etiqueta}</span>
                        </p>
                    </div>

                </div>

            </div>
            
            <div class="evento-detalle-acciones">
                <a href="index.html" class="btn-action-secondary">Volver a la lista</a>
                
                <a href="inscripcion.html?id=${evento.id}&titulo=${encodeURIComponent(evento.titulo)}" class="btn-action-primary btn-inscripcion">
                    Inscribirse
                </a>
            </div>

        </div>
    `;
}

/**
 * Renderiza un mensaje de error dentro del contenedor de detalle.
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

/**
 * Adjunta el evento de sonido a los botones de acción después de que el HTML es inyectado.
 */
function attachDetailSound() {
    // Usamos 'new Audio' dentro de la función para asegurar que se crea cuando la página está lista
    const clickSound = new Audio('recursos/digital-click-357350.mp3'); 
    
    // Selecciona los botones que acaban de ser inyectados
    const actionButtons = document.querySelectorAll(
        '.btn-action-secondary, .btn-inscripcion, .error-state a, .navbar a' 
    );

    actionButtons.forEach(button => {
        // Solo agrega el listener si no lo tiene
        if (!button.hasAttribute('data-sound-attached')) {
            button.addEventListener('click', () => {
                // Reinicia y reproduce el sonido
                clickSound.pause();
                clickSound.currentTime = 0;
                clickSound.play().catch(error => {
                    // Ignora el error de 'not allowed' de reproducción automática
                });
            });
            button.setAttribute('data-sound-attached', 'true'); // Marca el botón como "sonido adjunto"
        }
    });
}