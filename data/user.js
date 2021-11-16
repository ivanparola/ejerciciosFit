const mongodb = require("mongodb");
const connection = require("./connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DATABASE = "ejercicios_fit";
const COLLECTION_USERS = "users";
const COLLECTION_EJERCICIOS = 'ejercicios';

const ObjectId = require("mongodb").ObjectId;

async function getAllUsers() {
  const clientmongo = await connection.getConnection();
  const user = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION_USERS)
    .find()
    .toArray();
  return user;
}

async function getUser(id) {
  const clientmongo = await connection.getConnection();
  const o_id = new ObjectId(id);
  const user = await clientmongo
    .db(DATABASE)
    .collection(COLLECTION_USERS)
    .findOne({ _id: o_id });
  return user;
}

async function addUser(user) {
  const connectiondb = await connection.getConnection();
  user.favoritos = [];
  user.rutina = []; 
  user.activo = true;
  if(!user.rol){
    user.rol = "usuario";
  }
  user.password = await bcrypt.hash(user.password, 8);
  const result = connectiondb
    .db(DATABASE)
    .collection(COLLECTION_USERS)
    .insertOne(user);
  return result;
}

async function addAdmin(user) {
  user.rol = "administrador";
  return addUser(user);
}

async function findByCredentials(email, password) {
  const connectiondb = await connection.getConnection();
  const user = await connectiondb
                      .db(DATABASE)
                      .collection(COLLECTION_USERS)
                      .findOne({ email: email });
  if (!user) {
    throw new Error("Credenciales no validas");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Credenciales no validas");
  }
  return user;
}

function generatedAuthToken(user) {
  const token = jwt.sign(
    { _id: user._id, email: user.email, rol: user.rol},
    process.env.CLAVE_SECRETA,
    { expiresIn: "1h" }
  );
  return token;
}

async function deleteUser(id){
    const connectiondb = await connection.getConnection();
    const o_id = new ObjectId(id);
    const result = connectiondb.db(DATABASE)
            .collection(COLLECTION_USERS)
            .updateOne({_id:o_id},
              { $set: { "activo": false } });
    return result;
}

async function setFavorito(exerciseid, userid) {
  const connectiondb = await connection.getConnection();
  const user = await connectiondb
                      .db(DATABASE)
                      .collection(COLLECTION_USERS)
                      .findOne({ _id: new ObjectId(userid) });

  let result;
 
    if (user.favoritos.find((exercise) => exercise == exerciseid)) {
      result = connectiondb
                .db(DATABASE)
                .collection(COLLECTION_USERS)
                .updateOne(
                  { _id: new ObjectId(userid) },
                  { $pull: { "favoritos": exerciseid } }
        );
    } else {
      result = connectiondb
                .db(DATABASE)
                .collection(COLLECTION_USERS)
                .updateOne(
                  { _id: new ObjectId(userid) },
                  { $addToSet: { "favoritos": exerciseid } }
                );
    }
  return result;
}

async function getFavoritos(userid) {
  const connectiondb = await connection.getConnection();
  const user = await connectiondb
                      .db(DATABASE)
                      .collection(COLLECTION_USERS)
                      .findOne({ _id: new ObjectId(userid)});

  return user.favoritos;  
} 

/* async function setPlan(exerciseid, numrutina, userid) {
  const connectiondb = await connection.getConnection();
  const user = await connectiondb
                      .db(DATABASE)
                      .collection(COLLECTION_USERS)
                      .findOne({ _id: new ObjectId(userid) });

  if(user.rutina.find((diarutina) => diarutina == numrutina ))

  let result;
 
    if (user.rutina.ejerciciosdia.find((exercise) => exercise == exerciseid)) {
      result = connectiondb
                .db(DATABASE)
                .collection(COLLECTION_USERS)
                .updateOne(
                  { _id: new ObjectId(userid) },
                  { $pull: { "ejerciciosdia": exerciseid } }
        );
    } else {
      result = connectiondb
                .db(DATABASE)
                .collection(COLLECTION_USERS)
                .updateOne(
                  { _id: new ObjectId(userid) },
                  { $addToSet: { "favoritos": exerciseid } }
                );
    }
  return result;
} */

module.exports = {
  addUser,
  findByCredentials,
  generatedAuthToken,
  setFavorito,
  getUser,
  getAllUsers,
  deleteUser,
  addAdmin,
  getFavoritos
};
