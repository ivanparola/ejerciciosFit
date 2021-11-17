const express = require("express");
let router = express.Router();
const data = require("../data/rutina");
const auth = require("../middleware/auth");

router.get("/:name", auth, async function (req, res) {
  try {
    const result = await data.getRutina(req.params.userid, req.params.name);
    res.json(result);
  } catch {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", auth, async function (req, res) {
  try {
    let rutina = req.body;

    if (!rutina.dias) rutina.dias = [];
    if (!rutina.ejercicios) rutina.ejercicios = [];

    const result = await data.addRutina(req.params.userid, rutina);
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.put("/ejercicios/:name", auth, async function (req, res) {
  try {
    const result = await data.addEjercicios(
      req.params.userid,
      req.params.name,
      req.body.ids
    );
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/ejercicios/:name", auth, async function (req, res) {
  try {
    const result = await data.removeEjercicios(
      req.params.userid,
      req.params.name,
      req.body.ids
    );
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:name", auth, async function (req, res) {
  try {
    const result = await data.deleteRutina(req.params.userid, req.params.name);
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
