# Clockd3js
Clock writen with d3js


**Installing clock from npm**

`npm i clockd3js`

**Usage**

```
import {Clock} from "clockd3js"
...

const clock = new Clock();

clock.draw();
// or
clock
  .showDigitTime()
  .setText("It's your time!", "https://your-own-site")

```


**Methods**

Name|Description|Params|Return
----|-----------|------|------
showDigitTime|will show the digital time on the clock||Clock
setText|set text above the center point of the clock|text: String, link: String|Clock
draw|appends Clock on the page||void
