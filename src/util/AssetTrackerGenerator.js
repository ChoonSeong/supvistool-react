import { renderMedicalEquipmentSVG } from "../components/Asset/AssetSVG/MedicalEquipmentSVG";
import { renderFixtureSVG } from "../components/Asset/AssetSVG/FixtureSVG";
import { renderConsumableSVG } from "../components/Asset/AssetSVG/ConsumableSVG";
import { renderPharmaceuticalSVG } from "../components/Asset/AssetSVG/PharmaceuticalSVG";
import { renderGatewaySVG } from "../components/Asset/AssetSVG/GatewaySVG";
import * as d3 from "d3";

// interface AssetTrackerInterface {
//   assetDataArr: AssetData[];
//   svgMap: d3.Selection<SVGSVGElement, unknown, null, undefined>
// }

const AssetTrackerGenerator = (
  { assetDataArr, svgMap } /*: AssetTrackerInterface*/
) /*: void*/ => {
  let new_x /*: number*/, new_y /*: number*/, asset_id /*: string*/;

  for (const asset of assetDataArr) {
    new_x = asset.asset_loc.x * 100 - 25; // X position
    new_y = 683 - asset.asset_loc.y * 100 - 25; // Y position
    asset_id = asset.asset_id;

    // Create a group to hold the SVG
    const iconGroup = svgMap
      .append("g")
      .attr("transform", `translate(${new_x}, ${new_y})`);

    switch (asset.asset_cat) {
      case "M":
        // Append the SVG string directly into the group
        iconGroup
          .html(
            renderMedicalEquipmentSVG({
              svgClassName: `${asset_id}-[${asset.asset_loc.x},${asset.asset_loc.y}]`,
            })
          )
          .on("mouseover", function () {
            // Change the color of the SVG fill on mouseover based on class name
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#3b6a9b");
            console.log(`Mouse over on ${currentClassName}`);
          })
          .on("mouseout", function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#4682B4"); // Reset to original color
            console.log(`Mouse out from ${currentClassName}`);
          })
          .on("mousedown", function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#2f5483");
            console.log(`Mouse out from ${currentClassName}`);
          })
          .on("mouseup", function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#3b6a9b"); // Reset to hovering color
            console.log(`Mouse out from ${currentClassName}`);
          });
        break;
      case "F":
        iconGroup
          .html(
            renderFixtureSVG({
              svgClassName: `${asset_id}-[${asset.asset_loc.x},${asset.asset_loc.y}]`,
            })
          )
          .on("mouseover", function () {
            // Change the color of the SVG fill on mouseover based on class name
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#3b6a9b");
            console.log(`Mouse over on ${currentClassName}`);
          })
          .on("mouseout", function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#4682B4"); // Reset to original color
            console.log(`Mouse out from ${currentClassName}`);
          })
          .on("mousedown", function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#2f5483");
            console.log(`Mouse out from ${currentClassName}`);
          })
          .on("mouseup", function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#3b6a9b"); // Reset to hovering color
            console.log(`Mouse out from ${currentClassName}`);
          });
        break;
      case "C":
        iconGroup
          .html(
            renderConsumableSVG({
              svgClassName: `${asset_id}-[${asset.asset_loc.x},${asset.asset_loc.y}]`,
            })
          )
          .on("mouseover", function () {
            // Change the color of the SVG fill on mouseover based on class name
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#3b6a9b");
            console.log(`Mouse over on ${currentClassName}`);
          })
          .on("mouseout", function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#4682B4"); // Reset to original color
            console.log(`Mouse out from ${currentClassName}`);
          })
          .on("mousedown", function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#2f5483");
            console.log(`Mouse out from ${currentClassName}`);
          })
          .on("mouseup", function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#3b6a9b"); // Reset to hovering color
            console.log(`Mouse out from ${currentClassName}`);
          });
        break;
      case "P":
        iconGroup
          .html(
            renderPharmaceuticalSVG({
              svgClassName: `${asset_id}-[${asset.asset_loc.x},${asset.asset_loc.y}]`,
            })
          )
          .on("mouseover", function () {
            // Change the color of the SVG fill on mouseover based on class name
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#3b6a9b");
            console.log(`Mouse over on ${currentClassName}`);
          })
          .on("mouseout", function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#4682B4"); // Reset to original color
            console.log(`Mouse out from ${currentClassName}`);
          })
          .on("mousedown", function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#2f5483");
            console.log(`Mouse out from ${currentClassName}`);
          })
          .on("mouseup", function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#3b6a9b"); // Reset to hovering color
            console.log(`Mouse out from ${currentClassName}`);
          });
        break;

      case "G":
        iconGroup
          .html(
            renderGatewaySVG({
              svgClassName: `${asset_id}-[${asset.asset_loc.x},${asset.asset_loc.y}]`,
            })
          )
          .on("mouseover", function () {
            // Change the color of the SVG fill on mouseover based on class name
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#006666");
            console.log(`Mouse over on ${currentClassName}`);
          })
          .on("mouseout", function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#008080"); // Reset to original color
            console.log(`Mouse out from ${currentClassName}`);
          })
          .on("mousedown", function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#004C4C");
            console.log(`Mouse out from ${currentClassName}`);
          })
          .on("mouseup", function () {
            // Reset the color when the mouse leaves
            const currentClassName = d3
              .select(this)
              .select("svg")
              .attr("class");
            d3.select(this).select("circle").style("fill", "#006666"); // Reset to hovering color
            console.log(`Mouse out from ${currentClassName}`);
          });
        break;
    }
  }
};

export default AssetTrackerGenerator;
