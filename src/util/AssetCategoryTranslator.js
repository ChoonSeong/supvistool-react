export default function AssetCategoryTranslator(char, isPicture) {
    const assetCategoryMap = {
      G: "Gateway",
      M: "Medical Equipment",
      F: "Fixture",
      C: "Consumable",
      P: "Pharmaceutical"
    };
  
    const assetSVGMap = {
        G: "gateway",
        M: "medical_equipment",
        F: "fixture",
        C: "consumable",
        P: "pharmaceutical"
      };

    return isPicture ? assetSVGMap[char] : assetCategoryMap[char] || "Unknown Asset Type";
  }