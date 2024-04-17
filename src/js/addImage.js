import {Dropzone} from 'dropzone';

Dropzone.options.imagen = {
    dictDefaultMessage: 'Carga tus imagenes aquí',
    acceptedFiles: '.png, .jpg, .jpeg',
    maxFilesize: 5,
    maxFiles: 2,
    parallelUploads: 2,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Eliminar archivo',
    dictMaxFilesExceeded: 'El limite es de 2 archivos'
}