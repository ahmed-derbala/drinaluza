const mongoose = require('mongoose');
const { UsersModel } = require(`../users/users.schema`)
const Sessions = require(`../sessions/sessions.schema`)
const bcrypt = require('bcrypt');
const { errorHandler } = require('../../core/utils/error');
const jwt = require('jsonwebtoken');
const conf = require(`../../core/utils/loadConf`)

module.exports.signup = ({ user }) => {
    return new Promise((resolve, reject) => {

        const salt = bcrypt.genSaltSync(conf().auth.saltRounds)
        user.password = bcrypt.hashSync(user.password, salt)

        /*  if (!user.profile?.displayname) user.profile.displayname = `${user.profile.firstname} ${user.profile.lastname}`
      
              user.phone.countryCode = user.phone.countryCode.trim()
              user.phone.shortNUmber = user.phone.shortNumber.trim()
              user.phone.fullNumber = `${user.phone.countryCode}${user.phone.shortNumber}`
      */
        return UsersModel.create(user)
            .then(createdUser => {
                createdUser = createdUser.toJSON()
                delete createdUser.password
                if (createdUser.username == null) {
                    return UsersModel.updateOne({ _id: createdUser._id }, { username: createdUser._id })
                        .then(updatedUser => {
                            createdUser.username = createdUser._id
                            return resolve({ message: 'user created', data: createdUser, status: 201 })
                        })
                        .catch(err => {
                            reject(errorHandler({ err }))
                        })
                }
                resolve({ message: 'user created', data: createdUser, status: 201 })
            })
            .catch(err => {
                reject(errorHandler({ err }))
            })
    })
}



module.exports.signin = async ({user,req}) => {
    return new Promise((resolve, reject) => {
    return UsersModel.findOne({ email: user.email }).lean().select('+password')
        .then(fetchedUser => {
            if (fetchedUser == null) {
                return reject({ message: 'user not found', data: null, status: 404 })
            }
            //user found, check password
            const passwordCompare = bcrypt.compareSync(user.password, fetchedUser.password)

            delete fetchedUser.password//we dont need password anymore
            if (passwordCompare == false) {
                return reject({ message: 'password incorrect', data: null, status: 409 })
            }
            const token = jwt.sign({ fetchedUser, ip: req.ip, userAgent: req.headers['user-agent'] }, conf().auth.jwt.privateKey, { expiresIn: '30d' })

            return Sessions.create({ token, user:fetchedUser, headers: req.headers,ip:req.ip })
                .then(session => {
                   return resolve({ status: 200, message: 'success', data: { user:fetchedUser, token }, })
                })
                .catch(err => reject(errorHandler({ err })))
        })
        .catch(err => reject(errorHandler({ err })))
    })
}
