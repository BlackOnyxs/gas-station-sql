const { Router } = require('express');
const { check } = require('express-validator');

const { scheduleGet, scheduleGetById, schedulePost, schedulePut, scheduleDelete } = require('../controllers/schedule');
const { jwtValidate, fieldsValidator, isAdmin } = require('../middlewares');
const { existObject } = require('../middlewares/db-validators');

const router = Router();

router.get('/', [
    jwtValidate,
    isAdmin,
    fieldsValidator
], scheduleGet );

router.get('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'Error Id').isMongoId(),
    check('id').custom( id => existObject( id, 'Schedule') ),
    fieldsValidator
], scheduleGetById );

router.post('/', [
    jwtValidate,
    isAdmin,
    check('turn', 'Error Id').isMongoId(),
    check('turn').custom( turn => existObject( turn, 'Turn') ),
    check('dispenser', 'Error Id').isMongoId(),
    check('dispenser').custom( dispenser => existObject( dispenser, 'User') ),
    check('date', 'date is required').not().isEmpty(),
    fieldsValidator
], schedulePost );

router.put('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'Error Id').isMongoId(),
    check('id').custom( id => existObject( id, 'Schedule') ),
    check('turn', 'Error Id').isMongoId(),
    check('turn').custom( turn => existObject( turn, 'Turn') ),
    check('dispenser', 'Error Id').isMongoId(),
    check('dispenser').custom( dispenser => existObject( dispenser, 'User') ),
    check('date', 'date is required').not().isEmpty(),
    fieldsValidator
], schedulePut );

router.delete('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'Error Id').isMongoId(),
    check('id').custom( id => existObject( id, 'Schedule') ),
    fieldsValidator
], scheduleDelete );

module.exports = router;


