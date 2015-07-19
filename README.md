# Dark

[![Code Climate](https://codeclimate.com/github/jmnr/dark/badges/gpa.svg)](https://codeclimate.com/github/jmnr/dark)
[![Test Coverage](https://codeclimate.com/github/jmnr/dark/badges/coverage.svg)](https://codeclimate.com/github/jmnr/dark/coverage)
[![Dependency Status](https://david-dm.org/jmnr/dark.svg)](https://david-dm.org/jmnr/dark)
[![devDependency Status](https://david-dm.org/jmnr/dark/dev-status.svg)](https://david-dm.org/jmnr/dark#info=devDependencies)

## What is Dark?

Dark is instagram reimagined: an image aggregator where unloved pictures darken over time. If your photos go unloved, they'll just fade away. It's the existential solution to all your image-posting needs.

## What did we use to build it?

We are using the following node plugins:

* amazon web services as the database for the images
* redis as database for metadata for the images
* node to connect everything
* hapi on top of node to make everything easier to plug together (for a full list of plugins used, refer to the package.json file)

##How do you get it running?

Dark is currently live on Heroku. You can find it [here](darkapp.herokuapp.com). If you wish to run the project yourself, follow these steps.

**Step One**  
Make sure you have [node](https://nodejs.org/) installed on your system

**Step Two**  
Clone this repo ```git clone https://github.com/jmnr/dark.git```

**Step Three**  
Run ```npm install``` in your terminal

**Step Four**  
Run our tests using ```npm test```

**Step Five**  
Run ```node server.js``` in your terminal

**Step Six**  
Insert your own clientID and clientSecret in server.js to set up the 3rd party authentication using Github

**Step Seven**  
Point your browser to localhost:8000

##Goals

* [x] 3rd Party Authentication using Github (also maybe google)
* [x] Enable User sessions using hapi-auth-cookie
* [x] Upload photos to Amazon s3
* [x] Store metadata in redis
* [x] Store users photos so they can be read if the user revisits the site
* [x] Read photos from Amazon on loading the home page
* [x] Email notifications with Mandrill when user logs in
* [ ] Read user's photos on loading the profile page
* [ ] Socket.io integration
* [ ] Opacity of stored images increases with time on the website