const {Router} = require('express')
const router = Router()
const Task = require('../models/task')
const mongoose = require('mongoose')

router.get('/', async (req, res) => {
    if (req.session.isAuth) {
      res.render('index', {
        title: 'Главная страница',
        isHome: true,
        username: req.session.user['login']
      })
    } else {
      res.redirect('/auth/login')
    }
})

router.post('/', async (req, res) => {
  const row = await Task.find()
  const task = new Task({
  	title: req.body.title,
  	description: req.body.description.length > 0 ? req.body.description : ' ',
  	color: req.body.color,
    row: row.length + 1,
    userId: req.session.user
  })
  try {
  	await task.save()
  	res.redirect('/')
  } catch(e) {
  	console.log(e);
  }
})

router.post('/update', async (req, res) => {
  try {
    
    const id = mongoose.Types.ObjectId(req.body.id)
    const taskUpd = await Task.findById(id)
    taskUpd.title = req.body.title
    taskUpd.description = req.body.description.length > 0 ? req.body.description : ' '
    taskUpd.color = req.body.color
    
    await taskUpd.save()
    res.redirect('/')
  } catch(e) {
    console.log(e);
  }
})
 
module.exports = router