const request = require('supertest')
const db = require('../../data/dbConfig')
const server = require('../server')
const Fruits = require('./fruits-model')

const fruit1 = { name: 'apple' }
const fruit2 = { name: 'pear' }
const fruit3 = { name: 'strawberry' }


beforeEach(async () => {
   await db('fruits').truncate()
})
beforeAll(async () => {
   await db.migrate.rollback()
   await db.migrate.latest()
})
afterAll(async () => {
   await db.destroy()
})

it("correct env variable", () => {
expect(process.env.DB_ENV).toBe('testing')
})

describe('checking the fruits model functions', () => {
   describe('creates a fruit', () => {
      it('adds a fruit to db', async () => {
         let fruit
         await Fruits.add(fruit1)
         fruit = await db('fruits')
         expect(fruit).toHaveLength(1)
      })
      it('adds the correct fruits', async () => {
         let fruit
         await Fruits.add(fruit2)
         fruit = await db('fruits').first()
         expect(fruit).toMatchObject({ name: "pear" })
      })
   })



   describe('deletes a fruit', () => {
      it('deletes fruit from the db', async () => {
         const [fruit_id] = await db('fruits').insert(fruit1)
         await db('fruits').insert(fruit2)
         await db('fruits').insert(fruit3)
         let fruit = await db('fruits')
         expect(fruit).toHaveLength(3)
         await request(server).delete("/api/fruits/" + fruit_id)
         let newFruit = await db('fruits')
         expect(newFruit).toHaveLength(2)
      })
      it('can show deleted fruit', async () => {
         await db('fruits').insert(fruit2)
         let deletedFruit = await request(server).delete("/api/fruits/1")
         expect(deletedFruit.body).toMatchObject({ name: "apple" })
      })
   })
})

describe('testing router functions', () => {
   describe('post adds to db', () => {
      it('adds to the db', async () => {
         const newFruit = await request(server).post('/api/fruits').send({name: "strawberry"})
         expect(newFruit.status).toBe(201)
      })
   })
})