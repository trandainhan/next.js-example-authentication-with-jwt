# [Demo](https://nextjs-simple-authentication-with-jwt-dgjcfwbaax.now.sh)

# The idea behind
The very basic auththentication implemetation for next.js with Jsonwebtoken. Basically, we use expressjs to customize the server side, by adding an authentication middleware, this middleware will check the `x-access-token` in every request comming to server.
</br></br>
We also have a endpoint to generate jwt token and this token will be stored in cookies. I find this way is simple and work very well, especially in the time next.js haven't had an official example for this yet.

# How to use

1. Clone or download
2. `npm install`
3. `npm run build`
4. `npm start`
