const express = require('express')
const router = express.Router()
const Jwttokens = require('../model/jwttokens')
const SteamApp = require('../model/steamapps')
const SteamAppDetail = require('../model/steamappdetail')
const jwt = require('jsonwebtoken')

// GET
router.get('/', authenticateToken, async (req, res) => {

    // console.log('Final value: '+req.access)

    const apps = await SteamApp.find()
    let sts = ''
    let newtoken = ''
    console.log(apps)
    
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
        datus: apps
    })
   
})

// GET
router.get('/:search', authenticateToken, async (req, res) => {

    console.log('Final value: '+req.access)
    const search =  req.params.search;
    // console.log(search)
    const apps = await SteamApp.find({ title: { $regex: search } });
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
        datus: apps
    })
   
})


// GET
router.get('/appdetail/:appid', authenticateToken, async (req, res) => {

    // console.log('Final value: '+req.access)
    const appid =  req.params.appid;
    console.log('server ID '+appid)
    const apps = await SteamAppDetail.findOne({ appId: appid });
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
        datus: apps
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