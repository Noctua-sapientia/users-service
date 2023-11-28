var express = require('express');
const fakeservice = require('../services/fakeservice');
var router = express.Router();

var customers = [
  { "id" : 1, "name" : "Pablo", "surnames" : "Santos Alises", "address" : "C/América, 4"}
]

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
router.get('/', function(req, res, next) {
  res.send(customers);
});s

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
router.post('/', function(req, res, next) {
  var customer = req.body;
  customers.push(customer);
  res.sendStatus(201);
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
  var actualCustomer = customers.find(s => {
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
router.delete('/:id', function(req, res, next) {
  var id = req.params.id;
  
  var indexToRemove = customers.findIndex(function (customer) {
    return customer.id === parseInt(id);
  });

  if (indexToRemove !== -1) {
    customers.splice(indexToRemove, 1);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
