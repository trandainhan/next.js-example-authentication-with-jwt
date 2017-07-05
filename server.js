import express from 'express'
import next from 'next'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // Request body parsing middleware should be above methodOverride
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }));

  server.use(cookieParser())

  server.use('/', (req, res, next) => {
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
  })

  server.use('/authenticate', (req, res) => {
    const { username, password } = req.body
    if (username === 'test', || password === 'test') {
      var token = jwt.sign({
        username: username,
        password: password
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

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
