const express = require('express');
var router = express.Router();
const data = require('../data/ejercicio');
const auth = require('../middleware/auth')

/* OTRA FORMA PROBANDO */
   router.get('/',  async (req, res) =>{
  try {
    if(req.query.dificultad && !req.query.tipo)
    {
      let dificultad = req.query.dificultad;
      let ejercicios = await data.getEjercicios(dificultad);

      ejercicios.length ? res.json(ejercicios) : res.status(404).json([]);
    }
    else if (req.query.tipo && !req.query.dificultad)
    {
      let tipo = req.query.tipo;
      let ejercicios = await data.getEjercicios();
      let ejerciciosFiltrados = ejercicios.filter(ejercicio => ejercicio.tipo == tipo);

      ejerciciosFiltrados.length ? res.json(ejerciciosFiltrados) : res.status(404).json([]);
      /* res.json(ejercicios); */
    }
    else if(req.query.dificultad && req.query.tipo)
    {
      let dificultad = req.query.dificultad;
      let tipo = req.query.tipo;
      let ejercicios = await data.getEjercicios(tipo, dificultad);

      ejercicios.length ? res.json(ejercicios) : res.status(404).json([]);
      /* res.json(ejercicios.filter(ejercicio => ejercicio.tip == tipo && ejercicio.dificultad == dificultad)); */
     }else{
      let ejercicios = await data.getEjercicios();
      ejercicios.length ? res.json(ejercicios) : res.status(404).json([]);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json([]);
  }
}); 
/* 
 router.get('/:id', auth, async (req, res) =>{
  const id = req.params.id;
  res.json(ejercicios.filter(data => data.id == parseInt(id))); 
  res.end();
});  */ 
/* otra forma, esta ok? */

router.get('/', auth, async (req, res) =>{
  try {
    let ejercicios = await data.getEjercicios(req.query.tipo, req.query.dificultad);
    ejercicios.length ? res.json(ejercicios) : res.status(404).json([]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json([]);
  }
});

router.get('/', async (req, res) =>{
  try {
    let ejercicios = await data.getEjercicios(req.query.dificultad);
    res.json(ejercicios);
  } catch (error) {
    console.log(error.message);
    res.status(500).json([]);
  }
});

/* Por tipo revisar  */
router.get('/', async (req, res) =>{
  try {
    let ejercicios = await data.getEjercicios(req.query.tipo);
    ejercicios.length ? res.json(ejercicios) : res.status(404).json([]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json([]);
  }
});

router.get('/:id', auth, async (req, res) =>{
  try {
    let ejercicios = await data.getEjercicio(req.params.id);
    ejercicios.length ? res.json(ejercicios) : res.status(404).json([]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json([]);
  } 
});

router.post('/', auth, async (req, res)=>{
  try {
    const result = await data.addEjercicio(req.body);
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({'error': error.message});
  }
  });

router.put('/:id', auth, async (req, res)=>{
  try {
    const result = await data.updateEjercicio(req.params.id, req.body);
    result.matchedCount ? res.send(result) : res.status(404).json({'error': "id not found"});
  } catch (error) { 
    console.log(error.message);
    res.status(500).json({'error': error.message});
  }
});

router.delete('/:id', auth, async (req, res)=>{
  try {
    const result = await data.deleteEjercicio(req.params.id);
    result.deletedCount ? res.send(result) : res.status(404).json({'error': "id not found"});
  } catch (error) { 
    console.log(error.message);
    res.status(500).json({'error': error.message});
  }
}); 

module.exports = router;
