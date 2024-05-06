function getDates() {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
  
    return {
      currentDate: today.toISOString().split('T')[0],
      thirtyDaysAgoDate: thirtyDaysAgo.toISOString().split('T')[0],
    };
  }
  
  function crearRuta(event) {
    // Obtén el elemento del botón que disparó el evento
    const boton = event.target;
  
    // Obtén los valores de los atributos data
    const store = boton.getAttribute('data-store');
    const gameId = boton.getAttribute('data-game-id');
    const gameName = boton.getAttribute('data-game-name');
  
    // Reemplaza los caracteres especiales y espacios en blanco en el nombre del juego
    const nombreJuegoCodificado = encodeURIComponent(gameName.replace(/\s+/g, '_'));
  
    // Construye la ruta con el nombre del juego codificado y el ID del juego
    const ruta = `/juegos/${nombreJuegoCodificado}/${encodeURIComponent(gameId)}`;
  
    // Redirige a la nueva ruta
    window.location.href = ruta;
  }
  
  // Agrega un listener de eventos a todos los botones con la clase verPaginaButton
  const botonesVerPagina = document.querySelectorAll('.verPaginaButton');
  botonesVerPagina.forEach(boton => {
    boton.addEventListener('click', crearRuta);
  });
  
  // Event listener para ambos botones
  function obtenerUrlJuego(callback) {
    // Realizar una solicitud HTTP GET a una API que proporciona la URL actualizada del juego
    fetch('https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(game.name)}')
        .then(response => response.json())
        .then(data => {
            // Extraer la URL del juego de la respuesta JSON
            var urlJuego = data.url;

            // Llamar al callback con la URL actualizada del juego
            callback(urlJuego);
        })
        .catch(error => {
            console.error('Error al obtener la URL del juego:', error);
        });
}
  
  function buscar() {
    var contenedorResultado = document.getElementById("resultadoBusqueda");
    contenedorResultado.innerHTML = "Resultados de la búsqueda:";
  }
  
  const imageContainer = document.getElementById('image-container');
  let translateValue = 0;
  const speed = 1; // Puedes ajustar la velocidad
  
  function moveImages() {
      translateValue -= speed;
      imageContainer.style.transform = `translateX(${translateValue}px)`;
  
      // Si quieres que las imágenes vuelvan al inicio después de cierta distancia
      const containerWidth = imageContainer.getBoundingClientRect().width;
      if (Math.abs(translateValue) >= containerWidth) {
          translateValue = 0;
      }
  
      requestAnimationFrame(moveImages);
  }
  
  moveImages();
  const PORT = 3000;
  app.listen(PORT, () => {
    
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });