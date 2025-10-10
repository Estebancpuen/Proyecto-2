document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos HTML
    const form = document.getElementById('feedbackForm');
    const formSection = document.getElementById('feedback-form-section');
    const successMessage = document.getElementById('success-message');

    // 1. Manejador de evento para el formulario
    form.addEventListener('submit', function(event) {
        // CLAVE: Prevenir el comportamiento por defecto (que es recargar la página)
        event.preventDefault();

        // 2. Aquí iría la lógica real de envío de datos (e.g., fetch(POST, ...))
        // Como estamos simulando, simplemente mostramos el éxito.
        
        // Simular un pequeño retraso para parecer que está "procesando"
        setTimeout(() => {
            // 3. Ocultar la sección del formulario
            formSection.style.display = 'none';

            // 4. Mostrar el mensaje de éxito
            successMessage.style.display = 'flex'; // Usar 'flex' para aplicar los estilos de centrado

            // 5. Opcional: Desplazar la ventana al inicio del mensaje de éxito
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        }, 500); // 500 milisegundos (0.5 segundos) de simulación de envío
    });

    // Opcional: Añadir sonido al botón de enviar (asumiendo que tienes el archivo y la lógica de sonido)
    attachFeedbackSound();
});


/**
 * Adjunta el evento de sonido al botón de acción después de que el DOM está listo.
 */
function attachFeedbackSound() {
    // La ruta es relativa al HTML (feedback.html)
    const clickSound = new Audio('recursos/digital-click-357350.mp3'); 
    
    // Selecciona el botón de enviar
    const submitButton = document.querySelector('.feedback-form button[type="submit"]');
    // Selecciona el botón de volver en el mensaje de éxito
    const backButton = document.querySelector('#success-message .btn-primary');

    if (submitButton && !submitButton.hasAttribute('data-sound-attached')) {
        submitButton.addEventListener('click', () => {
             // Solo reproduce si el formulario es válido (el 'required' en el textarea debería ayudar)
             if (document.getElementById('feedbackForm').checkValidity()) {
                clickSound.pause();
                clickSound.currentTime = 0;
                clickSound.play().catch(error => {});
             }
        });
        submitButton.setAttribute('data-sound-attached', 'true');
    }

    if (backButton && !backButton.hasAttribute('data-sound-attached')) {
        backButton.addEventListener('click', () => {
            clickSound.pause();
            clickSound.currentTime = 0;
            clickSound.play().catch(error => {});
        });
        backButton.setAttribute('data-sound-attached', 'true');
    }
}