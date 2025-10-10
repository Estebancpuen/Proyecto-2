document.addEventListener('DOMContentLoaded', () => {
    // URL del archivo JSON (Ruta correcta para archivos en la raíz)
    const dataUrl = 'data.json';
    
    // Función de reintento para cargar JSON
    async function fetchWithRetry(url, maxRetries = 5) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    // Si el archivo existe pero devuelve un error HTTP (ej. 404), lanzamos error.
                    throw new Error(`HTTP error! status: ${response.status} al intentar cargar ${url}`);
                }
                // Intentamos parsear el JSON
                const json = await response.json();
                return json;
            } catch (error) {
                console.error(`Error de carga de data.json (Intento ${i + 1}):`, error.message);
                if (i === maxRetries - 1) throw error; // Re-lanza si es el último intento
                await new Promise(res => setTimeout(res, Math.pow(2, i) * 1000)); // Retardo exponencial
            }
        }
    }

    // --- FUNCIONES DE MANEJO DE SONIDO ---
    // NOTA: Esta función DEBE definirse antes de ser llamada en loadDataAndRender.
    function setupClickSound(audioPath) {
        // 1. Inicializar el objeto de audio.
        const clickSound = new Audio(audioPath);

        // 2. Seleccionar todos los elementos clicables que queremos afectar.
        // Incluye: Enlaces de Navbar, Botón Explorar (.btn-primary), Botones de Tarjeta (.btn-secondary), Botones de Categoría (.category-item).
       const clicableElements = document.querySelectorAll(
        '.nav-links a, .btn-primary, .card-evento a.btn-secondary, .category-item, a[href^="#"]' // <-- ¡Añadido a[href^="#"]!
    );

        // 3. Añadir el Event Listener a cada elemento
        clicableElements.forEach(element => {
            element.addEventListener('click', (e) => {
                // Detener y rebobinar el sonido si ya se estaba reproduciendo (para clicks rápidos)
                clickSound.pause();
                clickSound.currentTime = 0;
                
                // 4. Reproducir el sonido.
                clickSound.play().catch(error => {
                    console.log("No se pudo reproducir el sonido de click:", error.message);
                });
            });
        });
    }


    // Función principal para cargar y renderizar datos
    async function loadDataAndRender() {
        try {
            const data = await fetchWithRetry(dataUrl);
            
            // 1. Renderizar la barra de navegación (usando los elementos básicos de tu HTML)
            renderNavbar(data.navbar);

            // 2. Renderizar la sección Hero (usando los elementos básicos de tu HTML)
            renderHero(data.hero);

            // 3. Renderizar Actividades Semanales 
            renderEventGrid('actividadesGrid', data.secciones.actividadesSemana.eventos, false);
            
            // 4. Renderizar Eventos Destacados
            renderEventGrid('eventosGrid', data.secciones.eventosDestacados.eventos, true);

            // 5. Renderizar Categorías
            renderCategories('categoriasGrid', data.secciones.categorias.lista);

            // *** 6. LLAMADA CLAVE: Asignar el sonido después de que todos los elementos dinámicos han sido creados ***
            setupClickSound('recursos/digital-click-357350.mp3');
            
        } catch (error) {
            // Este es el catch que genera tu mensaje de error
            console.error('Fallo Crítico al Iniciar la Aplicación:', error);
            const errorMsg = document.createElement('div');
            errorMsg.className = "p-8 text-center text-red-600 bg-red-100 rounded-xl m-8 border border-red-300";
            errorMsg.innerHTML = `
                <p class="font-bold text-xl">Error al cargar la aplicación.</p>
                <p class="mt-2">No pudimos cargar la información de eventos.</p>
                <p class="text-sm text-red-700 mt-1">Detalle del error: ${error.message}</p>
                <p class="mt-3 text-sm">Por favor, verifica que el archivo <strong>data.json</strong> exista en la misma carpeta y que su sintaxis sea correcta (sin comas o llaves faltantes).</p>
            `;
            document.body.prepend(errorMsg);
        }
    }

    // --- Funciones de Renderizado ---
    // NOTA: Estas funciones son básicas ya que tu index.html no tiene todos los IDs.
    // Solo actualizan las listas de enlaces en la navbar y el contenido del Hero si tienen IDs.

    function renderNavbar(navbarData) {
        const navLinks = document.querySelector('.nav-links');
        
        if (navLinks) {
            navLinks.innerHTML = navbarData.links.map(link => `
                <li><a href="${link.url}">${link.nombre}</a></li>
            `).join('');
        }
    }

    function renderHero(heroData) {
        // Tu HTML del Hero es estático y no tiene IDs para inyección, lo dejamos simple.
        const heroSection = document.querySelector('.hero h1');
        if (heroSection) heroSection.textContent = heroData.titulo;
        
        const heroSubtitle = document.querySelector('.hero p');
        if (heroSubtitle) heroSubtitle.textContent = heroData.subtitulo;
    }
    
    // Función de renderizado de cuadrícula de eventos
    function renderEventGrid(elementId, eventos, isFeatured) {
        const grid = document.getElementById(elementId);
        if (!grid) return;

        grid.innerHTML = eventos.map(evento => {
            // AHORA usamos la clase CSS correcta: .card-evento
            const cardClass = isFeatured 
                ? 'card-evento destacado' 
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


    function renderCategories(elementId, categorias) {
        const grid = document.getElementById(elementId);
        if (!grid) return;

        grid.innerHTML = categorias.map(cat => {
            // Enlace a la nueva página de esquema, pasando el nombre de la categoría como parámetro
            const linkUrl = `categoria.html?nombre=${encodeURIComponent(cat.nombre)}`;

            return `
                <a href="${linkUrl}" class="category-item ${cat.nombre}">
                    <div class="category-icon">${cat.icono}</div>
                    <h3 class="category-name">${cat.nombre}</h3>
                </a>
            `;
        }).join('');
    }


    // Inicializar la carga de datos
    loadDataAndRender();
}); // CIERRE: document.addEventListener('DOMContentLoaded')


// Lógica de Scroll Suave (puede estar fuera del DOMContentLoaded si no depende de la carga dinámica)
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




