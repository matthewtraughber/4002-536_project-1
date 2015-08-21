## Project 1: Interactive Form Elements
### RIT - 4002-536 Web Client Side Programming, Fall 2012

I've open-sourced my project 1 submission for future students to reference as an example. This application parses JSON and dynamically builds a form from the elements.

#### Project requirements
* Dynamically creating form elements depending upon the answer of the last question
  * The form elements for the questionnaire MUST be \<select\>\<option\> elements
* At least 2 choices for each selection
* At least a depth of 3 different questions (if you make yours so that it can create x number of dropdowns, then the depth can be 2 for some and 4 or 5 for others!)
* Topic is up to you - but you can use my "find-a-date" example below! (be creative!)
* Once the user has made their selections, (at least) create a new node to print out their final choices to the screen (Ex: You want a man with facial hair of slight build! That is minimal - do more to do better!)
* Give the user the option to start over at any time!
* A form on some page getting the users information (validation!)
* The use of Cookies & localStorage (possibly to hold the user information in the form?)
  * Yes - it says BOTH cookies and localStorage - your project must work in all browsers (remember that localStorage does NOT work in IE7)!
* I also want you to re-direct all browsers that this doesn't work on to another page, asking them to download a browser that would work! (see Final Note)
* Looks!!! (professional looking, quality graphics, etc.)

#### Programming requirements
* Dynamic creation of at least 3 sets of \<select\>\<option\>value... nodes (tags)
* Constructor method that creates the next select menu from the last choice
* Use of the following Commands (among many others):
  * createElement, setAttribute, appendChild, getElementByld, getElementsByTagName, createTextNode, nodeValue to name a few...
* Do NOT use visibility to show/hide the selections - I want them dynamically created!
* Some use of DHTML (menu system, sliding elements, etc. animation preferred!)
* No layout with tables! Everything done with CSS
* No use of innerHTML! (I might allow it for the practical, but not the projects)
* Include comments in the code to clearly explain functionality.
* Re-direction of non-modern and Mac IE browsers (yes, Mac IE will pass document.getElementByld), redirect the user to FireFox download page

#### DEMO
http://www.matthewtraughber.com/demo/4002-536_project-1/

#### License
Released under the [MIT license](http://opensource.org/licenses/MIT)
