# Clockd3js
Clock writen with d3js


**Installing clock from npm**

`npm i clockd3js`

**Usage**

```
import {Clock} from "clockd3js"
...

const clock = new Clock();
// or
const clock = new Clock({
  parent_id: "custom-clock",
  show_main_circle: false,
  show_hour: false
});
// or
const clock = new Clock({
  hours: [12, 3, 6, 9]
});

clock.draw();
// or
clock
  .showDigitTime()
  .setText("It's your time!", "https://your-own-site")
  .draw();

```

**Constructor params**
Name|Type|Description|Default
----|----|-----------|-------
parent_id|String|parent div id|clock
show_main_circle|Boolean|determines whether to show a clock circle|false
show_hours|Boolean|determines whether to show hours|false
hours|Array|hours display array|[ ]

**Methods**

Name|Description|Params|Return
----|-----------|------|------
showDigitTime|will show the digital time on the clock||Clock
setText|set text above the center point of the clock|text: String, link: String|Clock
draw|appends Clock on the page||void
