const connection = require("./connection");
const ObjectId = require("mongodb").ObjectId;
const DATABASE = "ejercicios_fit";
const COLLECTION_EJERCICIOS = "ejercicios";

async function getAllEjercicios() {
  const clientmongo = await connection.getConnection();
  const ejercicios = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION_EJERCICIOS)
    .find()
    .toArray();
  return ejercicios;
}

async function getEjercicios(tipo, dificultad) {
  const clientmongo = await connection.getConnection();
  const query_st = {
    ...(tipo && { tipo: tipo }),
    ...(dificultad && { dificultad: dificultad }),
  };
  const ejercicios = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION_EJERCICIOS)
    .find(query_st)
    .toArray();
  return ejercicios;
}

async function getFavoritos(userid) {
  const connectiondb = await connection.getConnection();
  const user = await connectiondb
    .db(DATABASE)
    .collection(COLLECTION_USERS)
    .findOne({ _id: new ObjectId(userid) });

  return user.favoritos;
}

async function getEjercicio(id) {
  const clientmongo = await connection.getConnection();
  const o_id = new ObjectId(id);
  const ejercicio = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION_EJERCICIOS)
    .findOne({ _id: o_id });
  return ejercicio;
}

async function getEjerciciosByIds(ids) {
  const clientmongo = await connection.getConnection();
  const o_ids = ids.map((id) => new ObjectId(id));
  const ejercicio = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION_EJERCICIOS)
    .find({ _id: { $in: o_ids } })
    .toArray();
  return ejercicio;
}

async function addEjercicio(ejercicio) {
  const connectiondb = await connection.getConnection();
  const result = connectiondb
    .db(DATABASE)
    .collection(COLLECTION_EJERCICIOS)
    .insertOne(ejercicio);
  return result;
}

async function updateEjercicio(id, ejercicio) {
  const connectiondb = await connection.getConnection();
  const o_id = new ObjectId(id);
  const result = connectiondb
    .db(DATABASE)
    .collection(COLLECTION_EJERCICIOS)
    .updateOne({ _id: o_id }, { $set: ejercicio });
  return result;
}

async function deleteEjercicio(id) {
  const connectiondb = await connection.getConnection();
  const o_id = new ObjectId(id);
  const result = connectiondb
    .db(DATABASE)
    .collection(COLLECTION_EJERCICIOS)
    .deleteOne({ _id: o_id });
  return result;
}

module.exports = {
  getAllEjercicios,
  getEjerciciosByIds,
  getEjercicios,
  getEjercicio,
  addEjercicio,
  updateEjercicio,
  deleteEjercicio,
};
