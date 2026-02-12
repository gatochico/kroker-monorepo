import * as d3 from "d3";
import { borderColors } from "../../constants/constants";

export const legend = (svgRef) => {
  const leftpadding = 30;

  const circleradius = 10;

  const borderRadius = 12;
  const borderPadding = circleradius * 3;

  d3.selectAll("#legend").remove()
  
  const svg = d3
    .select(svgRef.current)
    .attr("height", "300px")
    .attr("width", "140px")
    .append("g")
    .attr("id", "legend")
    .attr("transform", "translate(0,17)");

  svg
    .append("text")
    .attr("x", leftpadding - circleradius)
    .attr("y", 0)
    .text("Legend")
    .style("font-size", "17px")
    .style("font-family", "Roboto")
    .style("font-weight", "bold")
    .style("text-decoration", "underline")

  Object.entries(borderColors).forEach(([bordertype, color], index) => {
    if (bordertype === "NoData") {
      svg
      .append("circle")
        .attr("cx", leftpadding)
        .attr("cy", borderPadding * (index + 1))
        .attr("r", borderRadius)
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", 5)
      svg
      .append("circle")
        .attr("cx", leftpadding)
        .attr("cy", borderPadding * (index + 1))
        .attr("r", borderRadius)
        .style("fill", "white")
        .style("stroke", color)
        .style("stroke-width", 4)
        svg
        .append("circle")
          .attr("cx", leftpadding)
          .attr("cy", borderPadding * (index + 1))
          .attr("r", borderRadius*0.9)
          .style("fill", "white")
          .style("stroke", "black")
          .style("stroke-width", 0.5)

    } else {
      svg
      .append("circle")
      .attr("cx", leftpadding)
      .attr("cy", borderPadding * (index + 1))
      .attr("r", borderRadius)
      .style("fill", "white")
      .style("stroke", color)
      .style("stroke-width", 4)
    }
    

      svg
        .append("text")
        .attr("x", leftpadding * 1.7 )
        .attr("y", borderPadding * (index + 1) + borderRadius * 0.5)
        .text(bordertype)
        .style("font-size", "15px")
        .style("font-family", "Roboto")
        .style("font-weight", "bold")
  });
};