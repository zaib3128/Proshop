import express from 'express'
const router = express.Router()
import { authUser, registerUser ,getUserProfile, upadateUserProfile, getUsers, deleteUsers, getUserById, upadateUser } from '../controllers/userController.js'
import {protect, admin} from '../middleware/authMiddleware.js'


router.route('/').post(registerUser).get(protect, admin,  getUsers)
router.post('/login', authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, upadateUserProfile)
router.route('/:id').delete(protect, admin, deleteUsers).get(protect, admin, getUserById).put(protect, admin, upadateUser)

export default router
