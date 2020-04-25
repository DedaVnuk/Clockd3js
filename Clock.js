const d3 = require("d3");

exports.Clock = function(params = {root_element_id: "clock"}) {

  const _root_element_id = params.root_element_id || "clock";

  const _root_element = d3.select(`#${_root_element_id}`)
  let _width = parseInt(_root_element.style("width")) || 200;
  let _height = parseInt(_root_element.style("height")) || 200;
  let _radius = (_width > _height ? _height / 2 : _width / 2) - 5;

  let _center_point_radius = 7;

  let _show_main_circle = params.show_main_circle || false;

  const _clock = _root_element.append("svg")
	  .attr("id", "clock-d3js")
    .attr("width", _width)
    .attr("height", _height)
	  .append("g")

  let _digit_clock_as_text = false;


  const time = d3.timeFormat(params.time_format || "%H:%M:%S")

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
   * @return  {void}
   */
  const drawRow = (row_angle, row_type) => {
    _clock.select(`path.${row_type}`).remove();

    const row_types = {
      hour: { outer_radius: _radius / 2.3, stroke_width: "5px" },
      minute: { outer_radius: _radius / 1.5, stroke_width: "3px" },
      second: { outer_radius: _radius / 1.2, stroke_width: "1px" },
    }

    const row_path = d3.arc()
      .innerRadius(_center_point_radius)
      .outerRadius(row_types[row_type].outer_radius)
      .startAngle(row_angle)
      .endAngle(row_angle)

    _clock.append("path")
      .classed(`${row_type}`, true)
      .attr("d", row_path())
      .attr("transform", `translate(${_width / 2}, ${_height / 2})`)
      .attr("stroke", row_type === "second" ? "red" : "black")
      .attr("stroke-width", row_types[row_type].stroke_width)

  }

  /**
	 * добавляет круг в svg
   * @param {string} class_name
   * @param {number} radius
   * @return  {void}
   */
  const drawCircle = (class_name, radius) => {
    _clock.append("circle")
      .classed(class_name, true)
      .attr("cx", _width / 2)
      .attr("cy", _height / 2)
      .attr("r", radius)
      .attr("stroke", "black")
      .attr("fill", "none")
  }

  /**
   * рисует линии, обозначающие часы, минуты, секунды (секундные совпадают с минутными)
   * @param {string} type
   * @return  {void}
   */
  const drawTicks = type => {
    const tick_params = {
      hour: {angle: 30, stroke_width: "3px"},
      minute: {angle: 6, stroke_width: "1px"},
    }

    const ticks = d3.arc()
      .outerRadius(_radius)

    _clock.selectAll(`${type}Tick`)
      .data(d3.range(0, 360, tick_params[type].angle)).enter()
      .append("path")
      .attr("d", (angle, angle_index) => {
        let inner_radius = _radius;

        if(type === "hour") {
          // 12, 3, 6, 9 часов - линию делаем длиннее
          inner_radius -= angle_index % 3 === 0 ? 30 : 20;
        } else {
          inner_radius = _radius - 10;
        }

        let angle_in_rad = Math.PI * angle / 180

        return ticks
          .innerRadius(inner_radius)
          .startAngle(angle_in_rad)
          .endAngle(angle_in_rad)()
      })
      .attr("transform", `translate(${_width / 2}, ${_height / 2})`)
      .attr("stroke", "black")
      .attr("stroke-width", tick_params[type].stroke_width)
  }

  /**
   * добавляет текст в svg
   * (используется при добавлении цифровых часов и текста с ссылкой)
   * @param {string} text - текст, который будет добавлен на часы
	 * @param {string} link - ссылка(href), для текста
	 * @param {string} link_class - название класса добавляемого текста
   * @return  {void}
   */
  const appendText = (text, link = "", link_class = "digit-clock") => {

    _clock.select(`.${link_class}`).remove();

    _clock.append("a")
      .classed(link_class, true)
      .attr("href", link)
      .attr("target", "_blank")
      .attr("pointer-events", link === "" ? "none" : "")
      .append("text")
      .attr("x", _width / 2)
      .attr("y", link_class === "digit-clock" ? _radius * 1.5 : _radius / 1.5)
      .text(text)
      .attr("text-anchor", "middle")
      .attr("cursor", "pointer")
  }

	/**
   * покажет на часах цифровое отображение времени
   * @return  {Clock}
   */
  this.showDigitTime = () => {
    _digit_clock_as_text = true;

    return this;
  }

  /**
   * добавляет текст в svg
   * @param {string} text
   * @param {string} link url строка (при нажатии на текст - откроется в новой вкладке)
   * @return  {Clock}
   */
  this.setText = (text, link = "") => {
    appendText(text, link, "clock-link");

    return this;
  }

	/**
	 * отрисовывает часы
	 * @return {void}
	 */
  this.draw = () => {
    if(_show_main_circle) {
      drawCircle("main-circle", _radius);
    }
    drawCircle("center-circle", _center_point_radius);

    ["hour", "minute"].map(time_type => drawTicks(time_type));

    d3.interval(() => {
      let date = new Date()

      if(_digit_clock_as_text) {
				appendText(time(date));
      }

      ["second", "minute", "hour"].forEach(row_type => {
        const scale = d3.scaleTime()
          .domain(scaleDomain(date, row_type))
          .range(scaleRange(row_type));

        drawRow(scale(date), row_type);
      })

    }, 1000)

  }

}
