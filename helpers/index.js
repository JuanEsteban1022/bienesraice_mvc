const isVendedor = (userId, propertieUserId) => {
    return userId === propertieUserId
}

const formatearFecha = fecha => {
    const newDate = new Date(fecha).toISOString().slice(0, 10);
    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return new Date(newDate).toLocaleDateString('es-ES', opciones);
}

export {
    formatearFecha,
     isVendedor,
};