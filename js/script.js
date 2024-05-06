document.addEventListener('DOMContentLoaded', function() {

  const apiKey = '4ecdb8c869f3428792ca4168b70fdcb8';
  const loadedGames = new Set(); // Conjunto para almacenar juegos cargados
  var app;
  
    var menuContainer = document.getElementById('menu-container');
    var toggleMenu = document.getElementById('toggle-menu');
    var botonContainer = document.getElementById('Boton-Container');
  
    toggleMenu.addEventListener('click', function() {
        menuContainer.className = ('d-flex flex-column vh-100 degradado-bootstrap animate__animated animate__fadeInRightBig');
        
    });
    botonContainer.addEventListener('click', function() {
        menuContainer.className = (' animate__animated animate__fadeOutRightBig d-flex flex-column vh-100 degradado-bootstrap ');
    });
  
  function getDates() {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 14);
  
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
  
  //Api cheapshark
   async function updateCardWithCheapShark(card, game) {
    try {
        const cheapSharkApiUrl = `https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(game.name)}`;
        const response = await fetch(cheapSharkApiUrl);
        const cheapSharkData = await response.json();
  
        if (cheapSharkData && cheapSharkData.length > 0) {
            const cheapestPrice = cheapSharkData[0].cheapest;
            const cardPrice = card.querySelector('.card-price');
            cardPrice.textContent = `$${cheapestPrice}`;
        } else {
            const cardPrice = card.querySelector('.card-price');
            cardPrice.textContent = 'No hay ofertas';
        }
        const cardDescription = card.querySelector('.card-text');
        cardDescription.textContent = game.description;
    } catch (error) {
        console.error('Error al cargar los datos de CheapShark:', error);
    }
  }
  
   // Función para cambiar el juego actual
   function cambiarJuego(nuevoJuego) {
    // Lógica para cambiar el juego actual
  
    // Actualizar los botones con la nueva información del juego
    const verPaginaButton = document.getElementById('verPaginaButton');
    verPaginaButton.setAttribute('data-store', nuevoJuego.store);
    verPaginaButton.setAttribute('data-game-id', nuevoJuego.id);
    verPaginaButton.setAttribute('data-game-name', nuevoJuego.name); // Agrega el nombre del juego al atributo de datos
  }
  
  // Event listener para ambos botones
  document.getElementById('verPaginaButton').addEventListener('click', redirigirAPagina);
  
  
  
  async function loadAndRenderCategoryGames(categoryUrl, cardsSelector) {
    const cards = document.querySelectorAll(cardsSelector);
  
    try {
      const response = await fetch(categoryUrl);
      const data = await response.json();
      const games = data.results.filter(game => !loadedGames.has(game.id)); // Filtrar juegos no cargados
  
      for (let i = 0; i < cards.length && i < games.length; i++) {
        const card = cards[i];
        const game = games[i];
  
        loadedGames.add(game.id); // Agregar el juego al conjunto de juegos cargados
  
        const cardTitle = card.querySelector('.card-title');
        cardTitle.textContent = game.name;
  
        const cardDescription = card.querySelector('.card-text');
        cardDescription.textContent = game.description;
  
        const cardImage = card.querySelector('.card-img-top');
        cardImage.src = game.background_image;
  
        await updateCardWithCheapShark(card, game);
      }
    } catch (error) {
      console.error(`Error al cargar los datos de juegos de la categoría ${cardsSelector}:`, error);
    }
  }
  
  async function loadFeaturedGames() {
    const dates = getDates();
    const featuredUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=${dates.thirtyDaysAgoDate},${dates.currentDate}`;
  
    try {
      const response = await fetch(featuredUrl);
      const data = await response.json();
      const games = data.results.filter(game => !loadedGames.has(game.id));
  
      const cards = document.querySelectorAll('.card');
      for (let i = 0; i < cards.length && i < games.length; i++) {
        const card = cards[i];
        const game = games[i];
  
        loadedGames.add(game.id);
  
        const cardTitle = card.querySelector('.card-title');
        cardTitle.textContent = game.name;
  
        const cardImage = card.querySelector('.card-img-top');
        cardImage.src = game.background_image;
  
        const verPaginaButton = card.querySelector('.btn-info');
  
        // Verifica si el botón existe antes de intentar modificarlo
        if (verPaginaButton) {
       
          verPaginaButton.setAttribute('data-game-id', game.id);
          verPaginaButton.setAttribute('data-game-name', game.name);
  
          const cardDescription = card.querySelector('.card-text');
          cardDescription.textContent = game.description;
  
          // Agregar evento de clic al botón
          verPaginaButton.addEventListener('click', redirigirAPagina);
  
          await updateCardWithCheapShark(card, game);
        }
      }
    } catch (error) {
      console.error('Error al cargar los datos de juegos destacados:', error);
    }
  }
  
  async function loadAndRenderCategoryGames(categoryUrl, cardsSelector) {
    const cards = document.querySelectorAll(cardsSelector);

    try {
      const response = await fetch(categoryUrl);
      const data = await response.json();
      const games = data.results.filter(game => !loadedGames.has(game.id)); // Filtrar juegos no cargados

      // Oculta las tarjetas antes de actualizarlas
      for (let i = 0; i < cards.length && i < games.length; i++) {
        const card = cards[i];
        const game = games[i];

        loadedGames.add(game.id); // Agregar el juego al conjunto de juegos cargados

        const cardTitle = card.querySelector('.card-title');
        cardTitle.textContent = game.name;

        const cardDescription = card.querySelector('.card-text');
        cardDescription.textContent = game.description;

        const cardImage = card.querySelector('.card-img-top');
        cardImage.src = game.background_image;

        await updateCardWithCheapShark(card, game);
      }

      // Mostrar y animar las tarjetas después de haberlas actualizado
      cards.forEach((card, index) => {
        setTimeout(() => {
          // Remueve la propiedad de visibilidad para mostrar la tarjeta
          card.style.visibility = '';
          
          // Agrega las clases de animación a la tarjeta
          card.classList.add('animate__animated', 'animate__flip');
        }, index * 350); // Cada tarjeta se animará 350 milisegundos después de la anterior
      });

    } catch (error) {
      console.error(`Error al cargar los datos de juegos de la categoría ${cardsSelector}:`, error);
    }
  }

  
  // Función para manejar el clic en el botón y redirigir a la oferta
  function redirigirAPagina(event) {
    try {
      // Obtener la tienda o plataforma del juego desde el atributo data-store
      const store = this.getAttribute('data-store').toLowerCase();
  
      // Obtener el ID del juego desde el atributo data-game-id
      const gameId = this.getAttribute('data-game-id');
  
      // Redirigir a la URL de la tienda correspondiente, pero directamente a la oferta del juego
      if (store === 'steam') {
        window.location.href = `https://store.steampowered.com/app/${encodeURIComponent(gameId)}/?utm_source=your_website&utm_medium=button&utm_campaign=game_offer`;
      } else if (store === 'epic') {
        window.location.href = `https://www.epicgames.com/store/es-ES/p/${encodeURIComponent(gameId)}/?utm_source=your_website&utm_medium=button&utm_campaign=game_offer`;
      } else {
        console.error(`Tienda no compatible: ${store}`);
      }
    } catch (error) {
      console.error('Error al redirigir a la página del juego:', error);
    }
  }
  function buscar() {
    var contenedorResultado = document.getElementById("resultadoBusqueda");
    contenedorResultado.innerHTML = "Resultados de la búsqueda:";
  }
  // Agregar evento de clic al botón
  document.getElementById('verPaginaButton').addEventListener('click', redirigirAPagina);
  //ACCIÓN Y AVENTURA
  loadFeaturedGames().then(() => {
    const specialCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=action,adventure`;
    
    return loadAndRenderCategoryGames(specialCategoryUrl, '.special-card');
    //PUZZLE Y ESTRATEGIA
  }).then(() => {
    const puzzlestrategyCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=puzzle,strategy`;
    
    return loadAndRenderCategoryGames(puzzlestrategyCategoryUrl, '.puzzle-strategy-card');
    //INDEI Y CASUAL
  }).then(() => {
    const indieCasualCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=indie,casual`;
    
    return loadAndRenderCategoryGames(indieCasualCategoryUrl, '.indie-casual-card');
    //SOLO AVENTURA
  }).then(() => {
    const adventureCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=adventure`;
    
    return loadAndRenderCategoryGames(adventureCategoryUrl, '.adventure-card');
  })//SOLO ACCIÓN
  .then(() => {
    const actionCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=action`;
    
    return loadAndRenderCategoryGames(actionCategoryUrl, '.action-card');
  })//SOLO PUZZLE
  .then(() => {
    const puzzleCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=puzzle`;
    
    return loadAndRenderCategoryGames(puzzleCategoryUrl, '.puzzle-card');
  })//SOLO ESTRATEGIA
  .then(() => {
    const strategyCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=strategy`;
    
    return loadAndRenderCategoryGames(strategyCategoryUrl, '.strategy-card');
  })//SOLO INDIE
  .then(() => {
    const indieCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=indie`;
    
    return loadAndRenderCategoryGames(indieCategoryUrl, '.indie-card');
  })//SOLO CASUAL
  .then(() => {
    const casualCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=casual`;
    
    return loadAndRenderCategoryGames(casualCategoryUrl, '.casual-card');
  })//SOLO SIMULATION
  .then(() => {
    const simulationCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=simulation`;
    
    return loadAndRenderCategoryGames(simulationCategoryUrl, '.simulation-card');
  })//SOLO SHOOTER
  .then(() => {
    const shooterCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=shooter`;
    
    return loadAndRenderCategoryGames(shooterCategoryUrl, '.shooter-card');
  })//SOLO PLATFORMER
  .then(() => {
    const platformerCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=platformer`;
    
    return loadAndRenderCategoryGames(platformerCategoryUrl, '.platformer-card');
  })//SOLO GUERRA
  .then(() => {
    const cardCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=card`;
    
    return loadAndRenderCategoryGames(cardCategoryUrl, '.card-card');
  })//SOLO PARTY
  .then(() => {
    const sportsCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=sports`;
    
    return loadAndRenderCategoryGames(sportsCategoryUrl, '.sports-card');
  })//SOLO Horror
  .then(() => {
    const arcadeCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=arcade`;
    
    return loadAndRenderCategoryGames(arcadeCategoryUrl, '.arcade-card');
  })//SOLO MÚSICA
  .then(() => {
    const familyCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=family`;
    
    return loadAndRenderCategoryGames(familyCategoryUrl, '.family-card');
  })//SOLO PELEA
  .then(() => {
    const fightingCategoryUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=fighting`;
    
    return loadAndRenderCategoryGames(fightingCategoryUrl, '.fighting-card');
  })
  .catch(error => {
    console.error('Error en la secuencia de carga:', error);
  });
  
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

  const tarjetas = document.querySelectorAll('.card'); // Selecciona todas las tarjetas
    
    // Oculta las tarjetas inicialmente
    tarjetas.forEach((tarjeta) => {
      tarjeta.style.visibility = 'hidden';
    });
    
    tarjetas.forEach((tarjeta, index) => {
      setTimeout(() => {
        // Remueve la propiedad de visibilidad para mostrar la tarjeta
        tarjeta.style.visibility = '';
        
        // Agrega las clases de animación a la tarjeta
        tarjeta.classList.add('animate__animated', 'animate__flipInX');
      }, index * 350); // Cada tarjeta se animará 350 milisegundos después de la anterior
    });








    
  moveImages();
  const PORT = 3000;
  app.listen(PORT, () => {
    
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
  });
  
  //////////////////////////////BUSCADOR///////////////////////////////////////////
  document.getElementById('searchForm').addEventListener('submit', function(event) {
    // Evitar que el formulario se envíe automáticamente
    event.preventDefault();
  
    // Obtener el valor del campo de búsqueda
    var searchTerm = document.getElementById('searchInput').value;
  
    // Lógica para enviar la consulta a la API y obtener los resultados
    // Aquí deberías hacer una solicitud AJAX a tu API con el término de búsqueda
    fetch('https://api.rawg.io/api/games?search=' + searchTerm)
      .then(response => response.json())
      .then(data => {
        // Mostrar los resultados en el contenedor
        mostrarResultados(data);
      })
      .catch(error => console.error('Error:', error));
  });
  
  function mostrarResultados(resultados) {
    var resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
  
    if (resultados.length > 0) {
      resultados.forEach(resultado => {
        var resultadoElemento = document.createElement('div');
        resultadoElemento.textContent = resultado.nombre; // Ajustar según la estructura de tu respuesta
        resultsContainer.appendChild(resultadoElemento);
      });
  
      // Mostrar el contenedor de resultados
      resultsContainer.style.display = 'block';
    } else {
      // Si no hay resultados, ocultar el contenedor
      resultsContainer.style.display = 'none';
    }
  }
  function playAnimation(element, animationName) {
    // Eliminar clases de animación existentes
    element.classList.remove('animate__animated', 'animate__backInLeft', 'animate__tada');

    // Aplicar nueva animación
    element.classList.add('animate__animated', animationName);

    // Eliminar la clase de animación después de que termine
    setTimeout(() => {
        element.classList.remove('animate__animated', animationName);
    }, 1000); // Duración de la animación (1000 milisegundos = 1 segundo)
}


function playTadaAnimation(element) {
  // Eliminar clases de animación existentes
  element.classList.remove('animate__animated', 'animate__backInLeft', 'animate__tada');

  // Aplicar animación tada
  element.classList.add('animate__animated', 'animate__tada');

  // Eliminar la clase de animación después de que termine
  setTimeout(() => {
      element.classList.remove('animate__animated', 'animate__tada');
  }, 1000); // Duración de la animación (1000 milisegundos = 1 segundo)
}

// Obtener el elemento con la clase .Ttitulo
const title = document.querySelector('.Ttitulo');

// Función para cambiar la animación cada cierto período de tiempo
setInterval(() => {
  // Ejecuta la animación tada
  playTadaAnimation(title);
}, 5000);



  //////////////////////////////BUSCADOR///////////////////////////////////////////
  $(document).ready(function(){
    $('.js-tilt').tilt({
      maxTilt:        10,
      perspective:    1000,   // Transform perspective, the lower the more extreme the tilt gets.
      easing:         "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
      scale:          1,      // 2 = 200%, 1.5 = 150%, etc..
      speed:          300,    // Speed of the enter/exit transition.
      transition:     true,   // Set a transition on enter/exit.
      disableAxis:    null,   // What axis should be disabled. Can be X or Y.
      reset:          true,   // If the tilt effect has to be reset on exit.
      glare:          false,  // Enables glare effect
      maxGlare:       1       // From 0 - 1.
    });
  })
