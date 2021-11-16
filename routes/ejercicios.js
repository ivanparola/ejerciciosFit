const express = require('express');
var router = express.Router();
const data = require('../data/ejercicio');
const dataUser = require('../data/user');
const auth = require('../middleware/auth');
const authadmin = require('../middleware/authadmin');
const adminvalidador = [auth, authadmin];

router.get('/', auth, async (req, res) =>{
  try {
    let ejercicios = await data.getEjercicios(req.query.tipo, req.query.dificultad);
    ejercicios.length ? res.json(ejercicios) : res.status(404).json([]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json([]);
  }
});

router.get('/', auth, async (req, res) =>{
  let ejercicios = await data.getAllEjercicios();
  res.json(ejercicios);
});

/* Si lo pongo abajo no funciona */
router.get("/favoritos", auth, async (req, res) => {
  try {
    let favoritos = await dataUser.getFavoritos(req.params.userid);
    let lista = Promise.all(
      favoritos.map(async (element) => {
        return await data.getEjercicio(element);
      })
    );
    res.json(await lista);
    res.end();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) =>{
  try {
    let ejercicios = await data.getEjercicio(req.params.id);
    ejercicios? res.json(ejercicios) : res.status(404).json({});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({});
  } 
});

router.post('/', adminvalidador, async (req, res)=>{
  try {
    const result = await data.addEjercicio(req.body);
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({'error': error.message});
  }
  });

router.put('/:id', adminvalidador, async (req, res)=>{
  try {
      const result = await data.updateEjercicio(req.params.id, req.body);
      result.matchedCount ? res.send(result) : res.status(404).json({'error': "id not found"});
  } catch (error) { 
    console.log(error.message);
    res.status(500).json({'error': error.message});
  }
});

router.delete('/:id', adminvalidador, async (req, res)=>{
  try {
    const result = await data.deleteEjercicio(req.params.id);
    result.deletedCount ? res.send(result) : res.status(404).json({'error': "id not found"});
  } catch (error) { 
    console.log(error.message);
    res.status(500).json({'error': error.message});
  }
}); 

module.exports = router;
