import express from 'express'
import next from 'next'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // Request body parsing middleware should be above methodOverride
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }));

  server.use(cookieParser())

  // Verify username and password, if passed, we return jwt token for client
  // We also include xsrfToken for client, which will be used to prevent CSRF attack
  server.post('/authenticate', (req, res) => {
    const { username, password } = req.body
    if (username === 'test' || password === 'test') {
      var token = jwt.sign({
        username: username,
        password: password,
        xsrfToken: crypto.createHash('md5').update(username).digest('hex')
      }, 'jwtSecret', {
        expiresIn: 60*60
      });
      res.status(200).json({
        success: true,
        message: 'Enjoy your token',
        token: token
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Authentication failed'
      })
    }
  })

  // Authenticate middleware
  server.use(unless(['/login', '/_next'], (req, res, next) => {
    const token = req.cookies['x-access-token'];
    if (token) {
      jwt.verify(token, 'jwtSecret', (err, decoded) => {
        if (err) {
          res.redirect('/login');
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      })
    } else {
      res.redirect('/login');
    }
  }))

  // Api example to prevent CRSF attack
  server.post('/api/preventCRSF', (req, res, next) => {
    if (req.decoded.xsrfToken === req.get('X-XSRF-TOKEN')) {
      res.status(200).json({
        success: true,
        message: 'Yes, this api is protected by CRSF attack'
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'CRSF attack is useless'
      })
    }
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})

function unless (paths, middleware) {
    return function(req, res, next) {
        let isHave = false
        paths.forEach((path) => {
          if (path === req.path || req.path.includes(path)) {
            isHave = true
            return
          }
        })
        if (isHave) {
          return next()
        } else {
            return middleware(req, res, next)
        }
    }
}
