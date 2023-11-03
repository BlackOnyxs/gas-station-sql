const { Router } = require('express');
const { jwtValidate, hasRole, fieldsValidator } = require('../middlewares');
const { dashboardStatistics } = require('../controllers/dashboard');
const { check } = require('express-validator');

const router = Router();

router.get( '', [
    jwtValidate,
    hasRole('ADMIN_ROLE'),
    check('startDate', 'La fecha de inicio es oblogatoria').notEmpty(),
    check('endDate', 'La fecha fianl es oblogatoria').notEmpty(),
    fieldsValidator
], dashboardStatistics );

module.exports = router;
