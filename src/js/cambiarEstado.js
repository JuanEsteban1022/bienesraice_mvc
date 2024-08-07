(function () {
    const cambiarEstadosBotones = document.querySelectorAll('.cambiar-estado');
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    cambiarEstadosBotones.forEach(btn => {
        btn.addEventListener('click', cambiarEstadoPropiedad);
    });

    async function cambiarEstadoPropiedad(e) {
        const { propiedadId: id } = e.target.dataset;
        const url = `/properties/${id}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'CSRF-TOKEN': token
                }
            });

            const { resultado } = await response.json();

            if (resultado) {
                if (e.target.classList.contains('bg-yellow-100')) {
                    e.target.classList.add('bg-green-100', 'text-green-800');
                    e.target.classList.remove('bg-yellow-100', 'text-yellow-800');
                    e.target.textContent = 'Publicado';
                } else {
                    e.target.classList.add('bg-yellow-100', 'text-yellow-800');
                    e.target.classList.remove('bg-green-100', 'text-green-800');
                    e.target.textContent = 'No publicado';
                }

            }
        } catch (error) {
            console.log(error);
        }
    }
})();