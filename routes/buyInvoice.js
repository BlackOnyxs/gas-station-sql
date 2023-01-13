const { Router } = require('express');
const { check } = require('express-validator');
const { buyInvoicesGet, buyInvoicePost, buyInvoicePut, buyInvoiceGetById, buyInvoiceDelete } = require('../controllers/buyInvoice');
const { jwtValidate, isAdmin, fieldsValidator } = require('../middlewares');
const { existObject, existProduct } = require('../middlewares/db-validators');

const router = Router();

router.get('/', [
    jwtValidate,
    isAdmin,
    fieldsValidator
], buyInvoicesGet );

router.get('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'El id es requerido').not().isEmpty(),
    fieldsValidator
], buyInvoiceGetById );

router.post('/', [
    jwtValidate,
    isAdmin,
    check('product', 'El producto es requerido').not().isEmpty(),
    check('provider', 'El provider es requerido').not().isEmpty(),
    check('quantity', 'El quantity es requerido').not().isEmpty(),
    check('quantity', 'quantity must be numeric').isNumeric(),
    check('price', 'El price es requerido').not().isEmpty(),
    check('price', 'price must be numeric').isNumeric(),
    check('total', 'total must be numeric').isNumeric(),
    check('total', 'total is required').notEmpty(),
    fieldsValidator
], buyInvoicePost );

router.put('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'El id es requerido').not().isEmpty(),
    check('product', 'El producto es requerido').not().isEmpty(),
    check('provider', 'El provider es requerido').not().isEmpty(),
    check('quantity', 'El quantity es requerido').not().isEmpty(),
    check('quantity', 'quantity must be numeric').isNumeric(),
    check('price', 'El price es requerido').not().isEmpty(),
    check('price', 'price must be numeric').isNumeric(),
    check('total', 'total must be numeric').isNumeric(),
    check('total', 'total is required').notEmpty(),
    fieldsValidator
], buyInvoicePut );

router.delete('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'El id es requerido').not().isEmpty(),
    fieldsValidator
], buyInvoiceDelete );

module.exports = router;