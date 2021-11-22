const connection = require("./connection");
const DATABASE = "ejercicios_fit";
const COLLECTION_USERS = "users";
const dataEjercicios = require("../data/ejercicio");
const parseObjectId = require("../helpers/parseObjectId");
const { parse } = require("dotenv");

const rutinaMock = {
  nombre: "Mock2",
  dias: [0, 3, 5],
  ejercicios: [],
};

async function getRutina(userId, nombre) {
  const connectiondb = await connection.getConnection();
  const user = await connectiondb
    .db(DATABASE)
    .collection(COLLECTION_USERS)
    .aggregate([
      {
        $unwind: "$rutinas",
      },
      { $match: { _id: parseObjectId(userId), "rutinas.nombre": nombre } },
    ])
    .toArray();

  /* Si no existe la rutina, devuelvo un objeto vacío */
  if (!user[0]) return {};

  const result = user[0].rutinas;

  result.ejercicios = await dataEjercicios.getEjerciciosByIds(
    result.ejercicios
  );

  return result;
}

async function addRutina(userId, rutina) {
  rutina.ejercicios = await dataEjercicios.filterEjerciciosIds(
    rutina.ejercicios
  );

  const connectiondb = await connection.getConnection();
  const result = await connectiondb
    .db(DATABASE)
    .collection(COLLECTION_USERS)
    .updateOne(
      { _id: parseObjectId(userId) },
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
        _id: parseObjectId(userId),
        rutinas: { $elemMatch: { nombre: name } },
      },
      {
        $addToSet: {
          "rutinas.$.ejercicios": {
            $each: await dataEjercicios.filterEjerciciosIds(ids),
          },
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
        _id: parseObjectId(userId),
        rutinas: { $elemMatch: { nombre: name } },
      },
      {
        $pull: {
          "rutinas.$.ejercicios": { $in: ids.map((i) => parseObjectId(i)) },
        },
      }
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
        _id: parseObjectId(userId),
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
      { _id: parseObjectId(userId) },
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
