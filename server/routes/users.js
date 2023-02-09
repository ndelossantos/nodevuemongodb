const express = require('express')
const app = express()
const router = express.Router()
const Users = require('../model/users')
const Jwttokens = require('../model/jwttokens')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



/** Auth guide
    registration:
        create and save hash(bcrypt) password
        create access & refresh token
    login:
        authenticate- find user and compare pword with bcrypt

    TOKEN STEPS *
        client: login -> sever: check credentials
            if valid, return new access token to client and save new refresh token to db, probably user table
        client: get request -> server: check access token validity and expiration
            if valid, process request (jwt verify)
            if not expired, process request (jwt verify)
            if access token not valid -> might be a hack, because server always generate new access token
                remove all tokens and redirect login
            if access token expired -> check the users refresh token if valid and not also expired,
                if VALID, create a new access token to user and continue the GET request
                if EXPIRED, redirect login

        for test purpose, tokens will be stored to localstorage but saving in server side is recommended

        etc. you can add roles to access tokens and use it for the users limited role
        
 */

// GET
router.get('/', async (req, res) => {
    // res.send('Hello from users route')
    try{
        const users = await Users.find()
        res.json(users)
    } catch(err) {
        // Err stat 500 means server or dev error
        res.status(500).json({ message: err.message })
    }
})


// POST
router.post('/register', async (req, res) => {

    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log(hashedPassword)

        const insertData = new Users({
            username: req.body.username,
            password: hashedPassword,
          })
    
        try{
            const newUser = await insertData.save()
            res.status(201).json(newUser)
        }catch(err){
            res.status(400).json({ message: err.message})
        }

    } catch {
        res.status(500).send()
    }
})


router.post('/login', authLogin, async (req, res) => {
    

    if(res.usid){

        console.log('Authenticated')
        const userid = res.usid
        const username = req.body.username
        const userinfo = { 
            id: userid
            // name: username 
        } 

        const accessToken = generateAccessToken(userinfo)
        // console.log('accesstoken: '+accessToken)
        const refreshToken = jwt.sign(userinfo, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '25s' }) //{ expiresIn: '100s' }

        const hasRefreshToken = await Jwttokens.findOne({ _id: userid })

        if(hasRefreshToken){
            const filter = { _id: userid }
            const update = { refresh: refreshToken }
            // Update existing
            await Jwttokens.findOneAndUpdate(filter, update);
        }else{

            // Insert new
            try {
                const insertToken = new Jwttokens({
                    _id:        userid,
                    refresh:    refreshToken
                  })
    
                await insertToken.save()
                // res.status(201).json(newTokens)
            }catch(err){
                console.log(err)
                // res.json({ sts: 'FAILED', msg: 'Invalid Login' })
            }
        }

        
        
        res.json({ 
            sts: 'SUCCESS', 
            accessToken: accessToken, 
            // refreshToken: refreshToken ,
            msg: 'Login Successfull'
        })

    }else{
        res.json({ sts: 'FAILED', msg: 'Invalid Login' })
    }

})


async function authLogin(req, res, next) {

    console.log(req.body.username+ ' / '+ req.body.password)

    const findUser = await Users.findOne({ username: req.body.username })
    
    let id = null
    if(findUser != null){
        try {
            if(await bcrypt.compare(req.body.password, findUser.password)) id = findUser._id.toString()
        } catch {
            id = null
        }
    }
    console.log('ID: '+id)
    res.usid = id
    next()
}


function generateAccessToken(userinfo){
    console.log(userinfo)
    return jwt.sign(userinfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' })
}



module.exports = router