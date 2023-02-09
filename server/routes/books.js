const express = require('express')
const router = express.Router()
const Books = require('../model/books')
const Users = require('../model/users')
const Jwttokens = require('../model/jwttokens')
const jwt = require('jsonwebtoken')
const { error } = require('console')

// GET
router.get('/', authenticateToken, async (req, res) => {

    // console.log('Final value: '+req.access)

    const books = await Books.find()
    let sts = ''
    let newtoken = ''
    
    // If req.access is token, send new token
    if(req.access.length > 20){
        sts = 'newtoken'
        newtoken = req.access
    }else if(req.access == 'redirect'){
        sts = 'redirect'
    }else{
        sts = 'valid'
    }

    res.json({ 
        sts: sts, 
        accessToken: newtoken, 
        datus: books
    })
   
})

function authenticateToken(req, res, next){
    
    // for some reason, this session is not working  =(
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if(token == null) return res.sendStatus(401)
    console.log('token: '+token)    
    // Using this to get ID for fetching the refresh token if things go fkd up.
    const decAccessToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    // console.log('ano tong haup na to?')

    const userid = decAccessToken.id

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(user)
        var actoken = []
        if (err) {
            // Validate user's refresh token
            Jwttokens.findOne({ _id: userid }, function(err,obj) { 
                
                if(obj){

                    jwt.verify(obj.refresh, process.env.REFRESH_TOKEN_SECRET, (err, user) => { 
                        // console.log('Still Valid')
                        if (!err) {
                            console.log('Refresher still valid')
                            const userinfo = { id: userid }
                            let gen = generateAccessToken(userinfo)
                            req.access = gen;
                            next()
                        }else{
                            req.access = 'redirect';
                            next()

                            // NATAPOS DIN!
                        }
                    })
              
                }
            });

        }else{
            req.access = 'valid';
            next()
        }
        
        
    })
}

function generateAccessToken(userinfo){
    return jwt.sign(userinfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5s' })
}



module.exports = router