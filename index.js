const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')

const homeRoutes = require('./routes/home')
const taskAddRoutes = require('./routes/taskAdd')
const apiRoutes = require('./routes/api')
const authRoutes = require('./routes/auth')

const MONGODB_URI = `mongodb+srv://alexwells:mBhrXu0oh68f2Tbo@cluster0.3ysox.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const varMiddleware = require('./middleware/variables')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

const store = new MongoDBStore({
	collection: 'sessions',
	uri: MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
	secret: 'secret value',
	resave: false,
	saveUninitialized: false,
	store
}))
app.use(flash())
app.use(varMiddleware)

app.use('/', homeRoutes)
app.use('/taskAdd', taskAddRoutes)
app.use('/api', apiRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

async function start() {
	try {
		
		await mongoose.connect(MONGODB_URI, {
			useNewUrlParser: true
		})
		app.listen(PORT, () => {
	  		console.log(`Server is running on port ${PORT}`)
		})
	} catch(e) {
		console.log(e);
	}
}

start()
