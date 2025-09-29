fetch("data.json")
  .then(response => response.json())
  .then(data => {
    const contenedor = document.getElementById("eventos");
    contenedor.innerHTML = "";

    data.eventos.forEach(evento => {
      const card = document.createElement("div");
      card.classList.add("evento-card");

      
      card.innerHTML = `
        <div class="evento-top">
          <div class="evento-badge"></div>
        </div>

        <div class="evento-info">
          <h3 class="evento-titulo">${evento.nombre}</h3>
          <p><strong>Fecha:</strong> ${evento.fecha || "Por definir"}</p>
          <p><strong>Descripción:</strong> ${evento.descripcion || "No disponible"}</p>
          <p><strong>Lugar:</strong> ${evento.lugar || "Por definir"}</p>
          <p><strong>Disponibilidad:</strong> ${evento.disponibilidad || "No especificada"}</p>
          <p><strong>Tipo:</strong> ${evento.recurrente ? "Recurrente" : "Puntual"}</p>
          <p><strong>Carreras:</strong> ${evento.carrera_especifica ? "Específica" : "Varias carreras"}</p>
        </div>
      `;

      contenedor.appendChild(card);
    });

    
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
