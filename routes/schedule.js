const { Router } = require('express');
const { check } = require('express-validator');

const { scheduleGet, scheduleGetById, schedulePost, schedulePut, scheduleDelete, scheduleByDispenser } = require('../controllers/schedule');
const { jwtValidate, fieldsValidator, isAdmin, hasRole } = require('../middlewares');
const { existObject } = require('../middlewares/db-validators');

const router = Router();

router.get('/', [
    jwtValidate,
    isAdmin,
    fieldsValidator
], scheduleGet );

// router.get('/:id', [
//     jwtValidate,
//     isAdmin,
//     check('id', 'Error Id').isMongoId(),
//     check('id').custom( id => existObject( id, 'Schedule') ),
//     fieldsValidator
// ], scheduleGetById );

router.get('/mobile', [
    jwtValidate,
    hasRole('ADMIN_ROLE', 'DISPENSER_ROLE'),
    fieldsValidator
], scheduleByDispenser );

router.post('/', [
    jwtValidate,
    isAdmin,
    check('turn', 'El turno es requerido').not().isEmpty(),
    check('dispenser','El dispenser es requerido').not().isEmpty(),
    check('date', 'date is required').not().isEmpty(),
    fieldsValidator
], schedulePost );


router.put('/:id', [
    jwtValidate,
    isAdmin,
    // check('id', 'El id es requerido').not().isEmpty(),
    check('turn', 'El turno es requerido').not().isEmpty(),
    check('dispenser', 'El despachador es requerido').not().isEmpty(),
    check('date', 'date is required').not().isEmpty(),
    fieldsValidator
], schedulePut );

router.post('/delete', [
    jwtValidate,
    isAdmin,
    // check('id', 'El id es requerido').not().isEmpty(),
    check('turn', 'El turno es requerido').not().isEmpty(),
    check('dispenser', 'El despachador es requerido').not().isEmpty(),
    fieldsValidator
], scheduleDelete );

module.exports = router;


