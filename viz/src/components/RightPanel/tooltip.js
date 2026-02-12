
import * as d3 from "d3";
import './graphStyle.css';
import { backgroundColors, borderColors } from "../../constants/constants";

const tooltip = d3
          .select("body")
          .append("div") // the tooltip always "exists" as its own html div, even when not visible
          .style("position", "absolute") // the absolute position is necessary so that we can manually define its position later
          .style("visibility", "hidden") // hide it from default at the start so it only appears on hover
          .attr("class", "tooltip")
          .style("max-width", "300px")
          .style("padding", "10px")

const barchart = (data, {
  width = 280,
  height = 25,
  barHeight = 30,
  halfBarHeight = barHeight / 2,
  margin = {top: 0, right: 5, bottom: 10, left: 5},
} = {}) => {
  

  var sel = d3.select("#tipDiv")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // Have a total of values for reference from the data:
  const total = d3.sum(data, d => d.value);

   // Format the data (instead of using d3.stack()) and filter out 0 values:
  function groupDataFunc(data) {
    // use a scale to get percentage values
    const percent = d3.scaleLinear()
      .domain([0, total])
      .range([0, 100])
    // filter out data that has zero values
    // also get mapping for next placement
    // (save having to format data for d3 stack)
    let cumulative = 0
    const _data = data.map(d => {
      cumulative += d.value
      return {
        value: d.value,
        // want the cumulative to prior value (start of rect)
        cumulative: cumulative - d.value,
        label: d.label,
        percent: percent(d.value)
      }
    }).filter(d => d.value > 0)
    return _data
  }

  const groupData = groupDataFunc(data);

  // set up scales for horizontal placement
  const xScale = d3.scaleLinear()
    .domain([0, total])
    .range([0, width]);

  const join = sel.selectAll('g')
    .data(groupData)
    .join('g')

  // stack rect for each data value
  join.append('rect')
    .attr('class', 'rect-stacked')
    .attr('x', d => xScale(d.cumulative))
    .attr('y', height / 2 - halfBarHeight)
    .attr('height', barHeight)
    .attr('width', d => xScale(d.value))
    .style('fill', (d, i) => backgroundColors[d.label]);

  // add values on bar
  join.append('text')
    .attr('class', 'text-value')
    .attr('text-anchor', 'middle')
    .attr('x', d => xScale(d.cumulative) + (xScale(d.value) / 2))
    .attr('y', (height / 2) + 5)
    .text(d => d.value+"%");
}

export const tooltip_in = (event, d, percentages) => {
    const title = d.data.name.replace("<", "&lt;").replace(">", "&gt; ");
    const both = Math.round((percentages.find((e) => e.color === "Both")?.percent || 0) * 10) / 10;
    const groupA = Math.round((percentages.find((e) => e.color === "GroupA")?.percent || 0) * 10) / 10;
    const groupB = Math.round((percentages.find((e) => e.color === "GroupB")?.percent || 0) * 10) / 10;
    const noGroup = Math.round((percentages.find((e) => e.color === "None")?.percent || 0) * 10) / 10;

    if (percentages.length === 1 && !percentages[0].color) {
      tooltip
      .html(`
        <h3 class="titletext">${title}</h3>
        <p><span><b>File</b></span>: ${d.data.file}</p>
        <h3 class="titletext">Relative Line Coverage:</h3>
        <div><b>No data available for this method.</b></div>
        </div>`
      )
      .style("visibility", "visible")
    
      d3.selectAll(".titletext")
          .style("overflow", "hidden")
          .style("text-overflow", "ellipsis")
          .style("text-decoration", "underline")
      return;
    }
    tooltip
      .html(`
        <h3 class="titletext">${title}</h3>
        <p><span><b>File</b></span>: ${d.data.file}</p>
        <h3 class="titletext">Relative Line Coverage:</h3>
        <div id='tipDiv'></div>
        ${`<div class="squarespan"><div class="square both"></div><b>Both Groups Line Coverage:</b> <div>${both}%</div></div>`}
        ${`<div class="squarespan"><div class="square groupa"></div><b>Group A Line Coverage:</b> <div>${groupA}%</div></div>`}
        ${`<div class="squarespan"><div class="square groupb"></div><b>Group B Line Coverage:</b><div>${groupB}%</div></div>`}
        ${`<div class="squarespan"><div class="square none"></div><b>Not Covered:</b> <div>${noGroup}%</div></div>`}
        </div>`
      )
      .style("visibility", "visible")
    
      d3.selectAll(".titletext")
          .style("overflow", "hidden")
          .style("text-overflow", "ellipsis")
          .style("text-decoration", "underline")
      
      d3.select('.none')
        .style("background-color", borderColors.None)
      d3.select('.groupa')
        .style("background-color", borderColors.GroupA)
      d3.select('.groupb')
        .style("background-color", borderColors.GroupB)
      d3.select('.both')
        .style("background-color", borderColors.Both)

    barchart([
        { label: 'None', value: noGroup },
        { label: 'GroupA', value: groupA },
        { label: 'GroupB', value: groupB },
        { label: 'Both', value: both },
    ]);
  };

export const tooltip_move = (event,d) => {
  tooltip
    .style("left", (event.pageX) + "px")
    .style("top", (event.pageY) + "px");
}

export const tooltip_out = () => {
    return tooltip
      .style("visibility", "hidden");
  };