const { Router } = require('express');
const { check } = require('express-validator');

const { fuelsGet, fuelGetById, fuelPost, fuelPut, fuelDelete } = require('../controllers/fuel');
const { jwtValidate, hasRole, fieldsValidator, isAdmin } = require('../middlewares');
const { existFuelById } = require('../middlewares/db-validators');

const router = Router();

router.get('/', [
    jwtValidate,
    hasRole('ADMIN_ROLE', 'SALE_ROLE'),
    fieldsValidator
], fuelsGet );

router.get('/:id', [
    jwtValidate,
    hasRole('ADMIN_ROLE', 'SALE_ROLE'),
    check('id', 'Error Id').isMongoId(),
    check('id').custom( existFuelById ),
    fieldsValidator
], fuelGetById );

router.post('/', [
    jwtValidate,
    isAdmin,
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    fieldsValidator
], fuelPost );

router.put('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'Error Id').isMongoId(),
    check('id').custom( existFuelById ),
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('type', 'Type is required').not().isEmpty(),
    check('octane', 'Octane is required').not().isEmpty(),
    check('inventory', 'Inventory is required').not().isEmpty(),
    fieldsValidator
], fuelPut );

router.delete('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'Error Id').isMongoId(),
    check('id').custom( existFuelById ),
    fieldsValidator
], fuelDelete );

module.exports = router;