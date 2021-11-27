const {Router} = require('express')
const Task = require('../models/task')
const router = Router()
const moment = require('moment-timezone')

router.get('/', (req, res) => {
  res.render('taskAdd', {
    title: 'Добавить задачу',
    isAdd: true
  })
})

router.post('/', async (req, res) => {
  const len = Task.find().length
  const task = new Task({
  	title: req.body.title,
  	description: req.body.description,
  	status: 1,
    color: req.body.color,
    row: len,
    userId: req.session.user
  })
  try {
  	await task.save()
  	res.redirect('/')
  } catch(e) {
  	console.log(e);
  }

})

module.exports = router