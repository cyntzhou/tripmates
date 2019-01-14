# Tripmates: Collaborative Trip Planner by JuiCy buNS
Janice Lee  
Cynthia Zhou  
Nancy Luong  
Sophia Kwon

## Description
Tripmates is an online tool to collaboratively plan trips with a group of people. It provides an organized way for everyone involved in a trip to list activities they’re interested in, as well as an interface to collaboratively construct an itinerary for the trip.

## Features:
* Create trips
* Join existing trips with unique 6-digit join code
* Add ideas for activities
* Add and contribute to itineraries (drag and drop activities onto calendar in week view to quickly create an event)
* Toggle "show/hide map" button to display map with pins in locations of activities
* Input open hours of a location to automatically ensure that any itinerary events that take place there don't happen while it is closed
* See helpful error messages if any conflicts arise due to concurrent editing, user error, etc.
* Upvote or downvote activities to share your interests with your tripmates, and hover to see who up/downvoted each activity
* Search for activities by name, or filter activities list by category, number of votes, recently added, etc.
* Usable, appealing interface

## Deployed app

Version 1: 
http://juicy-buns-tripmates.herokuapp.com/ 
This version reloads all components of a trip's page once every 5 seconds, to reflect other users' edits. This may be a bit difficult to use to actively edit a trip because the create event modals, etc. also go back to their default values every 5 seconds. This version is best for seeing other users' edits in pseudo real time.

Version 2: 
https://juicy-tripmates.herokuapp.com/ 
This version does not reload the components every 5 seconds. Therefore, you don't see other users' edits until you make an edit yourself, at which point your page fetches all the components again. This version is best for actively making edits, since the information you see is as up to date as the last time you made an edit.

Note that both these versions are connected to the same database, so you can access your account and trips at either of these links. We are currently working on adding WebSockets to Tripmates, to allow users to see other users' edits in real time and eliminate the need for the two different versions of the site.

## Authorship of files:
Sophia Kwon: All files in models, routes, and test, relating to events, itineraries, and trips

Nancy Luong: All files in `src/Frontend/activity`, `src/Frontend/trip` and contributed to some of the components found in `src/Frontend/components`

Cynthia Zhou: All files in `src/Frontend/itinerary`, `src/Frontend/user`, and some of `src/Frontend/components`

Janice Lee: All files in models, routes, and test, relating to users, activities, places, open hours

## Installation
`npm i` in base repo, and `npm i` in `client` repo.

## Run locally
Copy `.env_template` to a file named `.env` in the base repo. Fill in database configurations.

In the base repo, run `npm start` to start the server.

Then, `cd client` and `npm start` to start the client. 

Head to `localhost:3000`.

## Test
`npm test`

