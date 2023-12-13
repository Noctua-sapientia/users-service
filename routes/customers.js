var express = require('express');
const fakeservice = require('../services/fakeservice');
var router = express.Router();
var Customer = require('../models/customer');
var debug = require('debug')('contacts-2:server');

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Obtener lista de clientes
 *     description: Obtiene la lista de todos los clientes.
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             example: [{ "id": 1, "name": "Pablo", "surnames": "Santos Alises", "address": "C/América, 4" }]
 */
router.get('/', async function(req, res, next) {
  try{
    const result = await Customer.find();
    res.send(result.map((c) => c.cleanup()));
  }catch(e){
    debug("DB Problem", e);
    res.sendStatus(500);
  }
});

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Añadir nuevo cliente
 *     description: Añade un nuevo cliente a la lista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { "id": 2, "name": "Nuevo", "surnames": "Cliente", "address": "C/Nueva, 123" }
 *     responses:
 *       '201':
 *         description: Cliente añadido correctamente
 */
router.post('/', async function(req, res, next) {
  const {name, surnames, address} = req.body;
  const customer = new Customer({
    name,
    surnames,
    address
  });

  try{
    await customer.save();
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

/**
 * @swagger
 * /customers:
 *   put:
 *     summary: Actualizar dirección del cliente
 *     description: Actualiza la dirección de un cliente existente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { "id": 1, "address": "Nueva dirección" }
 */
router.put('/', function(req, res, next) {
  var newCustomer = req.body;
  var actualCustomer = Customer.find(s => {
    return s.id === newCustomer.id;
  })

  if(actualCustomer){
    actualCustomer.address = newCustomer.address;
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Obtener cliente por ID
 *     description: Obtiene un cliente específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             example: { "id": 1, "name": "Pablo", "surnames": "Santos Alises", "address": "C/América, 4" }
 *       '404':
 *         description: Cliente no encontrado
 */
router.get('/:id', async function(req, res, next) {
  var id = req.params.id;
  var result = customers.find(s => {
    return s.id === parseInt(id);
  });

  if(result){
    res.send(result);
  } else {
    res.sendStatus(404);
  }
});

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Eliminar cliente por ID
 *     description: Elimina un cliente específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       '200':
 *         description: Cliente eliminado correctamente
 *       '404':
 *         description: Cliente no encontrado
 */
router.delete('/:id', async function(req, res, next) {
  var id = req.params.id;
  
  var id = req.params.id;
  
  try {
    // Eliminar el vendedo por customerId
    const result = await Customer.deleteOne({ "id": id });

    // Si no se eliminó ningún documento, significa que no se encontró el comprador
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: 'Customer not found' });
    }

    // Enviar una respuesta de éxito
    res.status(200).send({ message: `Customer id=${id} deleted successfully` });
  } catch (error) {
    // Manejar errores inesperados
    return res.status(500).send({ error: 'An error occurred while deleting the seller' });
  }
});

module.exports = router;
