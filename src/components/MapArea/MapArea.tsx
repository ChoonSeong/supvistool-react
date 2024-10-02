import React, { useEffect, useRef, FC } from "react";
import { Coordinates } from "../../interface/Markers";
import * as d3 from "d3";

interface MapAreaInterface {
  width: number;
  height: number;
  gridSize: number;
  markers: Coordinates[];
}

const MapArea: FC<MapAreaInterface> = ({
  width,
  height,
  gridSize,
  markers,
}) => {
  const svgMapRef = useRef(null);

  useEffect(() => {
    // Creates the d3 map svg object by accessing the DOM object directly (with its ref)
    const svgMap = d3.select(svgMapRef.current);

    // Clears existing content in case of rerenders
    svgMap.selectAll("*").remove();

    // Set the viewBox to match the drawing area
    svgMap.attr("viewBox", `-100 -100 1560 883`);

    // Define points of the L-shaped polygon (update these to match the required L shape)
    const polygonPoints = [
      [0, 0], // Point 1
      [1360, 0], // Point 2
      [1360, 683], // Point 3
      [112.4, 683], // Point 4
      [112.4, 435], // Point 5
      [0, 435], // Point 6
    ];

    // Draw the L-shaped polygon using the points
    svgMap
      .append("polygon")
      .attr("points", polygonPoints.map((d) => d.join(",")).join(" ")) // Join points into a string
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 4);

    // --- Axes ---
    // Create scales for the x and y axes
    const xScale = d3.scaleLinear().domain([0, 1360]).range([0, 1360]);
    const yScale = d3.scaleLinear().domain([0, 683]).range([0, 683]);

    // Add bottom axis
    svgMap
      .append("g")
      .attr("transform", `translate(0, 713)`)
      .call(d3.axisBottom(xScale).tickSize(-743).tickFormat(d => d + " cm"));

    // Add top axis
    svgMap
      .append("g")
      .attr("transform", `translate(0, -30)`)
      .call(d3.axisTop(xScale).tickFormat(d => d + " cm"));

    // Add left axis
    svgMap
      .append("g")
      .attr("transform", `translate(-30, 0)`)
      .call(d3.axisLeft(yScale).tickSize(-1420).tickFormat(d => d + " cm"));

    // Add right axis
    svgMap
      .append("g")
      .attr("transform", `translate(1390, 0)`)
      .call(d3.axisRight(yScale).tickFormat(d => d + " cm"));

    // Set the font size for the ticks
    svgMap
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#696969");
  }, [width, height]);

  return (
    <svg
      ref={svgMapRef}
      width="100%"
      height="500px"
    />
  );
};

export default MapArea;
