const express = require('express')
const fs = require('fs')
const https = require('https')

const port  = 3000 ;

const opts = { key: fs.readFileSync('server_key.pem'),
               cert: fs.readFileSync('server_cert.pem'),
               requestCert: true,
               rejectUnauthorized: false,
               ca: [ fs.readFileSync('server_cert.pem') ]
}


const app = express()

app.get('/', (req, res) => {
	res.send('<a href="authenticate"> Time to log in </a>')
})

app.get('/authenticate', (req, res) => {
	const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
		res.send(`Hello Securely Logged In`)
    } else if (cert.subject) {
		res.status(403)
		   .send(`Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`)
        } else {
            res.status(401)
               .send(`Sorry, but you need to provide a client certificate to continue.`)
        }
    })



    // https.createServer(opts, app).listen(port)
    
    https.createServer(opts,app).listen(port,() =>{
      console.log("Server running on port ",port);
    })
    
    // app.listen(port,()=>{
    //   console.log("Running on port ",port) ;
    // })