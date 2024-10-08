import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  Collapse,
  Stack,
  Text,
  VStack,
  Heading,
} from '@chakra-ui/react';

const FilterCheckboxes = ({ assets }) => {
  // Group assets by category
  const categorizedAssets = assets.reduce((acc, asset) => {
    const { asset_cat } = asset;
    if (!acc[asset_cat]) {
      acc[asset_cat] = [];
    }
    acc[asset_cat].push(asset);
    return acc;
  }, {});

  // State to manage checked boxes
  const [checkedCategories, setCheckedCategories] = useState({});
  const [checkedAssets, setCheckedAssets] = useState({});

  // Handle category checkbox change
  const handleCategoryChange = (category) => {
    setCheckedCategories((prev) => {
      const newChecked = !prev[category];
      return { ...prev, [category]: newChecked };
    });

    // Check or uncheck all child assets
    const assetsToCheck = categorizedAssets[category].map(asset => asset.asset_id);
    setCheckedAssets((prev) => {
      const newCheckedAssets = {};
      assetsToCheck.forEach(id => {
        newCheckedAssets[id] = !prev[id]; // Toggle the checked state
      });
      return { ...prev, ...newCheckedAssets };
    });
  };

  // Handle asset checkbox change
  const handleAssetChange = (assetId) => {
    setCheckedAssets((prev) => ({
      ...prev,
      [assetId]: !prev[assetId], // Toggle the checked state
    }));
  };

  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>
        Filter by Asset Categories
      </Heading>
      {Object.keys(categorizedAssets).map((category) => (
        <VStack align="start" key={category} mb={4}>
          <Checkbox
            isChecked={checkedCategories[category] || false}
            onChange={() => handleCategoryChange(category)}
          >
            <Text fontWeight="bold">{getFullCategoryName(category)}</Text>
          </Checkbox>
          <Collapse in={checkedCategories[category]}>
            <Stack spacing={2} pl={6}>
              {categorizedAssets[category].map((asset) => (
                <Checkbox
                  key={asset.asset_id}
                  isChecked={checkedAssets[asset.asset_id] || false}
                  onChange={() => handleAssetChange(asset.asset_id)}
                  isDisabled={!checkedCategories[category]} // Disable if parent is not checked
                >
                  {asset.asset_id}: {asset.asset_desc}
                </Checkbox>
              ))}
            </Stack>
          </Collapse>
        </VStack>
      ))}
    </Box>
  );
};

// Utility function to translate category codes to full names
const getFullCategoryName = (category) => {
  switch (category) {
    case "G":
      return "Gateway";
    case "M":
      return "Medical Equipment";
    case "F":
      return "Fixture";
    case "C":
      return "Consumable";
    case "P":
      return "Pharmaceutical";
    default:
      return "Unknown Category";
  }
};

export default FilterCheckboxes;
