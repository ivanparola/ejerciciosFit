const express = require('express');
var router = express.Router();
const data = require('../data/ejercicio');
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) =>{
  let ejercicios = await data.getEjercicios(req.query.tipo, req.query.dificultad);
  res.json(ejercicios);
});

router.get('/', auth, async (req, res) =>{
  let ejercicios = await data.getAllEjercicios();
  res.json(ejercicios);
});

router.get('/', auth, async (req, res) =>{
  let ejercicios = await data.getEjerciciosPorDificultad(req.query.dificultad);
  res.json(ejercicios);
});

router.get('/', auth, async (req, res) =>{
  let ejercicios = await data.getEjercicioPorTipo(req.query.tipo);
  res.json(ejercicios);
});

router.get('/:id', auth, async (req, res) =>{
    let ejercicios = await data.getEjercicio(req.params.id);
    res.json(ejercicios);
});

router.post('/', auth, async (req, res)=>{
    const result = await data.addEjercicio(req.body);
    res.send(result);
  });

router.put('/:id', auth, async (req, res)=>{
  const result = await data.updateEjercicio(req.params.id, req.body);
  res.send(result);
});

router.delete('/:id', auth, async (req, res)=>{
  const result = await data.deleteEjercicio(req.params.id);
  res.send(result);
}); 

module.exports = router;
