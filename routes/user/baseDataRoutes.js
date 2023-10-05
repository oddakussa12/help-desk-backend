const express = require('express');
const baseDataController = require('../../controllers/API/User/baseDataController');

const router = express.Router();

router.get('/issue_categories', baseDataController.issueCategoryIndex);

module.exports = router;