const {User, Course, UserProfile, UserCourse} = require('../models')
const bcrypt = require('bcryptjs')
const {getTimeInterval} = require('../helper/getPublished')
const {Op} = require('sequelize')



class Controller{
  static regisForm(req, res){
    let errors = req.query.err
    
    res.render('regisForm', {errors})
  }

  static postRegis(req, res){
    let {firstName, lastName, gender, phoneNumber, username, password, type, fav} = req.body
    let role

    if(fav == 'ikan terbang') role = 'admin', type = 'admin'
    else role = 'user'
    
    User.create({username, password, type, role})
    .then(user => {
      let UserId = user.id
      return UserProfile.create({firstName, lastName, gender, phoneNumber, UserId, fav})
    })
    .then(() => {
      res.redirect('/login')
    })
    .catch(err => {
      let errors = err.errors.map(e => e.message)
      if(errors.length != 0){
        res.redirect(`/register?err=${errors}`)
      }
    })
  }

  static loginForm(req, res){
    let error = req.query.error
    res.render('loginPage', { error })
  }

  static loginValidator(req, res){
    const {username, password} = req.body
    const error = 'username/password invalid'

    if(!username){
      return res.redirect(`/login?error=${error}`)
    }

    User.findOne( { where: { username } })
    .then(user => {
      const isValid = bcrypt.compareSync(password, user.password)
      if(user && isValid){
        req.session.userId = user.id
        req.session.role = user.role
        
        return res.redirect('/')
      }
      if(!user || !isValid){
        return res.redirect(`/login?error=${error}`)
      }
      
    })
    .catch(err => {
      if(err) res.redirect(`/login?error=${error}`)
    })
  }

  static courses(req,res){

    let opt = {}

        let { name, category } = req.query


            if(name && category){

                opt[Op.and] = [{

                    name : {
                        [Op.iLike]: `%${name}%`
                    },
                    category : {
                        [Op.iLike] : `%${category}%`
                    }
                }]

            }

             if(name){
                opt.name = {
                    [Op.iLike] : `%${name}%`
                }
            }

            if(category){
                opt.category = {
                    [Op.iLike] : `%${category}%`
                }
            }
            Course.findAll({where: opt})
            .then(courses => {
              let isAdmin = req.session.role
              res.render('courses', { courses, isAdmin, getTimeInterval })
            })
            .catch(err => res.send(err))
  }

  static profileForm(req,res){
    const id = req.session.userId
    const errors = req.query.err
    const success = req.query.success
    
    User.findOne({where: {id}, include: UserProfile})
    .then(user => {
      res.render('profile', {user, errors, success})
    })
    .catch(err => res.send(err))
  }

  static updateProfile(req, res){
    let id = req.session.userId
    let {firstName, lastName, gender, phoneNumber, username, password, type, fav} = req.body
    let data = {username, password, type}
    if(password == ''){
      data = {username, type}
    }
    User.update(data, {
      where: {id}
    })
    .then(() => {
      return UserProfile.update({firstName, lastName, gender, phoneNumber, fav}, {where : {UserId: id}})
    })
    .then(()=> {
      const success = 'profile has been updated'
      res.redirect(`/profile?success=${success}`)
    })
    .catch(err => {
      console.log(err)
      if(err.errors){
        let errors = err.errors.map(e => e.message)
        return res.redirect(`/profile?err=${errors}`)
      }
      res.send(err)
    })
  }

  static editCourseForm(req, res){
    const id = req.params.courseId
    const errors = req.query.err
    Course.findOne({where: {id}})
    .then(course => {
      res.render('editCourse', {course, errors, id})
    })
    .catch(err => res.send(err))
  }

  static editCourse(req, res){
    const id = req.params.courseId
    const {name, description, videoURL, category, imageURL} = req.body
    Course.update({name, description, videoURL, category, imageURL}, {where: {id}})
    .then(()=> {
      res.redirect('/')
    })
    .catch(err => {
      if(err.errors){
        let errors = err.errors.map(e => e.message)
        return res.redirect(`/course/${id}/edit?err=${errors}`)
      }
      res.send(err)
    })
  }

  static delete(req, res){
    const id = req.params.courseId
    Course.destroy({where: {id}})
    .then(() => {
      res.redirect('/')
    })
    .catch(err => res.send(err))
  }

  static addCourseForm(req, res){
    let errors = req.query.err
    res.render('addCourse', {errors})
  }

  static addCourse(req, res){
    const {name, description, videoURL, category, imageURL} = req.body
    Course.create({name, description, videoURL, category, imageURL})
    .then(() => {
      res.redirect('/')
    })
    .catch(err => {
      if(err.errors){
        const errors = err.errors.map(e => e.message)
        return res.redirect(`/course/add?err=${errors}`)
      }
    })
  }

  static addToList(req, res){
    let CourseId = req.params.courseId
    let UserId = req.session.userId
    UserCourse.create({UserId, CourseId})
    .then(()=> {
      res.redirect('/')
    })
    .catch(err => res.send(err))
  }

  static list(req,res){
    const id = req.session.userId
    User.findOne({where: {id}, include: Course})
    .then(user => {
      res.render('yourList', {user})
    })
    .catch(err => res.send(err))
  }

  static logout(req, res){
    req.session.destroy(err => {
      if(err) res.send(err)
      else res.redirect('/login')
    })
  }
}

module.exports = Controller