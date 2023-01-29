const {PostsModel} = require(`./posts.schema`)
const { errorHandler } = require('../../utils/error');
const { paginate } = require('../../helpers/pagination');
const { log,levelNames } = require(`../../utils/log`)




module.exports.create = ({ post }) => {
    return new Promise((resolve, reject) => {
        return PostsModel.create(post)
            .then(createdPost => {
                resolve(createdPost)
            })
            .catch(err => {
                reject(errorHandler({ err }))
            })
    })
}