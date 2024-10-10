const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError")




function authenticationJWT(req, res, next) {
    try {
        const payload = jwt.verify(req.body._token, SECRET_KEY)
        req.user = payload
        return next()

    } catch (e) {
        return next()
    }
}

function ensureLoggedIn(req, res, next) {
    if (!req.user) {
        const e = new ExpressError("Unauthorized", 401)
        return next(e)
    } else {
        return next()
    }
}

module.exports = { authenticationJWT, ensureLoggedIn }