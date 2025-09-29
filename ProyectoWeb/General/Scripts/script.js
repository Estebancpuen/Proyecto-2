fetch("data.json")
  .then(response => response.json())
  .then(data => {
    const contenedor = document.getElementById("eventos");
    contenedor.innerHTML = "";

    data.eventos.forEach(evento => {
      const card = document.createElement("div");
      card.className = "evento-card";

      card.innerHTML = `
        <div class="evento-top">
          <div class="evento-badge"></div>
        </div>

        <div class="evento-info">
          <p class="evento-titulo">${evento.nombre}</p>

          <!-- DETALLES: envueltos en este div para ocultar/mostrar -->
          <div class="evento-detalles">
            <p><strong>Fecha:</strong> ${evento.fecha || "Por definir"}</p>
            <p><strong>Descripción:</strong> ${evento.descripcion || "No disponible"}</p>
            <p><strong>Lugar:</strong> ${evento.lugar || "Por definir"}</p>
            <p><strong>Disponibilidad:</strong> ${evento.disponibilidad || "No especificada"}</p>
            <p><strong>Tipo:</strong> ${evento.recurrente ? "Recurrente" : "Puntual"}</p>
            <p><strong>Carreras:</strong> ${evento.carrera_especifica ? "Específica" : "Varias carreras"}</p>
          </div>
        </div>
      `;

      contenedor.appendChild(card);
    });

    // Soporte tap en móviles: alterna clase .expanded al tocar la tarjeta
    contenedor.addEventListener('click', (e) => {
      const card = e.target.closest('.evento-card');
      if (!card) return;
      // Si el click fue sobre enlaces u otros controles, evita toggle
      const isControl = e.target.tagName === 'A' || e.target.closest('a, button');
      if (isControl) return;
      // toggle expanded (solo para móviles / taps)
      card.classList.toggle('expanded');
    });

    // Footer (tu código sigue igual)
    const footer = document.getElementById("footer");
    const f = data.footer || {};
    footer.innerHTML = `
      <div class="footer-top">
        <div>${f.telefonos || ""}</div>
        <div>${f.correo || ""}</div>
        <div>${f.direccion || ""}</div>
        <div>${f.ciudad || ""}</div>
      </div>
      <div class="footer-links">
        ${ (f.enlaces || []).map(link => `<span>${link}</span>`).join(" | ") }
      </div>
      <div class="footer-bottom">
        <div class="footer-logo">UAO</div>
        <p>${f.legal || ""}</p>
      </div>
    `;
  })
  .catch(err => console.error("Error cargando JSON:", err));
