import  {Dropzone}  from 'dropzone';

const token = document.querySelector('meta[name="csrf-token"]').content;

Dropzone.options.imagen = {
    dictDefaultMessage: 'Carga tus imagenes aquí',
    acceptedFiles: '.png, .jpg, .jpeg',
    maxFilesize: 5,
    maxFiles: 2,
    parallelUploads: 2,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Eliminar archivo',
    dictMaxFilesExceeded: 'El limite es de 2 archivos',
    headers: { 'csrf-token': token },
    paramName: 'imagen',
    init: function () {
        const dropzone = this;
        const btnPublicar = document.querySelector('#publicar');

        /** Se encarga de añadir el evento click al botón y el cual se encarga de publicar la imagen */
        btnPublicar.addEventListener('click', function () {
            dropzone.processQueue();
        });

        /** on() es una función propia de dropzone, queuecomplete es el encargado de validar los archivos */
        dropzone.on('queuecomplete', function () {
            if (dropzone.getActiveFiles().length == 0) {
                window.location.href = '/my-properties';
            }
        });
    }
}