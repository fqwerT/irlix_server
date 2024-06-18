const VacationService = require('../service/vacation-service/vacation-service')

const Router = require('express').Router
const router = new Router()

router.get('/vacation',VacationService.getRequests)
router.post('/vacation',VacationService.createRequest)
router.post('/vacation/request',VacationService.updateStatus)
router.get('/vacation/initial_data',VacationService.getVacations)
router.get('/vacation/single',VacationService.getVacation)

module.exports = router