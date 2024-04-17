(function () {
    const lat = document.querySelector('#lat').value || 4.0695674;
    const lng = document.querySelector('#lng').value || -76.1996879;
    const mapa = L.map('mapa').setView([lat, lng], 16);
    let marker;

    /** Utilización de provider y Geocoder */
    const geoCodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Pin del mapa
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa);

    // Detectar movimiento del pin
    marker.on('moveend', function (e) {
        marker = e.target;
        const position = marker.getLatLng();
        mapa.panTo(new L.LatLng(position.lat, position.lng));

        // Obtener información de la calle
        geoCodeService.reverse().latlng(position, 13).run(function (err, result) {
            marker.bindPopup(result.address.LongLabel);

            document.querySelector('.calle').textContent = result?.address?.Address ?? '';
            document.querySelector('#calle').value = result?.address?.Address ?? '';
            document.querySelector('#lat').value = result?.latlng?.lat ?? '';
            document.querySelector('#lng').value = result?.latlng?.lng ?? '';
        });
    });

})();