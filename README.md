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
Writing more tests (in all test suites) to test situations in which we should expect errors (not logged in, etc).

Currently activity details (during create and edit) do not include places' open hours. Will implement this (in the UI) during the next milestone. An activity's place is not displayed when expending the activity view in a trip.

The calendar in Itinerary currently allows any dates when creating Events, when we should restrict dates to within the trip's dates. Only month view in Calendar works. Will restrict dates, and support week / day / agenda view in the next milestone.

Leading to trips page if a trip is deleted (currently sometimes stays on trip page).

Change editing an activity's place, possibly allow for removing a place from activity.

## Notes for Milestone 2: MVP

The app supports joining a trip through sharing a code with another user. Users can now collaborate on editing their trip, creating, editing, and deleting activities, events, and itineraries of their trips. As one user deleting an item like a trip or activity can affect another user trying to edit an activity of the trip, we handle concurrency by alerting the user when they try to perform an action, but the item doesn't exist anymore. In addition, the user is prevented from creating an event during times when the place associated with that event is closed. Also featured is drag and drop on the calendar for creating events and a map that displays activities. 

Things that aren't quite done yet:

CSRF mitigation hasn't been implemented. 
We don't yet support checking the open hours of an event that goes past midnight or spans multiple days. 
Edit activity open hours isn't properly storing the hours on save. 

## Deployed app
http://juicy-buns-tripmates.herokuapp.com/
We haven't successfully deployed to Heroku yet.

## Authorship of files:
Sophia Kwon: All files in models, routes, and test, relating to events, itineraries, and trips

Nancy Luong: All files in `src/Frontend/activity`, `src/Frontend/trip` and contributed to some of the components found in `src/Frontend/components`

Cynthia Zhou: All files in `src/Frontend/itinerary`, `src/Frontend/user`, and some of `src/Frontend/components`

Janice Lee: All files in models, routes, and test, relating to users, activities, places, open hours

## Installation
`npm i`

## Run locally
Copy `.env_template` to a file named `.env` in the base repo. Fill in database configurations.

`npm run dev` runs both the server and client. Head to `localhost:8080`

`npm run server` runs only the Express server app on your env's PORT, or port 3000.

`npm run client` runs only the React front-end app on port 8080.

When running both, `webpack.dev.config.js` specifies a proxy that redirects requests from `localhost:8080/api` to `localhost:3000/api`

## Test
`npm test`

