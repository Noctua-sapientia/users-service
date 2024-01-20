var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var Customer = require('../models/customer');
var Seller = require('../models/seller');
const cors = require('cors');

// Genera una clave secreta de 256 bits
const SECRET_KEY = 'a56d1f7c0c817387a072692731ea60df7c3a6c19d82ddac228a9a4461f8c5a72';


router.use(bodyParser.json());
router.use(cors());
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
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user;
    let userId;
    let userType;

    const customer = await Customer.findOne({ email: email });
    const seller = await Seller.findOne({ email: email });

    if (customer) {
      user = customer;
      userType = "Customer";
      userId = customer.id;
    } else if (seller) {
      user = seller;
      userType = "Seller";
      userId = seller.id;
    } else {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (email === user.email && password === user.password) {
      const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token, userId, userType });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error en la autenticación:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;