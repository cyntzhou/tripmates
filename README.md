# Tripmates
Janice Lee
u
i
Cynthia Zhou
y

b
u
Nancy Luong
Sophia Kwon

## Installation
`npm i`

## Run locally
`npm run dev` runs both the server and client.

`npm run server` runs only the Express server app on your env's PORT, or port 3000.

`npm run client` runs only the React front-end app on port 8080.

When running both, `webpack.dev.config.js` specifies a proxy that redirects requests from `localhost:8080/api` to `localhost:3000/api`

## Test
`npm test`