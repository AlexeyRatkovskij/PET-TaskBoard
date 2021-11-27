const {Schema, model} = require('mongoose')

const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  column: {
    type: Number,
    required: true,
    default: 1
  },
  row: {
    type: Number,
    required: true,
    default: 1
  },
  color: {
    type: String,
    required: true,
    default: 1
  },
  userId: {
  	type: Schema.Types.ObjectId,
  	ref: 'User'
  }
})

module.exports = model('Task', taskSchema)