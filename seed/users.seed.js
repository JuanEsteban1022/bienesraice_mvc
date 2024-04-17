import bcrypt from 'bcrypt';

const usuarios = [
    {
        nombre: 'prueba',
        email: 'prueba@gmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)
    },
    {
        nombre: 'Juan',
        email: 'juan@gmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)
    },
]

export default usuarios;