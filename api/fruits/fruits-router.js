const router = require('express').Router()
const Fruits = require('./fruits-model')
const { checkInDb } = require('./resource-middleware')


router.post('/', checkInDb, async (req, res, next) => {
try {
const newFruit = await Fruits.add(req.body)
   res.status(201).json(newFruit)
} catch(err) {
    next(err)
}
})

router.delete('/:id', async (req, res, next) => {
const { id } = req.params
   const remove = await Fruits.deleteFruit(id)
   res.status(200).json(remove)
   next()
})
module.exports = router