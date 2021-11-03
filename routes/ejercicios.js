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
      res.json(ejercicios);
    }
    else if (req.query.tipo && !req.query.dificultad)
    {
      let tipo = req.query.tipo;
      let ejercicios = await data.getEjercicios();
      res.json(ejercicios.filter(ejercicio => ejercicio.tipo == tipo));
      /* res.json(ejercicios); */
    }
    else if(req.query.dificultad && req.query.tipo)
    {
      let dificultad = req.query.dificultad;
      let tipo = req.query.tipo;
      let ejercicios = await data.getEjercicios(tipo, dificultad);
      res.json(ejercicios); 
      /* res.json(ejercicios.filter(ejercicio => ejercicio.tip == tipo && ejercicio.dificultad == dificultad)); */
     }else{
      let ejercicios = await data.getEjercicios();
      res.json(ejercicios);
    }
  } catch (error) {
    console.log(error.message);
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
  let ejercicios = await data.getEjercicios(req.query.tipo, req.query.dificultad);
  res.json(ejercicios);
});

router.get('/', async (req, res) =>{
  let ejercicios = await data.getEjercicios(req.query.dificultad);
  res.json(ejercicios);
});

/* Por tipo revisar  */
router.get('/', async (req, res) =>{
  let ejercicios = await data.getEjercicios(req.query.tipo);
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
