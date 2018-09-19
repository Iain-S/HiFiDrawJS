# HiFi Draw JS
I noticed that there were no simple websites that allow you to draw a diagram of your hifi.  I field a lot of questions about how best to wire together different components like PCs, amplifiers, speakers, mixers, sub-woofers, etc.  Wouldn't it be nice if people could go to a site, click a couple of buttons and end up with a diagram to share online or with friends?  Well, this is my first attempt at such a site.  It uses JavaScript because it is something I have been meaning to learn.  As I have no prior experience with the language, don't expect the code to be too clever.

## Getting started
Very little is needed.  Everything to render the main page is straight JavaScript, CSS and html.  You should be able to clone the repo and run a webserver from the root directory.  For example, with 
    
    python3 -m http.server 8009

Then open a browser and navigate to 

    localhost:8009

## Testing
The functional tests are written in python and use selenium.  Install Pipenv, use it to install the dependencies and then run

    cd pyth && python3 functional_tests.py

I would like to speed them up but they work fine.

For the unit tests, I flirted with jest and some other popular unit testing frameworks.  However, these all require Node.  There's nothing wrong with that but I wanted to keep things as simple as possible.  Unit tests are straightforward JavaScript functions, which print success or fail messages to the console when you open

    localhost:8009/unit_tests.html

I'm sure this system could be improved upon, but it works fine for me.

## Coding style
I love Python's PEP8.  I dislike the lack of a widely used JavaScript standard.  I try to be consistent with naming conventions but don't always succeed.  I use the Notepad++ JSLint plugin when working on Windows.  When working on Linux, I let PyCharm correct my JavaScript and Python.  I check html using [this w3 validator](https://validator.w3.org/nu/#textarea).

## Versioning
Use [SemVer](http://semver.org/) for versioning.

## Built With
* [vis.js](http://visjs.org) - see below
* jQuery
* [PaperCSS](https://www.getpapercss.com)

Vis JS is a visualization library that does a good job of rendering graphs.  The wiring of a hifi can reasonably be approximated by a directed graph where each component (CD player, amplifier, speaker, etc.) is a node and each connection (RCA, XLR, bluetooth, etc.) an edge.

## Licence

This project is licensed under the GNU GPLv3 - see the [LICENCE.md](https://github.com/Iain-S/HiFiDrawJS/blob/master/LICENCE.txt) file for details.
 
