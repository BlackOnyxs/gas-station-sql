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
    check('id', 'Error Id').isMongoId(),
    check('id').custom( id => existObject( id, 'BuyInvoice') ),
    fieldsValidator
], buyInvoiceGetById );

router.post('/', [
    jwtValidate,
    isAdmin,
    check('product', 'Error Id').isMongoId(),
    check('product').custom( product => existProduct( product ) ),
    check('manager', 'Error Id').isMongoId(),
    check('manager').custom( manager => existObject( manager, 'User') ),
    check('provider', 'Error Id').isMongoId(),
    check('provider').custom( provider => existObject( provider, 'Provider') ),
    check('quantity', 'quantity must be numeric').isNumeric(),
    check('total', 'total must be numeric').isNumeric(),
    check('total', 'total is required').notEmpty(),
    fieldsValidator
], buyInvoicePost );

router.put('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'Error Id').isMongoId(),
    check('id').custom( id => existObject( id, 'BuyInvoice') ),
    check('product', 'Error Id').isMongoId(),
    check('product').custom( product => existProduct( product ) ),
    check('manager', 'Error Id').isMongoId(),
    check('manager').custom( manager => existObject( manager, 'User') ),
    check('provider', 'Error Id').isMongoId(),
    check('provider').custom( provider => existObject( provider, 'Provider') ),
    check('quantity', 'quantity must be numeric').isNumeric(),
    check('total', 'total must be numeric').isNumeric(),
    check('total', 'total is required').notEmpty(),
    fieldsValidator
], buyInvoicePut );

router.delete('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'Error Id').isMongoId(),
    check('id').custom( id => existObject( id, 'BuyInvoice') ),
    fieldsValidator
], buyInvoiceDelete );

module.exports = router;