// import AssetData from '../interface/AssetData'
import { renderMedicalEquipmentSVG } from "../components/Asset/AssetSVG/MedicalEquipmentSVG";
import { renderFixtureSVG } from "../components/Asset/AssetSVG/FixtureSVG";
import { renderConsumableSVG } from "../components/Asset/AssetSVG/ConsumableSVG";
import { renderPharmaceuticalSVG } from "../components/Asset/AssetSVG/PharmaceuticalSVG";
import { renderGatewaySVG } from '../components/Asset/AssetSVG/GatewaySVG';
import * as d3 from "d3";

// interface AssetTrackerInterface {
//   assetDataArr: AssetData[];
//   svgMap: d3.Selection<SVGSVGElement, unknown, null, undefined>
// }

const  AssetTrackerGenerator = ({ assetDataArr, svgMap, onAssetClick  }/*: AssetTrackerInterface*/)/*: void*/ => {
  let new_x/*: number*/, new_y/*: number*/;

  console.log(assetDataArr);

  for (const asset of assetDataArr){
    new_x = asset.asset_loc.x * 100 - 50; // X position
    new_y = 683 - (asset.asset_loc.y * 100) - 60; // Y position

  // Create a group to hold the SVG
  const iconGroup = svgMap
  .append("g")
  .attr("transform", `translate(${new_x}, ${new_y})`);

    switch (asset.asset_cat){
      case "M":
        // Append the SVG string directly into the group
        iconGroup.html(renderMedicalEquipmentSVG({ asset_data: asset }))
        .on('mouseover', function () {
          // Change the color of the SVG fill on mouseover based on class name
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").attr("cursor", "pointer");
          d3.select(this).select("circle").style("fill", "#3b6a9b");
          d3.select(this).select("g.tooltip").style("opacity", "0.8");
          console.log(`Mouse over on ${currentClassName}`);
        })
        .on('mouseout', function () {
          // Reset the color when the mouse leaves
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").style("fill", "#4682B4"); // Reset to original color
          d3.select(this).select("g.tooltip").style("opacity", "0");
          console.log(`Mouse out from ${currentClassName}`);
        })
        .on('mousedown', function () {
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").style("fill", "#2f5483");
          onAssetClick(asset); // Pass asset data on click
          console.log(`Mouse out from ${currentClassName}`);
        })
        .on('mouseup', function () {
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").style("fill", "#3b6a9b"); // Reset to hovering color
          console.log(`Mouse out from ${currentClassName}`);
        });
        break;
      case "F":
        iconGroup.html(renderFixtureSVG( { asset_data: asset } ))
        .on('mouseover', function () {
          // Change the color of the SVG fill on mouseover based on class name
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").attr("cursor", "pointer");
          d3.select(this).select("circle").style("fill", "#3b6a9b");
          d3.select(this).select("g.tooltip").style("opacity", "0.8");
          console.log(`Mouse over on ${currentClassName}`);
        })
        .on('mouseout', function () {
          // Reset the color when the mouse leaves
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").style("fill", "#4682B4"); // Reset to original color
          d3.select(this).select("g.tooltip").style("opacity", "0");
          console.log(`Mouse out from ${currentClassName}`);
        })
        .on('mousedown', function () {
          // Reset the color when the mouse leaves
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").style("fill", "#2f5483");
          onAssetClick(asset); // Pass asset data on click
          console.log(`Mouse out from ${currentClassName}`);
        })
        .on('mouseup', function () {
          // Reset the color when the mouse leaves
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").style("fill", "#3b6a9b"); // Reset to hovering color
          console.log(`Mouse out from ${currentClassName}`);
        });
        break;
      case "C":
        iconGroup.html(renderConsumableSVG( { asset_data: asset } ))
        .on('mouseover', function () {
          // Change the color of the SVG fill on mouseover based on class name
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").attr("cursor", "pointer");
          d3.select(this).select("circle").style("fill", "#3b6a9b");
          d3.select(this).select("g.tooltip").style("opacity", "0.8");
          console.log(`Mouse over on ${currentClassName}`);
        })
        .on('mouseout', function () {
          // Reset the color when the mouse leaves
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").style("fill", "#4682B4"); // Reset to original color
          d3.select(this).select("g.tooltip").style("opacity", "0");
          console.log(`Mouse out from ${currentClassName}`);
        })
        .on('mousedown', function () {
          // Reset the color when the mouse leaves
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").style("fill", "#2f5483");
          onAssetClick(asset); // Pass asset data on click
          console.log(`Mouse out from ${currentClassName}`);
        })
        .on('mouseup', function () {
          // Reset the color when the mouse leaves
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").style("fill", "#3b6a9b"); // Reset to hovering color
          console.log(`Mouse out from ${currentClassName}`);
        });
        break;
      case "P":
        iconGroup.html(renderPharmaceuticalSVG( { asset_data: asset } ))
        .on('mouseover', function () {
          // Change the color of the SVG fill on mouseover based on class name
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").attr("cursor", "pointer");
          d3.select(this).select("circle").style("fill", "#3b6a9b");
          d3.select(this).select("g.tooltip").style("opacity", "0.8");
          console.log(`Mouse over on ${currentClassName}`);
        })
        .on('mouseout', function () {
          // Reset the color when the mouse leaves
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").style("fill", "#4682B4"); // Reset to original color
          d3.select(this).select("g.tooltip").style("opacity", "0");
          console.log(`Mouse out from ${currentClassName}`);
        })
        .on('mousedown', function () {
          // Reset the color when the mouse leaves
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").style("fill", "#2f5483");
          onAssetClick(asset); // Pass asset data on click
          console.log(`Mouse out from ${currentClassName}`);
        })
        .on('mouseup', function () {
          // Reset the color when the mouse leaves
          const currentClassName = d3.select(this).select("svg").attr("class");
          d3.select(this).select("circle").style("fill", "#3b6a9b"); // Reset to hovering color
          console.log(`Mouse out from ${currentClassName}`);
        });
        break;

        case "G":
          iconGroup.html(renderGatewaySVG( { asset_data: asset } ))
          .on('mouseover', function () {
            // Change the color of the SVG fill on mouseover based on class name
            const currentClassName = d3.select(this).select("svg").attr("class");
            d3.select(this).select("circle").attr("cursor", "pointer");
            d3.select(this).select("circle").style("fill", "#006666");
            d3.select(this).select("g.tooltip").style("opacity", "0.8");
            console.log(`Mouse over on ${currentClassName}`);
          })
          .on('mouseout', function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3.select(this).select("svg").attr("class");
            d3.select(this).select("circle").style("fill", "#008080"); // Reset to original color
            d3.select(this).select("g.tooltip").style("opacity", "0");
            console.log(`Mouse out from ${currentClassName}`);
          })
          .on('mousedown', function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3.select(this).select("svg").attr("class");
            d3.select(this).select("circle").style("fill", "#004C4C");
            onAssetClick(asset); // Pass asset data on click
            console.log(`Mouse out from ${currentClassName}`);
          })
          .on('mouseup', function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3.select(this).select("svg").attr("class");
            d3.select(this).select("circle").style("fill", "#006666"); // Reset to hovering color
            console.log(`Mouse out from ${currentClassName}`);
          });
          break;
    }
  }
}

export default AssetTrackerGenerator;
