import React, { useEffect, useRef, useState } from "react";
import AssetTrackerGenerator from "../../util/AssetTrackerGenerator";
import * as d3 from "d3";

const MapArea = () => {
  const [assetDataArr, setAssetDataArray] = useState([]);
  const svgMapRef = useRef(null);

  const gatewayPositions = {
    ac233ffb3adc: [5.264, 0],
    ac233fc17756: [3.15, 6.83],
    ac233ffb3adb: [13.6, 0],
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/data");
      const data = await response.json();

      // Transform the fetched data to match the asset data structure
      const newAssetDataArr = Object.keys(data).map((tagId) => ({
        asset_id: tagId,
        asset_desc: "Description",
        asset_cat: "P",
        asset_loc: {
          x: data[tagId].position.x,
          y: data[tagId].position.y,
        },
        asset_qty: 1,
        asset_exp_date: null,
      }));

      // Add fixed gateway positions to the asset data array
      const fixedGateways = Object.keys(gatewayPositions).map((tagId) => ({
        asset_id: tagId,
        asset_desc: "Fixed Gateway",
        asset_cat: "G",
        asset_loc: {
          x: gatewayPositions[tagId][0],
          y: gatewayPositions[tagId][1],
        },
        asset_qty: 1,
        asset_exp_date: null,
      }));

      const combinedAssetDataArr = [...newAssetDataArr, ...fixedGateways];

      // Update state with the new data
      setAssetDataArray(combinedAssetDataArr);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Use D3 to render the map
  useEffect(() => {
    if (!svgMapRef.current) return;
    const svgMap = d3.select(svgMapRef.current);

    // Clears existing content in case of rerenders
    svgMap.selectAll("*").remove();

    svgMap.attr("viewBox", `-100 -100 1460 883`);

    const innerPolygonPoints = [
      [0, 0],
      [1360, 0],
      [1360, 683],
      [112.4, 683],
      [112.4, 435],
      [0, 435],
    ];

    const outerPolygonPoints = [
      [-10, -10],
      [1370, -10],
      [1370, 693],
      [102.4, 693],
      [102.4, 445],
      [-10, 445],
    ];

    const pathData = d3.path();
    pathData.moveTo(outerPolygonPoints[0][0], outerPolygonPoints[0][1]);
    outerPolygonPoints.forEach((point) => pathData.lineTo(point[0], point[1]));
    pathData.closePath();

    pathData.moveTo(innerPolygonPoints[0][0], innerPolygonPoints[0][1]);
    innerPolygonPoints.forEach((point) => pathData.lineTo(point[0], point[1]));
    pathData.closePath();

    svgMap
      .append("path")
      .attr("d", pathData.toString())
      .attr("fill", "gray")
      .attr("stroke", "black")
      .attr("stroke-width", 4)
      .attr("fill-rule", "evenodd");

    const xScale = d3.scaleLinear().domain([0, 13.6]).range([0, 1360]);
    const yScale = d3.scaleLinear().domain([0, 6.83]).range([683, 0]);

    svgMap
      .append("g")
      .attr("transform", `translate(0, 713)`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(28)
          .tickSize(-743)
          .tickFormat((d) => d + " m")
      );

    svgMap
      .append("g")
      .attr("transform", `translate(0, -30)`)
      .call(
        d3
          .axisTop(xScale)
          .ticks(28)
          .tickFormat((d) => d + " m")
      );

    svgMap
      .append("g")
      .attr("transform", `translate(-30, 0)`)
      .call(
        d3
          .axisLeft(yScale)
          .ticks(14)
          .tickSize(-1420)
          .tickFormat((d) => d + " m")
      );

    svgMap
      .append("g")
      .attr("transform", `translate(1390, 0)`)
      .call(
        d3
          .axisRight(yScale)
          .ticks(14)
          .tickFormat((d) => d + " m")
      );

    svgMap
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#696969")
      .style("cursor", "default");

    // --- Markers ---
    AssetTrackerGenerator({ assetDataArr, svgMap });

    return () => {
      svgMap.selectAll("*").remove();
    };
  }, [assetDataArr]);

  useEffect(() => {
    fetchData(); // Initial fetch

    const eventSource = new EventSource("http://localhost:4000/events");
    eventSource.onmessage = () => {
      fetchData();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return <svg ref={svgMapRef} width="100%" height="500px" />;
};

export default MapArea;
