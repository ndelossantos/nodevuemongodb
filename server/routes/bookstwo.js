const express = require('express')
const router = express.Router()
const Jwttokens = require('../model/jwttokens')
const Bookstwo = require('../model/bookstwo')
const SteamAppDetail = require('../model/steamappdetail')
const jwt = require('jsonwebtoken')

// GET
router.get('/', authenticateToken, async (req, res) => {

    console.log('view books')
    console.log(req.access)

    const apps = await Bookstwo.find()
    const resp = setResponse(req.access)
    
    res.json({ 
        sts: resp.sts, 
        accessToken: resp.token, 
        datus: apps
    })
   
})


// GET
router.get('/:id', authenticateToken, async (req, res) => {

    const apps = await Bookstwo.findOne({ _id: req.params.id });
    console.log(apps)
    const resp = setResponse(req.access)

    res.json({ 
        sts: resp.sts, 
        accessToken: resp.token, 
        datus: apps
    })
   
})


router.post('/delete', authenticateToken, async (req, res) => {

    try{
        Bookstwo.findOneAndDelete({ _id: req.body.delete_id }, function (err, docs) {
            console.log(docs)
        });

        const resp = setResponse(req.access)
    
        res.json({ 
            sts: resp.sts, 
            accessToken: resp.token, 
        })

    }catch(err){
        res.status(400).json({ message: err.message})
    }

    
   
})

router.post('/create', authenticateToken, async (req, res) => {
    console.log('Create URL authenticated')
   
    try {
        const insertData = new Bookstwo({
            author: req.body.author,
            title: req.body.title,
            desc: req.body.description,
          })

          console.log(insertData)
    
        try{
            const newBook = await insertData.save()
            // res.status(201).json(newBook)
            const resp = setResponse(req.access)
    
            res.json({ 
                sts: resp.sts, 
                accessToken: resp.token, 
            })

        }catch(err){
            res.status(400).json({ message: err.message})
        }
    
    } catch {
        res.status(500).send()
    }
})


router.post('/update', authenticateToken, async (req, res) => {
    console.log('Update books authenticated')
    // console.log(req.body.title)
    // // return
    console.log(req.body.author)
    const edit_id = req.body.id
    const author = req.body.author
    const title = req.body.title
    const desc = req.body.desc

    try {
        const filter = { _id: edit_id }
        const update = { 
            _id: edit_id,
            author: author,
            title: title,
            desc: desc
        }
        // Update existing
        await Bookstwo.findOneAndUpdate(filter, update, {new:true});

        const resp = setResponse(req.access)
    
        res.json({ 
            sts: resp.sts, 
            accessToken: resp.token, 
        })

    } catch {
        res.status(500).send()
    }
})

function setResponse(access){

    let sts = ''
    let newtoken = ''

    if(access.length > 20){
        sts = 'newtoken'
        newtoken = access
    }else if(access == 'redirect'){
        sts = 'redirect'
    }else{
        sts = 'valid'
    }

    let ret = {
        'sts': sts,
        'token': newtoken
    }

    return ret
}




function authenticateToken(req, res, next){
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if(token == null) return res.sendStatus(401)
    console.log('token: '+token)    
    // Using this to get ID for fetching the refresh token.
    const decAccessToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    
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