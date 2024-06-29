import path from "path";

export default {
    mode: 'development',
    entry: {
        map: './src/js/map.js',
        addImage: './src/js/addImage.js',
        viewMapa: './src/js/view-mapa.js',
        mapaInicio: './src/js/mapaInicio.js',
        cambiarEstado: './src/js/cambiarEstado.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}