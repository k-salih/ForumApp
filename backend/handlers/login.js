import { authenticateUser } from '../services/login'

export const loginHandler = async (req, res) => {
  try {
    const { username, password } = req.body
    const loginData = await authenticateUser(username, password)
    res.status(200).json(loginData)
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}
