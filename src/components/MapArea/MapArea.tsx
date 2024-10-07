import React, { useEffect, useRef, useState, FC } from "react";
import AssetTrackerGenerator from "../../util/AssetTrackerGenerator";
import AssetData from "../../interface/AssetData";
import * as d3 from "d3";

const MapArea = (props: {}) => {
  const [assetDataArr, setAssetDataArray] = useState<AssetData[]>([
    {
      asset_id: "a_1",
      asset_desc: "Blood Type: A",
      asset_cat: "P",
      asset_loc: { x: 5, y: 5 },
      asset_qty: 10,
      asset_exp_date: "1/2/2025",
    },
    {
      asset_id: "a_2",
      asset_desc: "Company A Hospital Bed. Code: 1234",
      asset_cat: "F",
      asset_loc: { x: 3, y: 6 },
      asset_qty: 1,
      asset_exp_date: null,
    },
    {
      asset_id: "a_3",
      asset_desc: "Infusion Pumps",
      asset_cat: "M",
      asset_loc: { x: 10, y: 1 },
      asset_qty: 1,
      asset_exp_date: "1/2/2025",
    },
    {
      asset_id: "a_4",
      asset_desc: "Company B Wheelchair. Code: 5678",
      asset_cat: "F",
      asset_loc: { x: 6.7, y: 1 },
      asset_qty: 1,
      asset_exp_date: null,
    },
    {
      asset_id: "a_5",
      asset_desc: "MineW_1234",
      asset_cat: "G",
      asset_loc: { x: 4.7, y: 1 },
      asset_qty: 1,
      asset_exp_date: null,
    },
  ]);
  const svgMapRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgMapRef.current) return;
    // Creates the d3 map svg object by accessing the DOM object directly (with its ref)
    const svgMap = d3.select<SVGSVGElement, unknown>(svgMapRef.current);

    // Clears existing content in case of rerenders
    svgMap.selectAll("*").remove();

    // Set the viewBox to match the drawing area
    svgMap.attr("viewBox", `-100 -100 1460 883`);

    // Define points of the inner polygon (inner walls)
    const innerPolygonPoints = [
      [0, 0], // Point 1
      [1360, 0], // Point 2
      [1360, 683], // Point 3
      [112.4, 683], // Point 4
      [112.4, 435], // Point 5
      [0, 435], // Point 6
    ];

    // Define points of the outer polygon (outer walls)
    const outerPolygonPoints = [
      [-10, -10], // Point 1
      [1370, -10], // Point 2
      [1370, 693], // Point 3
      [102.4, 693], // Point 4
      [102.4, 445], // Point 5
      [-10, 445], // Point 6
    ];

    /* Create a path that draws the outer and inner polygons and uses the even-odd rule to fill between them */
    const pathData = d3.path();

    // Draw outer polygon (outer walls)
    pathData.moveTo(outerPolygonPoints[0][0], outerPolygonPoints[0][1]);
    outerPolygonPoints.forEach((point) => pathData.lineTo(point[0], point[1]));
    pathData.closePath();

    // Draw inner polygon (inner walls)
    pathData.moveTo(innerPolygonPoints[0][0], innerPolygonPoints[0][1]);
    innerPolygonPoints.forEach((point) => pathData.lineTo(point[0], point[1]));
    pathData.closePath();

    // Append the path to SVG and fill with color
    svgMap
      .append("path")
      .attr("d", pathData.toString())
      .attr("fill", "gray")
      .attr("stroke", "black")
      .attr("stroke-width", 4)
      .attr("fill-rule", "evenodd"); // Fill only the space between outer and inner polygons

    // --- Axes ---
    // Create scales for the x and y axes
    const xScale = d3.scaleLinear().domain([0, 13.6]).range([0, 1360]);
    const yScale = d3.scaleLinear().domain([0, 6.83]).range([0, 683]);

    // Add bottom axis
    svgMap
      .append("g")
      .attr("transform", `translate(0, 713)`) // Set the axis to be 30px away from the map
      .call(
        d3
          .axisBottom(xScale)
          .ticks(28)
          .tickSize(-743)
          .tickFormat((d) => d + " m")
      );

    // Add top axis
    svgMap
      .append("g")
      .attr("transform", `translate(0, -30)`) // Set the axis to be 30px away from the map
      .call(
        d3
          .axisTop(xScale)
          .ticks(28)
          .tickFormat((d) => d + " m")
      );

    // Add left axis
    svgMap
      .append("g")
      .attr("transform", `translate(-30, 0)`) // Set the axis to be 30px away from the map
      .call(
        d3
          .axisLeft(yScale)
          .ticks(14)
          .tickSize(-1420)
          .tickFormat((d) => d + " m")
      );

    // Add right axis
    svgMap
      .append("g")
      .attr("transform", `translate(1390, 0)`) // Set the axis to be 30px away from the map
      .call(
        d3
          .axisRight(yScale)
          .ticks(14)
          .tickFormat((d) => d + " m")
      );

    // Set the font size, font weight and colour for the ticks
    svgMap
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#696969")
      .style("cursor", "default");

    // --- Markers ---
    AssetTrackerGenerator({ assetDataArr, svgMap });

    svgMap.selectAll("svg") // or select a more specific element
  .on("mouseover", function () {
    console.log("Mouse over event triggered!");
  });
  }, [assetDataArr, svgMapRef]);

  return <svg ref={svgMapRef} width="100%" height="500px" />;
};

export default MapArea;
