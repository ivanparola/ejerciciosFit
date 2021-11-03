const connection = require('./connection');
const ObjectId = require('mongodb').ObjectId; 

const DATABASE = 'ejercicios_fit';
const COLLECTION_EJERCICIOS = 'ejercicios';

async function getEjercicios(tipo, dificultad){
    const clientmongo = await connection.getConnection();
    const query_st = {...tipo && {"tipo": tipo},
                      ...dificultad && {"dificultad": dificultad} }
    const ejercicios = await clientmongo.db(DATABASE)
                        .collection(COLLECTION_EJERCICIOS)
                        .find(query_st)
                        .toArray();
    return ejercicios;                    
}

/* EJERCICIOS SOLO POR TIPO */
async function getEjercicios(tipo){
    const clientmongo = await connection.getConnection();
    const query_st = {...tipo && {"tipo": tipo}}
    const ejercicios = await clientmongo.db(DATABASE)
                        .collection(COLLECTION_EJERCICIOS)
                        .find(query_st)
                        .toArray();
    return ejercicios;                    
}

/* EJERCICIOS SOLO POR DIFICULTAD */
async function getEjercicios(dificultad){
    const clientmongo = await connection.getConnection();
    const query_st = {...dificultad && {"dificultad": dificultad} }
    const ejercicios = await clientmongo.db(DATABASE)
                        .collection(COLLECTION_EJERCICIOS)
                        .find(query_st)
                        .toArray();
    return ejercicios;                    
}

async function getEjercicio(id){
    const clientmongo = await connection.getConnection();
    const o_id = new ObjectId(id);
    const ejercicio = await clientmongo.db(DATABASE)
                        .collection(COLLECTION_EJERCICIOS)
                        .findOne({_id:o_id});
    return ejercicio;                    
}


async function addEjercicio(ejercicio){
    const connectiondb = await connection.getConnection();
    const result = connectiondb.db(DATABASE)
            .collection(COLLECTION_EJERCICIOS)
            .insertOne(ejercicio);
    return result;
}

async function updateEjercicio(id, ejercicio){
    const connectiondb = await connection.getConnection();
    const o_id = new ObjectId(id);
    const result = connectiondb.db(DATABASE)
            .collection(COLLECTION_EJERCICIOS)
            .updateOne({_id:o_id}, {$set: ejercicio});
    return result;
}

async function deleteEjercicio(id){
    const connectiondb = await connection.getConnection();
    const o_id = new ObjectId(id);
    const result = connectiondb.db(DATABASE)
            .collection(COLLECTION_EJERCICIOS)
            .deleteOne({_id:o_id});
    return result;
}

module.exports = {getEjercicios, getEjercicio, addEjercicio, updateEjercicio, deleteEjercicio};
