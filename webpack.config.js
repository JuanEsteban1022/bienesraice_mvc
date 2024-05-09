import path from "path";

export default {
    mode: 'development',
    entry: {
        map: './src/js/map.js',
        addImage: './src/js/addImage.js',
        viewMapa: './src/js/view-mapa.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}