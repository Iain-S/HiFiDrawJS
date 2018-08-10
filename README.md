# HiFi Draw JS
I noticed that there were no simple websites that allow you to draw a diagram of your hifi.  I field a lot of questions about how best to wire together different components like PCs, amplifiers, speakers, mixers, sub-woofers, etc.  Wouldn't it be nice if people could go to a site, click a couple of buttons and end up with a diagram to share online or with friends?  Well, this is my first attempt at such a site.  It uses JavaScript because it is something I have been meaning to learn.  As I have no prior experience with the language, don't expect the code to be too clever.

## Getting started
Very little is needed.  Everything to render the main page is straight JavaScript, CSS and html.  You should be able to clone the repo and run a webserver from the root directory.  For example, with 
    
    python3 -m http.server 8009

Then open a browser and navigate to 

    localhost:8009

## Testing
The functional tests are written in python and use selenium

    cd pyth && python3 functional_tests.py

I would like to speed them up but otherwise they work fine.

For the unit tests, I flirted with jest and some other popular unit testing frameworks.  However, these all require Node.  There's nothing wrong with that but I wanted to keep things as simple as possible.  I found that learning about Node, browserify, webpack, Jasmine, Mocha, etc. etc. was detracting from the task of actual coding.  In the end, I've gone with an extremely simple one-page, one-script unit testing system.  Unit tests are straightforward JavaScript functions, which print success or fail messages to the console when you open

    localhost:8009/unit_tests.html

I'm sure this system could be improved upon, but it works fine for me.

## Coding style
I have come to love Python's PEP8.  I dislike the lack of a widely used JavaScript standard.  I try to be consistent but often fail when it comes to naming conventions.  I use the Notepad++ JSLint plugin when working on Windows.  When working on Linux, I let PyCharm correct my JavaScript and Python.  I check html using [this w3 validator](https://validator.w3.org/nu/#textarea).

## Versioning
Use [SemVer](http://semver.org/) for versioning.

## Built With
* [flowchart.js](https://github.com/adrai/flowchart.js) - see below
* jQuery
* Bootstrap

It may seem odd to use a flowchart library for this, but I wanted something quick and nice-looking.  Flowchart.js it built on top of [Raphaël](http://dmitrybaranovskiy.github.io/raphael/), which I may switch to use directly at some point.

## Licence

This project is licensed under the GNU GPLv3 - see the [LICENCE.md](https://github.com/Iain-S/HiFiDrawJS/blob/master/LICENCE.txt) file for details.
 
