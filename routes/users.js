var express = require('express');
var router = express.Router();
const data = require('../data/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource'); 
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

router.get('/:id', async(req,res,next)=>{
  res.json(await data.getUser(req.params.id));
});

router.post('/', async (req, res)=>{
  // TODO: Validar que sea correcto el objeto usuario
  const result = await data.addUser(req.body);
  res.send(result);
});

router.put('/favoritos/:id', async(req, res)=>{
  let favoritos = await data.setFavorito(req.params.id, "6186e060147fab3176ceb300");
  res.json(favoritos);
  res.end();
})

module.exports = router;
