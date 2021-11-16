var express = require('express');
var router = express.Router();
const data = require('../data/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const validator = require("email-validator");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource'); 
});

router.post('/login', async(req, res)=>{
  try {
    const user = await data.findByCredentials(req.body.email, req.body.password);
     if(user.activo){ 
      const token = await data.generatedAuthToken(user);
      res.send({user, token});
     }else{
      res.status(403).send('Su cuenta esta inactiva')
    }  
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.get('/:id', async(req,res,next)=>{
  res.json(await data.getUser(req.params.id));
});

router.post('/', async (req, res)=>{
/*   try{
    const userdata = req.body;
    if(!validator.validate(userdata.email) || !userdata.password){
      res.status(400).json({'error': 'datos no válidos'});
      return;
    }
    const result = await data.addUser(req.body);
    res.send(result);
  }catch(error){
    res.status(400).send(error.message);
  } */
});

router.post('/admin', auth,  async (req, res)=>{
  /* if(!validator.validate(userdata.email) */
  const result = await data.addAdmin(req.body);
  res.send(result);
});

router.delete('/:id', auth, async (req, res)=>{
  try {
    if(req.params.userrol =="usuario" && req.params.userid != req.params.id){
      res.status(404).json({'error': 'no encontrado'});
      return;
    }
      const result = await data.deleteUser(req.params.id);
      result.matchedCount ? res.send(result) : res.status(404).json({'error': "id not found"});
  } catch (error) { 
    console.log(error.message);
    res.status(500).json({'error': error.message});
  }
}); 

router.put('/favoritos/:id', auth, async(req, res)=>{
  let favoritos = await data.setFavorito(req.params.id, req.params.userid);
  console.log(req.params.userid);
  res.json(favoritos);
  res.end();
});

module.exports = router;
