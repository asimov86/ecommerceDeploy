const { Router } = require('express')
const { generateToken, authToken } = require('../utils/jwt')
const roles = require('../middleware/roles.middleware')
const ROLES = require('../constants/roles.constant')

const router = Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  // const user = await Users.findOne({email})

  // if(!comparePassword(user.password, password)) return res.json({ status: 'error' })
  const user = {
    _id: 'jdh78wjy9a8h8weds',
    name: 'Mate',
    lastname: 'Naran',
    password: 'eomumhfa9w478crhw8hjw978cfhw78h',
    role: 'user',
  }

  const token = generateToken(user._id)

  res.json({ status: 'Success', message: 'Logged in', token })
})

router.get('/', authToken, (req, res) => {
    const user = {
      name: 'Mate',
      lastname: 'Naran',
      role: 'user',
    }

    res.json({ message: user })
  }
)

module.exports = router