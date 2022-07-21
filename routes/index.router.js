const express = require('express');
const router = express.Router();

const ctrlUser = require('../controller/user.controller');

const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.put('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.updateUserProfile);
router.get('/user/:username',jwtHelper.verifyJwtToken, ctrlUser.findUser);
router.get('/getAllUsers',jwtHelper.verifyJwtToken,ctrlUser.findAllUsers);

module.exports = router;



