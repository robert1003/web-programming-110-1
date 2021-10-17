# wp1101

**PLEASE HOST A WEB SERVER FOR TESTING, DO NOT DOUBLE-CLICK index.html**
A simple web server can be hosted with `python3 -m http.server`. Remember to host it in this project's folder.
If you find it annoying, you can use the link at the bottom for testing. Thanks for your cooperation.

## Design

* left side is album list. Currently there is two albums
* right side is pictures in that album
* right upper side is a picture preview section
* pictures will enlarge when hover over
* pictures can be set at the preview section by clicking them
    * when selected, a red border will appear around it
* picture in the preview section can be downloaded by clicking them
* support two screen size: phone mode and normal mode
* left-upper region has picture statistics, and button to add new picture (input url) or remove current selected picture
    * newly added picture will be at **THE TOP**
    * can try this image: https://i.imgur.com/zPldZnu.png
* picture will enlarge when hover
* list item (on the left) will change background color when hover
* Will have alert if clicked on empty album

## RWD design

Two modes
* phone mode (`min-width` < 800)
* normal mode (`min-width` >= 800)

To observe the difference, one can resize the window horizontally

## Note

This website is also deployed at [here](http://cl6.csie.org:17893/)
