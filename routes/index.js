const routes = require('express').Router()
const Controller = require('../controllers')
const isLogIn = function(req, res, next){
  const error = 'You have to log in first'
  if(!req.session.userId){
    return res.redirect(`/login?error=${error}`)
  }
  next()
}

routes.get('/register', Controller.regisForm)
routes.post('/register', Controller.postRegis)

routes.get('/login', Controller.loginForm)
routes.post('/login', Controller.loginValidator)

routes.get('/logout', Controller.logout)

routes.use(isLogIn)


routes.get('/', Controller.courses)

routes.get('/profile/', Controller.profileForm)
routes.post('/profile', Controller.updateProfile)

routes.get('/course/:courseId/edit', Controller.editCourseForm)
routes.post('/course/:courseId/edit', Controller.editCourse)

routes.get('/course/:courseId/delete', Controller.delete)

routes.get('/course/add', Controller.addCourseForm)
routes.post('/course/add', Controller.addCourse)

routes.get('/course/:courseId', Controller.addToList)
routes.get('/list', Controller.list)

module.exports = routes