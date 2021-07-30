const path = require('path')
const express = require('express');
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const swaggerDocPath = path.resolve(__dirname, './swagger.yml')
const swaggerDoc = YAML.load(swaggerDocPath)

const app = express();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)






module.exports = app

