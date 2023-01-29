const fs = require('fs');
const { log } = require(`../utils/log`)




module.exports.routes = (app) => {
    let directories = fs.readdirSync(`${process.cwd()}/src/`)
    let endpoint_root,files
    for (const dir of directories) {
        files = fs.readdirSync(`${process.cwd()}/src/${dir}`)
        if (files.length > 0) {
            for (const file of files) {
                if (file.includes('.api.controller.js')) {
                    endpoint_root = file.substring(0, file.indexOf('.api.controller.js'))
                    app.use(`/api/${endpoint_root}`, require(`${process.cwd()}/src/${dir}/${file}`));
                }
                if (file.includes('.view.controller.js')) {
                    endpoint_root = file.substring(0, file.indexOf('.view.controller.js'))
                    app.use(`/${endpoint_root}`, require(`${process.cwd()}/src/${dir}/${file}`));
                }
            }
        }
    }
    app.use(`/`, require(`${process.cwd()}/src/index/index.view.controller`));//make sure main url works with src/index
    log({ level: 'success', message: 'routes loaded' })
}

