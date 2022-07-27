import express from 'express'

const router = express.Router()

//Login Route
router.post("/login",() => {
    console.log("Login user")
})

//Sign Up Route
router.post("/signup",() => {
    console.log("sign up user")
})
//

export default router