document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.navList');

    menuToggle.addEventListener('change', function() {
        if (this.checked) {
            menuContent.style.display = 'block';
        } else {
            menuContent.style.display = 'none';
        }
    });

    // Otras funciones de manipulación del DOM
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
    
    
});
