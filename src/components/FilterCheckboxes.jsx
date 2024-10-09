import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
} from "@chakra-ui/react";
import { FaFilter } from "react-icons/fa"; // Import the filter icon

/**
 * A component that displays filterable checkboxes for assets in a dropdown menu, allowing users to select individual assets.
 *
 * @param {Object[]} assets - Array of asset objects with asset_id and asset_desc properties.
 * @param {function} onAssetChange - Callback function to handle changes in the selected assets.
 */
const FilterCheckboxes = ({ assets, onAssetChange }) => {
  // Initialize all assets as checked by default
  const initialCheckedAssets = assets.reduce((acc, asset) => {
    acc[asset.asset_id] = true;
    return acc;
  }, {});

  const [checkedAssets, setCheckedAssets] = useState(initialCheckedAssets);

  const handleAssetChange = (assetId) => {
    setCheckedAssets((prev) => {
      const newCheckedAssets = {
        ...prev,
        [assetId]: !prev[assetId], // Toggle the asset's checked state
      };

      onAssetChange(newCheckedAssets); // Pass updated checked assets to the parent
      return newCheckedAssets;
    });
  };

  return (
    <>
      <Menu closeOnSelect={false}>
        <MenuButton
          as={IconButton}
          icon={<FaFilter />} // Set the icon for the button
          colorScheme="blue"
          aria-label="Filter Assets"
        />
        <MenuList minWidth="240px">
          <MenuOptionGroup
            title="Assets"
            type="checkbox"
            value={Object.keys(checkedAssets).filter(
              (assetId) => checkedAssets[assetId]
            )}
            onChange={(value) => {
              const newCheckedAssets = { ...checkedAssets };
              assets.forEach((asset) => {
                newCheckedAssets[asset.asset_id] = value.includes(
                  asset.asset_id
                );
              });
              setCheckedAssets(newCheckedAssets);
              onAssetChange(newCheckedAssets);
            }}
          >
            {assets.map((asset) => (
              <MenuItemOption key={asset.asset_id} value={asset.asset_id}>
                {asset.asset_id}: {asset.asset_desc}
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </>
  );
};

export default FilterCheckboxes;
