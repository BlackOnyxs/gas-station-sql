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
    check('product', 'Error Id').isMongoId(),
    check('product').custom( product => existProduct( product ) ),
    check('dispenser', 'Error Id').isMongoId(),
    check('dispenser').custom( dispenser => existObject( dispenser, 'User') ),
    check('client').custom( client => existObject( client, 'Client') ),
    check('quantity', 'quantity must be numeric').isNumeric(),
    check('total', 'total must be numeric').isNumeric(),
    check('total', 'total is required').notEmpty(),
    fieldsValidator
], sellInvoicePost );

router.put('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'Error Id').isMongoId(),
    check('id').custom( id => existObject( id, 'SellInvoice') ),
    check('product', 'Error Id').isMongoId(),
    check('product').custom( product => existProduct( product ) ),
    check('dispenser', 'Error Id').isMongoId(),
    check('dispenser').custom( dispenser => existObject( dispenser, 'User') ),
    // check('client', 'Error Id').isMongoId(),
    check('client').custom( client => existObject( client, 'Client') ),
    check('quantity', 'quantity must be numeric').isNumeric(),
    check('total', 'total must be numeric').isNumeric(),
    check('total', 'total is required').notEmpty(),
    fieldsValidator
], sellInvoicePut );

router.get('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'Error Id').isMongoId(),
    check('id').custom( id => existObject( id, 'SellInvoice') ),
    fieldsValidator
], sellInvoiceDelete );

module.exports = router;