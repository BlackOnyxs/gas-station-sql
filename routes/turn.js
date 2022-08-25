const { Router } = require('express');
const { check } = require('express-validator');

const { turnsGet, turnGetById, turnPost, turnPut, turnDelete } = require('../controllers/turn');
const { jwtValidate, hasRole, fieldsValidator, isAdmin } = require('../middlewares');
const { existObject } = require('../middlewares/db-validators');

const router = Router();

router.get('/', [
    jwtValidate,
    hasRole('ADMIN_ROLE', 'SALE_ROLE'),
    fieldsValidator
], turnsGet );

router.get('/:id', [
    jwtValidate,
    hasRole('ADMIN_ROLE', 'SALE_ROLE'),
    check('id', 'Error Id').isMongoId(),
    check('id').custom( id => existObject( id, 'Turn') ),
    fieldsValidator
], turnGetById );

router.post('/', [
    jwtValidate,
    isAdmin,
    check('startTime', 'startTime is required').not().isEmpty(),
    check('endTime', 'endTime is required').not().isEmpty(),
    fieldsValidator
], turnPost );

router.put('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'Error Id').isMongoId(),
    check('id').custom( id => existObject( id, 'Turn') ),
    check('startTime', 'startTime is required').not().isEmpty(),
    check('endTime', 'endTime is required').not().isEmpty(),
    fieldsValidator
], turnPut );

router.delete('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'Error Id').isMongoId(),
    check('id').custom( id => existObject( id, 'Turn') ),
    fieldsValidator
], turnDelete );


module.exports = router;