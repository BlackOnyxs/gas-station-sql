const { Router } = require('express');
const { check } = require('express-validator');

const { sellInvoicesGet, sellInvoicesOwner, sellInvoiceGetById, sellInvoicePost, sellInvoicePut, sellInvoiceDelete } = require('../controllers/sellInvoice');
const { jwtValidate, fieldsValidator, isAdmin, hasRole } = require('../middlewares');
const { existObject, existProduct } = require('../middlewares/db-validators');

const router = Router();

router.get('/', [
    jwtValidate,
    isAdmin,
    fieldsValidator
], sellInvoicesGet );

router.post('/mobile/owner', [
    jwtValidate,
    hasRole('ADMIN_ROLE','SALE_ROLE'),
    check('dispenser', 'Error Id').isMongoId(),
    check('dispenser').custom( dispenser => existObject( dispenser, 'User') ),
    check('schedule', 'Error Id').isMongoId(),
    check('schedule').custom( schedule => existObject( schedule, 'Schedule') ),
    fieldsValidator
], sellInvoicesOwner );

router.get('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'Error Id').isMongoId(),
    check('id').custom( id => existObject( id, 'SellInvoice') ),
    fieldsValidator
], sellInvoiceGetById );

router.post('/mobile', [
    jwtValidate,
    hasRole('ADMIN_ROLE','SALE_ROLE'),
    check('product', 'El producto es requerido').not().isEmpty(),
    check('dispenser', 'El dispenser es requerido').not().isEmpty(),
    check('quantity', 'El quantity es requerido').not().isEmpty(),
    check('quantity', 'quantity must be numeric').isNumeric(),
    check('price', 'El price es requerido').not().isEmpty(),
    check('price', 'price must be numeric').isNumeric(),
    check('total', 'total must be numeric').isNumeric(),
    check('total', 'total is required').notEmpty(),
    fieldsValidator
], sellInvoicePost );

router.put('/:id', [
    jwtValidate,
    isAdmin,
    hasRole('ADMIN_ROLE','SALE_ROLE'),
    check('id', 'El id es requerido').not().isEmpty(),
    check('product', 'El producto es requerido').not().isEmpty(),
    check('dispenser', 'El dispenser es requerido').not().isEmpty(),
    check('quantity', 'El quantity es requerido').not().isEmpty(),
    check('quantity', 'quantity must be numeric').isNumeric(),
    check('price', 'El price es requerido').not().isEmpty(),
    check('price', 'price must be numeric').isNumeric(),
    check('total', 'total must be numeric').isNumeric(),
    check('total', 'total is required').notEmpty(),
    fieldsValidator
], sellInvoicePut );

router.delete('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'El id es requerido').not().isEmpty(),
    fieldsValidator
], sellInvoiceDelete );

module.exports = router;