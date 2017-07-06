# next.js-example-authentication-with-jwt

The very basic implemetation for auththentication with next.js, using Jsonwebtoken.
Basically, we use expressjs to customize the server a bit, by adding an authentication middleware,
it will check the `x-access-token` in every request. We also have a endpoint to generate jwt token for user, 
this token will be store in cookies. I find this way is very simple, straight forward, and work very well, 
especially in the time next.js
haven't had an official example for this.

# How to use

1. clone or download
2. `npm install`
3. `npm start`
