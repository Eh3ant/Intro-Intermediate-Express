const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError")
const db = require("../db");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const { ensureLoggedIn } = require('../middleware/auth')

router.get("/", (req, res, next) => {
    res.send("APP IS WORKING")
})

router.post("/rigester", async (req, res, next) => {
    try {

        const { username, password } = req.body
        if (!username || !password) {
            throw new ExpressError("username and password  required", 400)
        }
        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
        const result = await db.query(`INSERT INTO users (username,password) VALUES ($1,$2) RETURNING username`, [username, hashedPassword])
        return res.json(result.rows[0])

    } catch (e) {
        if (e.code === '23505') {
            return next(new ExpressError("Username taken, Please pick another!", 400))
        }
        return next(e)
    }
})


router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            throw new ExpressError("username and password  required", 400)
        }
        const results = await db.query(`SELECT username , password FROM users WHERE username = $1`, [username])
        const user = results.rows[0]
        if (user) {
            if (await bcrypt.compare(password, user.password) === true) {
                const token = jwt.sign({ username }, SECRET_KEY);

                return res.json({ message: "Logged In!", token })
            }
        }
        throw new ExpressError('Invali username/password', 400)
    } catch (e) {
        return next(e);
    }

})

router.get('/secret', ensureLoggedIn, (req, res, next) => {
    try {

        return res.json({ msg: "WELCOM TO SECRET PAGE!" })
    } catch (e) {
        return next(new ExpressError("Please Login first"), 401)
    }
})

router.get('/privet', ensureLoggedIn, (req, res, next) => {
    try {
        return res.json({ msg: `WELCOME TO VIP SECTION,${req.user.username}` })
    } catch (e) {
        return next(e)
    }

})

module.exports = router