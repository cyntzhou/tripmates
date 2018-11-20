# Tripmates: JuiCy buNS
Janice Lee
Cynthia Zhou
Nancy Luong
Sophia Kwon

## Description
Tripmates is an online tool to collaboratively plan trips with other people. It provides an organized way for everyone involved in a trip to list activities they’re interested in, as well as an interface to collaboratively construct an itinerary for the trip.

## Notes for Milestone 1: Proof of Concept
Things that aren't quite done yet:
A couple additional checks on details to raise errors in the events api (if someone tries to create an event with an activity that's not in the trip, or with a time range that doesn't fall within the trip dates).
Writing more tests to test situations in which we should expect errors (not logged in, etc).

Currently activity details (during create and edit) do not include places' open hours. Will implement this (in the UI) during the next milestone. An activity's place is not displayed when expending the activity view in a trip.

## Deployed app
TODO: link here

## Authorship of files:
Sophia Kwon: All files in models, routes, and test, relating to events, itineraries, and trips
Nancy Luong: All files in `src/Frontend/activity`, `src/Frontend/trip` and contributed to some of the components found in `src/Frontend/components`.

## Installation
`npm i`

## Run locally
`npm run dev` runs both the server and client.

`npm run server` runs only the Express server app on your env's PORT, or port 3000.

`npm run client` runs only the React front-end app on port 8080.

When running both, `webpack.dev.config.js` specifies a proxy that redirects requests from `localhost:8080/api` to `localhost:3000/api`

## Test
`npm test`

