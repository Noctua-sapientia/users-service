var express = require('express');
const fakeservice = require('../services/fakeservice');
var router = express.Router();
var Seller = require('../models/seller');
var debug = require('debug')('contacts-2:server');

/**
 * @swagger
 * /sellers:
 *   get:
 *     summary: Obtener lista de vendedores
 *     description: Obtiene la lista de todos los vendedores.
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             example: '[{ "id": 1, "name": "amazon", "valoration": 4.9, "orders": 10, "reviews": 11 }]'
 *   post:
 *     summary: Añadir nuevo vendedor
 *     description: Añade un nuevo vendedor a la lista.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: '{ "id": 2, "name": "nuevo", "valoration": 4.5, "orders": 5, "reviews": 6 }'
 *     responses:
 *       '201':
 *         description: Vendedor añadido correctamente
 *   put:
 *     summary: Actualizar información del vendedor
 *     description: Actualiza la valoración, pedidos y reseñas de un vendedor existente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: '{ "id": 1, "valoration": 4.8, "orders": 15, "reviews": 20 }'
 *     responses:
 *       '200':
 *         description: Información del vendedor actualizada correctamente
 *       '404':
 *         description: Vendedor no encontrado
 * /sellers/{id}:
 *   get:
 *     summary: Obtener vendedor por ID
 *     description: Obtiene un vendedor específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vendedor
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             example: '{ "id": 1, "name": "amazon", "valoration": 4.9, "orders": 10, "reviews": 11 }'
 *       '404':
 *         description: Vendedor no encontrado
 *   delete:
 *     summary: Eliminar vendedor por ID
 *     description: Elimina un vendedor específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vendedor
 *     responses:
 *       '200':
 *         description: Vendedor eliminado correctamente
 *       '404':
 *         description: Vendedor no encontrado
 */
router.get('/', async function(req, res, next) {
  try{
    const result = await Seller.find();
    res.send(result.map((s) => s.cleanup()));  }catch(e){
    debug("DB Problem", e);
    res.sendStatus(500);
  }

});

router.post('/', async function(req, res, next) {
  const {name, valoration, orders, reviews} = req.body;
  const seller = new Seller({
    name,
    valoration,
    orders,
    reviews
  });

  try{
    await seller.save();
    res.sendStatus(201);
  }catch(e){
    if(e.errors) {
      debug("Validation problem when saving");
      res.status(400).send({error: e.message});
    }else{
      debug("DB Problem", e);
      res.sendStatus(500);
    }
 }
});

router.put('/', function(req, res, next) {
  var newSeller = req.body;
  var actualSeller = Seller.find(s => {
    return s.id === newSeller.id;
  })

  if(actualSeller){
    actualSeller.valoration = newSeller.valoration;
    actualSeller.orders = newSeller.orders;
    actualSeller.reviews = newSeller.reviews;
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

router.get('/:id', async function(req, res, next) {
  var id = req.params.id;
  var result = Seller.find(s => {
    return s.id === parseInt(id);
  });

  if(result){
    res.send(result);
  } else {
    res.sendStatus(404);
  }
});

router.delete('/:id', async function(req, res, next) {
  var id = req.params.id;
  
  try {
    // Eliminar el vendedo por sellerId
    const result = await Seller.deleteOne({ "id": id });

    // Si no se eliminó ningún documento, significa que no se encontró el vendedor
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: 'Seller not found' });
    }

    // Enviar una respuesta de éxito
    res.status(200).send({ message: `Seller id=${id} deleted successfully` });
  } catch (error) {
    // Manejar errores inesperados
    return res.status(500).send({ error: 'An error occurred while deleting the seller' });
  }
});

module.exports = router;
