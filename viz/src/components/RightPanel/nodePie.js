import * as d3 from "d3";
import { borderColors } from "../../constants/constants";

var DEFAULT_OPTIONS = {
    radius: 20,
    outerStrokeWidth: 10,
    showPieChartBorder: true,
    pieChartBorderColor: 'white',
    pieChartBorderWidth: '2',
    showLabelText: false,
    labelText: 'text',
    labelColor: 'groupA',
    padding: 0,
};

function getOptionOrDefault(key, options, defaultOptions) {
    defaultOptions = defaultOptions || DEFAULT_OPTIONS;
    if (options && key in options) {
        return options[key];
    }
    return defaultOptions[key];
}

function drawParentCircle(nodeElement, options) {
    return nodeElement.insert("g")
        .attr("id", "parent-pie")
}

function drawPieChartBorder(nodeElement, percentages, options) {
    const radius = getOptionOrDefault('radius', options);

    const isEmpty = percentages.length === 1 && percentages[0].color === 0;
    nodeElement.insert("circle")
    .attr("r", 1*radius)
    .attr("fill", "transparent")
    .attr("stroke", isEmpty ? "black" : "white");

    nodeElement.insert("circle")
        .attr("r", 0.7*radius)
        .attr("fill", "#979797")
        .attr("stroke", isEmpty ? "black" : "white");
}

function drawTreeRoot(nodeElement, options) {
    var radius = getOptionOrDefault('radius', options);
    nodeElement.insert("circle")
        .attr("r", 0.5*radius)
        .attr("fill", 'lightgray')
        .attr("opacity", 1);
}

function drawPieChart(nodeElement, percentages, options) {
    var radius = getOptionOrDefault('radius', options);

    const getAngles = d3.pie()
    .sort(null) // Pour trier
    .value(d => d.percent)

    const arcs = getAngles(percentages); // Define the size of the arcs
    const getArcs = d3.arc().innerRadius(0).outerRadius(radius)

    let pieces = nodeElement
    .selectAll("path")
    .data(arcs)
    .join("path")
    .attr("fill", d => d.data.color === 0 ? "white" : borderColors[d.data.color])
    .attr("d", getArcs);
}

function drawTitleText(nodeElement, options) {
    var radius = getOptionOrDefault('radius', options);
    var text = ["T", "M"].includes(getOptionOrDefault('labelText', options)) ? getOptionOrDefault('labelText', options) : "";

    nodeElement.append("text")
        .text(String(text))
        .attr("fill", 'white')
        .attr("dy", radius*0.2)
        .attr("dx", -radius*0.2);
}

function drawCover(nodeElement, options, percentages) {
    var radius = getOptionOrDefault('radius', options);
    nodeElement.append("circle")
        .attr("r", radius)
        .attr("fill", "transparent")
        .attr("class", "cover")
        .on("click", options.onPieClick)
        .on("mouseover", (e, d) => options.onMouseOver(e, d, percentages))
        .on("mousemove", options.onMouseMove)
        .on("mouseout", options.onMouseOut)
}

const showMenu = (event, d, options) => {
  event.preventDefault();
  if (options.openIcon) {
    if (d.data.type !== "T") {
      options.onClick(event, d);
      return;
    }
    const parent = d3.select("#svgcontainer").node()
    let bounds = parent.getBoundingClientRect();
    const menu = d3.select(".remove-menu-test")
        .style("top", (event.pageY - bounds.top) + "px")
        .style("left", (event.pageX - bounds.left) + "px")
        .style("display", "initial")

    d3.selectAll(".menu-item")
      .on("click", (e) => {
          const action = e.target.getAttribute("data-action")
          if ( action === "compress" ) options.onClick(event, d);
          if ( action === "remove" ) options.onRemove(event, d);
          
    menu.style("display", "none")
    })
    d3.select(".custom-menu-test")
    .style("display", "none")
    d3.select(".custom-menu")
    .style("display", "none")

    return;
  }

  const parent = d3.select("#svgcontainer").node()
  let bounds = parent.getBoundingClientRect();
  const menu = d3.select(d.data.type === "T" ? ".custom-menu-test" : ".custom-menu")
    .style("top", (event.pageY - bounds.top) + "px")
    .style("left", (event.pageX - bounds.left) + "px")
    .style("display", "initial")
 
  d3.selectAll(".menu-item")
    .on("click", (e) => {
      const action = e.target.getAttribute("data-action")
      if ( action === "one" ) options.onClick(event, d);
      if ( action === "all" ) options.onFullClick(event, d);
      if ( action === "remove" ) options.onRemove(event, d);
      
      menu.style("display", "none")
    })

    d3.select(".remove-menu-test")
    .style("display", "none")
};

function drawPlusButton(nodeElement, options) {
    var radius = getOptionOrDefault('radius', options) ;
    const fullContent = options.openIcon ? "-" : "+";

    // fullclick
    nodeElement.insert("circle")
        .attr("r", radius * 0.5)
        .attr("fill", '#c0c0c0')
        .attr("stroke", "white")
        .attr("opacity", 1)
        .attr("transform", `translate(${radius*0.8},${radius*0.8})`)
        .style("cursor", "pointer")
        .attr("class", "menuButton")
        .on("click", (event, d) => showMenu(event, d, options));
    nodeElement.insert("text")
        .text(String(fullContent))
        .attr("stroke", "white")
        .attr("fill", "white")
        .attr("transform", `translate(${radius*0.8},${radius*0.8})`)
        .attr("dy", radius*0.2)
        .attr("dx", -radius*0.17)
        .style("cursor", "pointer")
        .attr("class", "menuButton")
        .on("click", (event, d) => showMenu(event, d, options));
}
export const NodePieBuilder = {
    drawNodePie: function (nodeElement, percentages, options) {

        const parent = drawParentCircle(nodeElement, options);

        if (!percentages) {
            drawTreeRoot(parent, options);
            return
        }

        drawPieChart(parent, percentages, options);

        var showPieChartBorder = getOptionOrDefault('showPieChartBorder', options);
        if (showPieChartBorder) {
            drawPieChartBorder(parent, percentages, options);
        }

        var showLabelText = getOptionOrDefault('showLabelText', options);
        if (showLabelText) {
            drawTitleText(parent, options);
        }

        drawCover(nodeElement, options, percentages);

    },
    drawPlusButton,
};