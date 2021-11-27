const {Router} = require('express')
const router = Router()
const Task = require('../models/task')
const mongoose = require('mongoose')

router.get('/tasks', async (req, res) => {
	const id = mongoose.Types.ObjectId(req.session.user['_id'])
	const tasks = await Task.find({userId: id})
	return res.json(tasks)
})

router.get('/update/:taskId/:placeId/:num', async (req, res) => {
	try {
		const id = mongoose.Types.ObjectId(req.params.taskId)
		const errors = false
		Task.updateOne(
			{_id : id},
			{$set: 
				{column : Number(req.params.placeId)}
			}, 
			(err, result) => {
				if(err) errors = true
			}
		)
		Task.updateOne(
			{_id : id}, 
			{$set: 
				{row : Number(req.params.num)}
			}, 
			(err, result) => {
				if(err) errors = True
			}
		)
		if(errors) return res.sendStatus(503)
		return res.sendStatus(200)
	 } catch(e) {
	  	console.log(e);
	  	res.sendStatus(503)
	 }
})


router.get('/remove/:taskId', async (req, res) => {
	try {
		const id = mongoose.Types.ObjectId(req.params.taskId)
		const errors = false
		Task.findOneAndDelete(
			{_id : id}, 
			(err, result) => {
				if(err) errors = True
			}
		)
		if(errors) return res.sendStatus(503)
		return res.sendStatus(200)
	 } catch(e) {
	  	console.log(e);
	  	res.sendStatus(503)
	 }
})

router.get('/get/:taskId', async (req, res) => {
	try {
		const id = mongoose.Types.ObjectId(req.params.taskId)
		const task = await Task.findById(id)
		return res.json(task)
	 } catch(e) {
	  	console.log(e);
	  	res.sendStatus(503)
	 }
})
module.exports = router