fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById("eventos");
    data.eventos.forEach(evento => {
      const card = document.createElement("div");
      card.classList.add("evento-card");

      card.innerHTML = `
        <div class="evento-img-container"></div>
        <h2>${evento.nombre}</h2>
        <p><strong>Fecha:</strong> ${evento.fecha || "Por definir"}</p>
        <p><strong>Descripción:</strong> ${evento.descripcion || "No disponible"}</p>
        <p><strong>Lugar:</strong> ${evento.lugar || "Por definir"}</p>
        <p><strong>Disponibilidad:</strong> ${evento.disponibilidad || "No especificada"}</p>
        <p><strong>Tipo:</strong> ${evento.recurrente ? "Recurrente" : "Puntual"}</p>
        <p><strong>Carreras:</strong> ${evento.carrera_especifica ? "Una carrera" : "Varias carreras"}</p>
      `;
      contenedor.appendChild(card);
    });

    // Footer
    const footer = document.getElementById("footer");
    const f = data.footer;

    footer.innerHTML = `
      <div class="footer-top">
        <div>${f.telefonos}</div>
        <div>${f.correo}</div>
        <div>${f.direccion}</div>
        <div>${f.ciudad}</div>
      </div>
      <div class="footer-links">
        ${f.enlaces.map(link => `<span>${link}</span>`).join(" | ")}
      </div>
      <div class="footer-bottom">
        <div class="footer-logo">UAO</div>
        <p>${f.legal}</p>
      </div>
    `;
  })
  .catch(err => console.error("Error cargando JSON:", err));
