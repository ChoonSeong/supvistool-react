import AssetData from '../interface/AssetData'
import { renderMedicalEquipmentSVG } from "../components/Asset/AssetSVG/MedicalEquipmentSVG";
import { renderFixtureSVG } from "../components/Asset/AssetSVG/FixtureSVG";
import { renderConsumableSVG } from "../components/Asset/AssetSVG/ConsumableSVG";
import { renderPharmaceuticalSVG } from "../components/Asset/AssetSVG/PharmaceuticalSVG";


interface AssetTrackerInterface {
  assetDataArr: AssetData[];
  svgMap: d3.Selection<SVGSVGElement, unknown, null, undefined>
}

const  AssetTrackerGenerator = ({ assetDataArr, svgMap }: AssetTrackerInterface): void => {
  let new_x: number, new_y: number;

  for (const asset of assetDataArr){
    new_x = asset.asset_loc.x * 100 - 25; // X position
    new_y = asset.asset_loc.y * 100 - 25; // Y position

  // Create a group to hold the SVG
  const iconGroup = svgMap
  .append("g")
  .attr("transform", `translate(${new_x}, ${new_y})`);

    switch (asset.asset_cat){
      case "M":
        // Append the SVG string directly into the group
        iconGroup.html(renderMedicalEquipmentSVG({}));
        break;
      case "F":
        iconGroup.html(renderFixtureSVG({}));
        break;
      case "C":
        iconGroup.html(renderConsumableSVG({}));
        break;
      case "P":
        iconGroup.html(renderPharmaceuticalSVG({}));
        break;
    }
  }
}

export default AssetTrackerGenerator;
