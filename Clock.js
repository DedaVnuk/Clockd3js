const d3 = require("d3");

exports.Clock = function(params = {root_element_id: "clock"}) {

  this.root_element_id = params.root_element_id || "clock";

  this.root_element = d3.select(`#${this.root_element_id}`)
  this.width = parseInt(this.root_element.style("width"));
  this.height = parseInt(this.root_element.style("height"));
  this.radius = (this.width > this.height ? this.height / 2 : this.width / 2) - 5;

  this.center_point_radius = 7;

  this.show_main_circle = params.show_main_circle || false;

  this.clock = this.root_element.append("svg")
    .attr("width", this.width)
    .attr("height", this.height)

  this.digit_clock_as_text = false;


  const scaleDomain = (date, row_type) => {
    let start_of_time = new Date(date.getTime());
    let end_of_time = new Date(date.getTime());

    if(row_type === "second") {
      start_of_time.setSeconds(0);
      end_of_time.setSeconds(60);
    } else if(row_type === "minute") {
      start_of_time.setMinutes(0, 0);
      end_of_time.setMinutes(60, 0);
    } else if(row_type === "hour") {
      start_of_time.setHours(0, 0, 0);
      end_of_time.setHours(24, 0, 0);
    }

    return [start_of_time, end_of_time];
  }

  const scaleRange = row_type => {
    let multiplier = row_type === "hour" ? 4 : 2;

    return [0, multiplier * Math.PI];
  }

  /**
   * рисует стрелки на часах
   * @param {number} row_angle угол, на который будет отклонена стрелка
   * @param {string} row_type тип стрелки("hour", "minute", "second")
   * @return  {undefined}
   */
  const drawRow = (row_angle, row_type) => {
    this.clock.select(`path.${row_type}`).remove();

    const row_types = {
      hour: { outer_radius: this.radius / 2.3, stroke_width: "5px" },
      minute: { outer_radius: this.radius / 1.5, stroke_width: "3px" },
      second: { outer_radius: this.radius / 1.2, stroke_width: "1px" },
    }

    var row_path = d3.arc()
      .innerRadius(this.center_point_radius)
      .outerRadius(row_types[row_type].outer_radius)
      .startAngle(row_angle)
      .endAngle(row_angle)

    this.clock.append("path")
      .classed(`${row_type}`, true)
      .attr("d", row_path())
      .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`)
      .attr("stroke", row_type === "second" ? "red" : "black")
      .attr("stroke-width", row_types[row_type].stroke_width)

  }

  /**
   * @param {string} class_name
   * @param {number} radius
   * @return  {undefined}
   */
  const drawCircle = (class_name, radius) => {
    this.clock.append("circle")
      .classed(class_name, true)
      .attr("cx", this.width / 2)
      .attr("cy", this.height / 2)
      .attr("r", radius)
      .attr("stroke", "black")
      .attr("fill", "none")
  }

  /**
   * рисует линии, обозначающие часы, минуты, секунды (секундные совпадают с минутными)
   * @param {string} type
   * @return  {undefined}
   */
  const drawTicks = type => {
    const tick_params = {
      hour: {angle: 30, stroke_width: "3px"},
      minute: {angle: 6, stroke_width: "1px"},
    }

    var ticks = d3.arc()
      .outerRadius(this.radius)

    this.clock.selectAll(`${type}Tick`)
      .data(d3.range(0, 360, tick_params[type].angle)).enter()
      .append("path")
      .attr("d", (angle, angle_index) => {
        var inner_radius = this.radius;

        if(type === "hour") {
          // 12, 3, 6, 9 часов - линию делаем длиннее
          inner_radius -= angle_index % 3 === 0 ? 30 : 20;
        } else {
          inner_radius = this.radius - 10;
        }
        var angle_in_rad = Math.PI * angle / 180
        return ticks
          .innerRadius(inner_radius)
          .startAngle(angle_in_rad)
          .endAngle(angle_in_rad)()
      })
      .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`)
      .attr("stroke", "black")
      .attr("stroke-width", tick_params[type].stroke_width)
  }

  /**
   * покажет на часах цифровое отображение времени
   * @return  {Clock}
   */
  this.showDigitTime = () => {
    this.digit_clock_as_text = true;

    return this;
  }

  /**
   * добавляет текст в svg
   * @param {string} text
   * @param {string} link url строка (при нажатии на текст - откроется в новой вкладке)
   * @return  {Clock}
   */
  this.setText = (text, link = "") => {
    this.clock_text = text;
    this.clock_link = link;

    this.appendText(this.digit_clock_as_text);

    return this;
  }

  this.draw = () => {
    if(this.show_main_circle) {
      drawCircle("main-circle", this.radius);
    }
    drawCircle("center-circle", this.center_point_radius);

    ["hour", "minute"].map(time_type => drawTicks(time_type));

    var time = d3.timeFormat("%H:%M:%S")

    d3.interval(() => {
      var date = new Date()

      if(this.digit_clock_as_text) {
        this.setText(time(date), this.clock_link);
      }

      ["second", "minute", "hour"].forEach(row_type => {
        var scale = d3.scaleTime()
          .domain(scaleDomain(date, row_type))
          .range(scaleRange(row_type));

        drawRow(scale(date), row_type);
      })

    }, 1000)

  }


  /**
   * добавляет текст в svg
   * (используется при добавлении цифровых часов и текста с ссылкой)
   * @param {boolean} is_digit_clock
   * @return  {undefined}
   */
  this.appendText = is_digit_clock => {
    var class_name = is_digit_clock ? "digit-clock" : "clock-link";

    this.clock.select(`.${class_name}`).remove();

    this.clock.append("a")
      .classed(class_name, true)
      .attr("href", this.clock_link)
      .attr("target", "_blank")
      .attr("pointer-events", is_digit_clock || this.clock_link === "" ? "none" : "")
      .append("text")
      .attr("x", this.width / 2)
      .attr("y", is_digit_clock ? this.radius * 1.5 : this.radius / 1.5)
      .text(this.clock_text)
      .attr("text-anchor", "middle")
      .attr("cursor", "pointer")
  }

}
