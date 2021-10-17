const connection = require('./connection');

async function getEjercicios(){
    const clientmongo = await connection.getConnection();
    const ejercicios = await clientmongo.db('ejercicios_fit')
                        .collection('ejercicios')
                        .find()
                        .toArray();
    return ejercicios;                    
}

module.exports = {getEjercicios};