(function () {
    const lat = 10.419;
    const lng = -75.5383;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 16);

    const filtros = { categoria: '', precio: '' }

    let markers = new L.FeatureGroup().addTo(mapa);
    let properties = [];

    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Filtrado de categorias y precios
    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value;
        filtrarProperties();
    });

    preciosSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value;
        filtrarProperties();
    });

    const getProperties = async () => {
        try {
            const url = '/api/properties';
            const response = await fetch(url);
            properties = await response.json();

            viewProperties(properties);

        } catch (error) {
            console.log(error);
        }
    }

    const viewProperties = properties => {

        // Limpiar markets previos
        markers.clearLayers();
        
        properties.forEach(propertie => {
            // Agregar los pines
            const marker = new L.marker([propertie?.lat, propertie?.lng], {
                autoPan: true,
            }).addTo(mapa).bindPopup(`
                <p class="text-blue-600 font-bold">${propertie.categoria.name}</p>
                <h1 class="text-xl font-extrabold uppercase my-3">${propertie?.title}</h1>
                <img src="/uploads/${propertie.imagen}" alt="Imagen de la propiedad ${propertie.title}" />
                <p class="text-gray-600 font-bold">${propertie.precio.name}</p>
                <a href="/properties/${propertie.id}" class="bg-blue-600 block p-2 text-center font-bold uppercase text-white">Ver Propiedad</a>
            `);

            markers.addLayer(marker);
        });
    }

    const filtrarProperties = () => {
        const result = properties.filter(filtrarByCategoria).filter(filtrarByPrecio);
        viewProperties(result);
    }

    const filtrarByCategoria = propertie => filtros.categoria ? propertie.categoryId === filtros.categoria : propertie;
    const filtrarByPrecio = propertie => filtros.precio ? propertie.priceId === filtros.precio : propertie;

    getProperties();
})();