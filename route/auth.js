const router = require('express').Router()
const { request } = require('express')
const Controller = require('../controller/User')
const verify = require('./authVerify')
// VALIDATION OF USER INPUT PRE REQUISITES



router.post('/register', Controller.signUp)

router.post('/login', Controller.logIn)

router.get('/get_all', verify, Controller.getAllUsers)
module.exports = router