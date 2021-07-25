const request = require('supertest')
const Task = require('../src/model/task')
const app = require('../src/app')
const { userOneId, userOne, setUpDatabase, taskOne, userTwo, taskTwo, taskThree} = require('./fixtures/db')



beforeEach(setUpDatabase)
test('Should creating task for user', async () =>{
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should return all task for user one', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)
})

test('Second user should not be able to delete first task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()


})

test('user should be able to delete first task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Task.findById(taskOne._id)
    expect(task).toBeNull()
})

test('Should not create task with invalid description/completed', async() => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: '',
            completed:true,
        })
        .expect(400)
})

test('Should not update task with invalid description/completed', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .send({
            description: ''
        })
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(400)
})

test('should not delete task if unauthenticated', async () => {
    await request(app)
        .delete(`/tasks/${taskTwo._id}`)
        .expect(401)
})

test('Should not update other users task', async() => {
    await request(app)
        .patch(`/tasks/${taskThree._id}`)
        .send({
            description: 'updated by user one'
        })
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(404)
})

test('Should fetch user task by id', async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
})

test('Should fetch user task by id', async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .expect(401)
})

test('Should not fetch other users task by id', async() => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(404)
})

test('Should fetch only completed tasks', async() => {
    const response = await request(app)
        .get(`/tasks?completed=true`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body.length).toBe(1)
})

test('Should fetch only incomplete tasks', async ( ) => {
    const response = await request(app)
        .get('/tasks?completed=false')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(200)

    expect(response.body.length).toBe(1)
})

test('Should sort tasks by description/completed/createdAt/updatedAt', async () => {
    await request(app)
        .get('/tasks?sort=createdAt')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
})

test('Should fetch page of tasks', async () => {
    const response = await request(app)
        .get('/tasks?limit=1')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body.length).toBe(1)
})
