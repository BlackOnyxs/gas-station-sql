const { Router } = require('express');
const { check } = require('express-validator');

const { oilsGet, oilGetById, oilPost, oilPut, oilDelete, oilInventoryQuantity } = require('../controllers/oil');
const { fieldsValidator, isAdmin, jwtValidate, hasRole } = require('../middlewares');
const { existObject } = require('../middlewares/db-validators');

const router = Router();


router.get('/', [
    jwtValidate,
   hasRole('ADMIN_ROLE', 'DISPENSER_ROLE'),
    fieldsValidator
], oilsGet );

router.get('/:id', [
    jwtValidate,
   hasRole('ADMIN_ROLE', 'DISPENSER_ROLE'),
    check('id', 'El id es requerido').not().isEmpty(),
    fieldsValidator
], oilGetById );

router.post('/', [
    jwtValidate,
    isAdmin,
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('branch', 'Branch is required').not().isEmpty(),
    check('viscosityGrade', 'Viscosity grade is required').not().isEmpty(),
    check('type', 'type is required').not().isEmpty(),
    check('size', 'Size is required').not().isEmpty(),
    fieldsValidator
], oilPost );

router.put('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'El id es requerido').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('branch', 'Branch is required').not().isEmpty(),
    check('viscosityGrade', 'Viscosity grade is required').not().isEmpty(),
    check('type', 'type is required').not().isEmpty(),
    check('size', 'Size is required').not().isEmpty(),
    fieldsValidator
], oilPut );

router.delete('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'El id es requerido').not().isEmpty(),
    fieldsValidator
], oilDelete );


module.exports = router;