const db = require('../../data/Config')

const getAll = () => {
   return db('fruits')
}

const getById =  (id) => {
   return db('fruits').where('fruit_id', id).first()
}

const add = async (resource) => {
   const [id] = await db('fruits').insert(resource)
   return db('fruits').where('fruit_id', id).first()
}

const deleteFruit = async (id) => {
   const fruitName = await db('fruits').where('fruit_id', id).first()
   await db('fruits').where('fruit_id', id).del()
   return fruitName
}

module.exports = {
   getAll,
   getById,
   add,
   deleteFruit
}