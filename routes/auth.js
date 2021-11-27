const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

router.get('/login', async (req, res) => {
    if (req.session.isAuth) {
        res.redirect('/')
    } else {
        res.render('auth/login', {
            layout: 'auth',
            title: 'Авторизация',
            error: req.flash('error')
        })
    }
})

router.get('/logout', async (req, res) => {
    try {
        req.session.destroy(() => {
            res.redirect('/auth/login')
        })
    } catch(e) {
      console.log(e);
      res.redirect('/')
    }
})

router.post('/login', async (req, res) => {
    const {login, password} = req.body
    const candidate = await User.findOne({ login })

    if (candidate) {
        const areSame = await bcrypt.compare(password, candidate.password)

        if (areSame) {
            req.session.user = candidate
            req.session.isAuth = true
            req.session.save(err => {
                if (err) {
                    throw err
                }
                res.redirect('/')
            })
        } else {
            req.flash('error', 'Неверный пароль...')
            res.redirect('/auth/login')
        }
    } else {
        req.flash('error', 'Пользователь не найден...')
        res.redirect('/auth/login')
    }
})

router.get('/register', async (req, res) => {
    if (!req.session.isAuth) {
            res.render('auth/register', {
                layout: 'auth',
                title: 'Регистрация',
                error: req.flash('error')
        })
    } else {
        res.redirect('/')
    }
})
router.post('/register', async (req, res) => {
    const {login, password} = req.body
    const candidate = await User.findOne({login})

    if (candidate) {
        req.flash('error', 'Пользователь с таким никнеймом уже существует')
        res.redirect('/auth/register')
    } else {
        const passHash = await bcrypt.hash(password, 10)
        const user = new User({
            login: login, 
            password: passHash
        })
        await user.save()
        res.redirect('/auth/login')
    }
})

module.exports = router