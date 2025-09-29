// Leer el JSON con fetch
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById("eventos");

    data.eventos.forEach(evento => {
      // Crear contenedor de cada evento
      const card = document.createElement("div");
      card.classList.add("evento-card");

      // Insertar la información
      card.innerHTML = `
        <h2>${evento.nombre}</h2>
        <p><strong>Fecha:</strong> ${evento.fecha || "Por definir"}</p>
        <p><strong>Descripción:</strong> ${evento.descripcion || "No disponible"}</p>
        <p><strong>Lugar:</strong> ${evento.lugar || "Por definir"}</p>
        <p><strong>Disponibilidad:</strong> ${evento.disponibilidad || "No especificada"}</p>
        <p><strong>Tipo:</strong> ${evento.recurrente ? "Recurrente" : "Puntual"}</p>
        <p><strong>Carreras:</strong> ${evento.carrera_especifica ? "Una carrera" : "Varias carreras"}</p>
      `;

      // Agregar al contenedor principal
      contenedor.appendChild(card);
    });
  })
  .catch(err => console.error("Error cargando JSON:", err));
