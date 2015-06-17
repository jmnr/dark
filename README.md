# Dark
## An image aggregator where unloved pictures darken over time.

##Why would I want to use this?

Because goths need their own instagram.

## What did you use to build it?

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
+ run ```node server.js``` in your terminal
+ point your browser to localhost:3000
