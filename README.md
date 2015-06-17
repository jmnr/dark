# Dark
## An image aggregator where unloved pictures darken over time.

##Why would I want to use this?

Because goths need their own instagram.

## What did we use to build it?

We are using the following node plugins:
+ amazon s3 as the database for all the images
+ redis as a database for metadata for the images
+ leveldb as a database for analytics information
+ node to connect everything
+ hapi on top of node to make everything easier to plug together (for a full list of ll the plugins used refer to the package.json file)

##How do I get it running?

We plan to get version on heroku but till then:

+ Make sure you have [node](https://nodejs.org/) installed on your system
+ Clone this repo
+ run ```npm install``` in your terminal
+ run our tests using `npm test`
+ run ```node server.js``` in your terminal
+ insert your own clientID and clientSecret in server.js to set up the 3rd party authentication using Github
+ point your browser to localhost:3000

##Features

* [x] 3rd Party Authentication using Github (also maybe google)
* [x] Enable User sessions using hapi-auth-cookie
* [x] Upload photos to Amazon s3
* [x] Store meta data in redis
* [ ] Store users photos so they can be read if the user revisits the site
* [ ] Read photos from Amazon on loading the home page
* [ ] Read user's photos on loading the profile page
* [ ] Socket.io integration

##Stretch Goals

* [ ] Opacity of stored images increases with time on the website
* [ ] Approval ('liking') by other users can increase opacity
