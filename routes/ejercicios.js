const express = require('express');
const router = express.Router();
const data = require('../data/ejercicio');
const auth = require('../middleware/auth')

/* otra forma, esta ok? */
/* router.get('api/ejercicios/', auth, async (req, res) =>{
  try {
    if(req.query.dificultad && !req.query.tipo){
      let dificultad = req.query.dificultad;
      res.json(ejercicios.filter(ejercicio => ejercicio.dificultad == dificultad));
    }else if (!req.query.dificultad && req.query.tipo){
      let tipo = req.query.tipo;
      res.json(ejercicios.filter(ejercicio => ejercicio.tip == tipo));
    }else if(req.query.dificultad && req.query.tipo){
      let dificultad = req.query.dificultad;
      let tipo = req.query.tipo;
      res.json(ejercicios.filter(ejercicio => ejercicio.tip == tipo && ejercicio.dificultad == dificultad));
    }else{
      let ejercicios = await data.getEjercicios();
      res.json(ejercicios);
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.get('api/ejercicios/:id', auth, async (req, res) =>{
  const id = req.params.id;
  res.json(ejercicios.filter(data => data.id == parseInt(id))); 
  res.end();
}); */
/* otra forma, esta ok? */

router.get('/', auth, async (req, res) =>{
  let ejercicios = await data.getEjercicios(req.query.tipo, req.query.dificultad);
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
