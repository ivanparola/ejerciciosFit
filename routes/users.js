var express = require("express");
var router = express.Router();
const data = require("../data/user");
const dataEj = require("../data/ejercicio");
const auth = require("../middleware/auth");
const authadmin = require("../middleware/authadmin");
const validator = require("email-validator");
const adminvalidador = [auth, authadmin];

router.get("/", adminvalidador, async function (req, res, next) {
  try {
    /* res.send('Esto es EjerciciosFit');   */
    res.json(await data.getAllUsers());
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const result = await data.updateUser(req.params.id, req.body);
    result.matchedCount
      ? res.send(result)
      : res.status(404).json({ error: "id not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", adminvalidador, async function (req, res, next) {
  try {
    /* res.send('Esto es EjerciciosFit');   */
    res.json(await data.getAllUsers());
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await data.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (user.activo) {
      const token = await data.generatedAuthToken(user);
      res.send({ user, token });
    } else {
      res.status(403).send("Su cuenta esta inactiva");
    }
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.get("/:id", async (req, res, next) => {
  res.json(await data.getUser(req.params.id));
});

router.post("/", auth, async (req, res) => {
  try {
    const o_User = req.body;
    if (!validator.validate(o_User.email) || !o_User.password) {
      res.status(400).json({ error: "datos no válidos" });
      return;
    }
    const result = await data.addUser(req.body);
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/admin", auth, async (req, res) => {
  const o_User = req.body;
  if (!validator.validate(o_User.email) || !o_User.password) {
    res.status(400).json({ error: "datos no válidos" });
    return;
  }
  const result = await data.addAdmin(req.body);
  res.send(result);
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.params.userrol == "usuario" && req.params.userid != req.params.id) {
      res.status(404).json({ error: "no encontrado" });
      return;
    }
    const result = await data.deleteUser(req.params.id);
    result.matchedCount
      ? res.send(result)
      : res.status(404).json({ error: "id not found" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.put("/favoritos/:id", auth, async (req, res) => {
  try {
    id_param = req.params.id;
    let fav = await dataEj.getEjercicio(id_param);
    if (!fav) {
      res.status(404).json({ error: "Ejercicio no encontrado" });
      return;
    }
    let favoritos = await data.setFavorito(req.params.id, req.params.userid);
    res.json(favoritos);
    res.end();
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ error: error.message });
  }
});

/* router.put('/rutina', auth, async(req, res)=>{
  try{
    id_param = req.params.id;
    let fav = await dataEj.getEjercicio(id_param);
    if(!fav){
        res.status(404).json({'error': 'Ejercicio no encontrado'});
        return;
    }
    let favoritos = await data.setFavorito(req.params.id, req.params.userid);
    res.json(favoritos);
    res.end();
  }catch(error){
    console.log(error.message);
    res.status(404).json({'error': error.message});
  }
}); */

module.exports = router;
