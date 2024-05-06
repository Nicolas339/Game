const apiKey = '4ecdb8c869f3428792ca4168b70fdcb8';
const api = 'https://api.isthereanydeal.com/v01/stats/popularity/chart/?key=';

const loadedGamesData = {};

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
  
  async function loadAndRenderCategoryGames(categoryUrl, cardsSelector) {
    const cards = document.querySelectorAll(cardsSelector);
  
    try {
      const response = await fetch(categoryUrl);
      const data = await response.json();
      const games = data.results.filter(game => !loadedGames.has(game.id));
  
      for (let i = 0; i < cards.length && i < games.length; i++) {
        const card = cards[i];
        const game = games[i];
  
        loadedGames.add(game.id);
  
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
  
        if (verPaginaButton) {
          verPaginaButton.setAttribute('data-game-id', game.id);
          verPaginaButton.setAttribute('data-game-name', game.name);
  
          const cardDescription = card.querySelector('.card-text');
          cardDescription.textContent = game.description;
  
          verPaginaButton.addEventListener('click', redirigirAPagina);
  
          await updateCardWithCheapShark(card, game);
        }
      }
    } catch (error) {
      console.error('Error al cargar los datos de juegos destacados:', error);
    }
  }
  
  function moveImages() {
      translateValue -= speed;
      imageContainer.style.transform = `translateX(${translateValue}px)`;
  
      const containerWidth = imageContainer.getBoundingClientRect().width;
      if (Math.abs(translateValue) >= containerWidth) {
          translateValue = 0;
      }
  
      requestAnimationFrame(moveImages);
  }
  
// Iniciar movimiento de imágenes
moveImages();

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Otras funciones relacionadas con el backend
