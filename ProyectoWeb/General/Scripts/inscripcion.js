document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    const inscripcionSection = document.getElementById('inscripcion-seccion');
    const successSection = document.getElementById('success-seccion');

    // Inicialmente ocultar la sección de éxito
    successSection.style.display = 'none';

    // Obtener ID y Título del evento desde la URL (pasado desde detalle.js)
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');
    const eventTitle = params.get('titulo');

    // 1. Cargar el JSON y renderizar los textos
    loadInscripcionData(eventId, eventTitle);

    // 2. Manejar la simulación de envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Aquí iría la lógica real de envío de datos (e.g., fetch(api, { method: 'POST', body: formData }))

        // Simulación de registro exitoso:
        setTimeout(() => {
            handleSuccessfulRegistration(inscripcionSection, successSection);
        }, 500); // Retardo para simular el procesamiento
    });
});

/**
 * Carga los textos de la sección 'inscripcion' de data.json y los inyecta en el HTML.
 * También muestra el evento al que se está inscribiendo.
 * @param {string} id - El ID del evento.
 * @param {string} titulo - El título del evento.
 */
async function loadInscripcionData(id, titulo) {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('No se pudo cargar data.json');
        const data = await response.json();
        const textos = data.inscripcion;

        if (!textos) {
            document.getElementById('inscripcion-titulo').textContent = 'Error: Textos de inscripción no encontrados.';
            return;
        }

        // Inyectar textos del formulario
        document.getElementById('inscripcion-titulo').textContent = textos.titulo;
        document.getElementById('inscripcion-subtitulo').textContent = textos.subtitulo;
        document.getElementById('evento-a-inscribir').textContent = `Evento: ${decodeURIComponent(titulo)}`;
        
        // Inyectar labels de los campos
        document.getElementById('label-nombre').textContent = textos.campos.nombre + ':';
        document.getElementById('label-correo').textContent = textos.campos.correo + ':';
        document.getElementById('label-telefono').textContent = textos.campos.telefono + ':';
        document.getElementById('label-codigo').textContent = textos.campos.codigo_estudiantil + ':';
        document.getElementById('label-carrera').textContent = textos.campos.carrera + ':';
        
        // Inyectar texto del botón
        document.getElementById('boton-inscribir').textContent = textos.acciones.boton_inscribir;

        // Inyectar textos de éxito (aunque la sección esté oculta)
        document.getElementById('mensaje-exito-titulo').textContent = textos.acciones.mensaje_exito_titulo;
        document.getElementById('mensaje-exito-cuerpo').textContent = textos.acciones.mensaje_exito_cuerpo;
        document.getElementById('boton-regresar').textContent = textos.acciones.boton_regresar;

    } catch (error) {
        console.error("Error al cargar los textos del formulario:", error);
        document.getElementById('inscripcion-titulo').textContent = 'Error al cargar los datos. Inténtalo de nuevo.';
    }
}

/**
 * Muestra el mensaje de éxito y oculta el formulario.
 * @param {HTMLElement} formSection - La sección del formulario.
 * @param {HTMLElement} successSection - La sección de éxito.
 */
function handleSuccessfulRegistration(formSection, successSection) {
    // Ocultar el formulario
    formSection.style.display = 'none';

    // Mostrar el mensaje de éxito
    successSection.style.display = 'flex'; // Usar flex para centrar
    
    // Opcional: Agregar lógica de sonido para la confirmación
    // const successSound = new Audio('ruta/a/sonido/exito.mp3'); 
    // successSound.play();
}