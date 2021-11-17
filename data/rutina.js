const ObjectId = require("mongodb").ObjectId;
const connection = require("./connection");
const DATABASE = "ejercicios_fit";
const COLLECTION_USERS = "users";

const rutinaMock = {
  nombre: "Mock2",
  dias: [0, 3, 5],
  ejercicios: [],
};

async function getRutina(userId, nombre) {
  const connectiondb = await connection.getConnection();
  const rutinas = await connectiondb
    .db(DATABASE)
    .collection(COLLECTION_USERS)
    .find(
      {
        _id: new ObjectId(userId),
        "rutinas.nombre": nombre,
      },
      { _id: 0, "rutinas.$": 1 }
    )
    .toArray();

  console.log(rutinas);

  if (!rutinas) return {};

  return;

  //const rutina = rutinas.find((r) => r._id == new ObjectId(id));

  console.log(rutina);

  return result;
}

async function addRutina(userId, rutina) {
  const connectiondb = await connection.getConnection();
  const result = await connectiondb
    .db(DATABASE)
    .collection(COLLECTION_USERS)
    .updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { rutinas: rutina } }
    );
  return result;
}

async function addEjercicios(userId, name, ids) {
  const connectiondb = await connection.getConnection();
  const result = await connectiondb
    .db(DATABASE)
    .collection(COLLECTION_USERS)
    .updateOne(
      {
        _id: new ObjectId(userId),
        rutinas: { $elemMatch: { nombre: name } },
      },
      {
        $addToSet: {
          "rutinas.$.ejercicios": { $each: ids },
        },
      }
    );
  return result;
}

async function removeEjercicios(userId, name, ids) {
  const connectiondb = await connection.getConnection();
  const result = await connectiondb
    .db(DATABASE)
    .collection(COLLECTION_USERS)
    .updateOne(
      {
        _id: new ObjectId(userId),
        rutinas: { $elemMatch: { nombre: name } },
      },
      { $pull: { "rutinas.$.ejercicios": { $in: ids } } }
    );
  return result;
}

async function updateRutina(userId, rutina) {
  const connectiondb = await connection.getConnection();
  const result = await connectiondb
    .db(DATABASE)
    .collection(COLLECTION_USERS)
    .updateOne(
      {
        _id: new ObjectId(userId),
        rutinas: { $elemMatch: { nombre: rutina.nombre } },
      },
      {
        $set: {
          dias: rutina.dias,
          nombre: rutina.nombre,
        },
      }
    );
  return result;
}

async function deleteRutina(userId, name) {
  const connectiondb = await connection.getConnection();
  const result = connectiondb
    .db(DATABASE)
    .collection(COLLECTION_USERS)
    .updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { rutinas: { nombre: name } } }
    );
  return result;
}

module.exports = {
  getRutina,
  addRutina,
  deleteRutina,
  updateRutina,
  addEjercicios,
  removeEjercicios,
};
