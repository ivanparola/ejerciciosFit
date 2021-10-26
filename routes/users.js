var express = require('express');
var router = express.Router();
const data = require('../data/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource'); 
  res.json([
    {
      _id: 1,
      nombre: 'Nicolas',
      apellido: 'Bellin'
    },
    {
      _id: 2,
      nombre: 'Andrea',
      apellido: 'Felizzola'
    },
    {
      _id: 3,
      nombre: 'Ignacio',
      apellido: 'Giss'
    },
    {
      _id: 4,
      nombre: 'Ivan',
      apellido: 'Parola'
    },
    {
      _id: 5,
      nombre: 'Jeronimo',
      apellido: 'Sanchez'
    }
  ])
});

router.get('/:id', function(req,res,next){
  const users = [
    {
      _id: 1,
      nombre: 'Nicolas',
      apellido: 'Bellin'
    },
    {
      _id: 2,
      nombre: 'Andrea',
      apellido: 'Felizzola'
    },
    {
      _id: 3,
      nombre: 'Ignacio',
      apellido: 'Giss'
    },
    {
      _id: 4,
      nombre: 'Ivan',
      apellido: 'Parola'
    },
    {
      _id: 5,
      nombre: 'Jeronimo',
      apellido: 'Sanchez'
    }
  ];

  res.json(users.filter(user => user._id == parseInt(req.params.id)));
});

router.post('/', async (req, res)=>{
  // TODO: Validar que sea correcto el objeto usuario
  const result = await data.addUser(req.body);
  res.send(result);
});

router.post('/login', async(req, res)=>{
  try {
    const user = await data.findByCredentials(req.body.email, req.body.password);
    const token = await data.generatedAuthToken(user);

    res.send({user, token});

  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;
