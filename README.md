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
  show_hour: false,
  dark_mode: true,
  times: [
    {start: "07:20", end: "07:45", name: "Breakfast", color: "blue"},
    {start: "13:00", end: "14:00", name: "Dinner", color: "lightgreen", opacity: 1},
    {start: "20:00", end: "21:30", name: "Sport", width: 50}
  ]
});
// or
const clock = new Clock({
  hours: [12,,, 3,,, 6,,, 9] // or ["XII",,, "III",,, "VI",,, "IX"]
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
hours|Array|hours display array|[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
time_format|String|format of digital time ([d3 formats](https://github.com/d3/d3-time-format/tree/v2.2.3#locale_format))|%H:%M:%S
times|Array|time intervals to show on clock|[ ]
dark_mode|Boolean|clock dark mode|false

**Methods**

Name|Description|Params|Return
----|-----------|------|------
showDigitTime|will show the digital time on the clock||Clock
setText|set text above the center point of the clock|text: String, link: String|Clock
draw|appends Clock on the page||void
