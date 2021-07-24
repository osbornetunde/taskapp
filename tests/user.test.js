const request = require('supertest')
const app = require('../src/app')
const User = require('../src/model/user')
const { userOneId, userOne, setUpDatabase} = require('./fixtures/db')



beforeEach(setUpDatabase)

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Funmi',
        email: 'funmiosborne@gmail.com',
        password: 'funmi'
    }).expect(201)

    //Assert that the database was changed currently
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about response
    expect(response.body).toMatchObject({
        user:{
            name: 'Funmi',
            email: 'funmiosborne@gmail.com'
        },
        token: user.tokens[0].token
    })

    //Assertion that password is not stored in plain text
    expect(user.password).not.toBe('funmi')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password,
    }).expect(200)

    const user = await User.findById(userOneId)
    //Assertion validate that new token is added to the token array
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'tunde@gmail.com',
        password: 'tunde'
    }).expect(400)
})


test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test("Should delete account for authenticated user", async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    //Assert that the user is not in the database
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})



test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/pics.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user field', async() => {
    await request(app)
        .patch('/users/me').send({name: 'Kolade'})
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Kolade')
})

test('Should not update invalid user field', async () => {
    await request(app)
        .patch('/users/me').send({location:'Tuns'})
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(400)
})
