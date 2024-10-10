import React, { useEffect, useRef, useState } from "react";
import AssetTrackerGenerator from "../util/AssetTrackerGenerator";
import AssetModal from "./Asset/AssetModal";
import FilterCheckboxes from "./FilterCheckboxes";
import * as d3 from "d3";
import { Flex } from "@chakra-ui/react"; // Import Chakra UI components

const MapTrack = () => {
  const [assetDataArr, setAssetDataArray] = useState([
    {
      asset_id: "a_1",
      asset_desc: "Blood Type: A",
      asset_cat: "P",
      asset_loc: { x: 5, y: 5 },
      asset_qty: 10,
      asset_exp_date: "1/2/2025",
    },
    {
      asset_id: "a_6",
      asset_desc: "Blood Type: B",
      asset_cat: "P",
      asset_loc: { x: 11.7, y: 4.3 },
      asset_qty: 10,
      asset_exp_date: "1/2/2025",
    },
    {
      asset_id: "a_1234567890123456",
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
      asset_cat: "C",
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

  const [selectedAsset, setSelectedAsset] = useState(null); // Stores the asset data of the clicked tracker
  const [checkedAssets, setCheckedAssets] = useState(
    assetDataArr.reduce((acc, asset) => {
      acc[asset.asset_id] = true; // Initially, all assets are checked
      return acc;
    }, {})
  );

  // Filter assets based on checkedAssets
  const filteredAssetDataArr = assetDataArr.filter(
    (asset) => checkedAssets[asset.asset_id]
  );

  const svgMapRef = useRef(null); // The SVG map

  useEffect(() => {
    if (!svgMapRef.current) return;

    const svgMap = d3.select(svgMapRef.current);
    svgMap.selectAll("*").remove(); // Clear previous content on rerender
    svgMap.attr("viewBox", `-100 -100 1540 953`);

    // Define inner and outer polygons (walls)
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

    // Create scales for axes
    const xScale = d3.scaleLinear().domain([0, 13.6]).range([0, 1360]);
    const yScale = d3.scaleLinear().domain([0, 6.83]).range([683, 0]);

    // Add axes
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
      .style("fill", "#696969");

    // Generate markers for filtered assets
    AssetTrackerGenerator({
      assetDataArr: filteredAssetDataArr,
      svgMap,
      onAssetClick: (asset) => setSelectedAsset(asset),
    });

    return () => svgMap.selectAll("*").remove(); // Cleanup on unmount
  }, [checkedAssets, assetDataArr]);

  return (
    <>
      <Flex justify="flex-end">
        <FilterCheckboxes
          assets={assetDataArr}
          onAssetChange={setCheckedAssets}
        />
      </Flex>
      <svg ref={svgMapRef} />
      {selectedAsset && (
        <AssetModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </>
  );
};

export default MapTrack;
