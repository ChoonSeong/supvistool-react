import React from "react";
import AssetCategoryTranslator from "../../util/AssetCategoryTranslator";

const AssetModal = ({ asset, onClose }) => {
  if (!asset) return null; // Don't render if no asset is selected

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-[600px] p-6 rounded-lg shadow-lg">
        
        {/* Asset Details Header */}
        <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b-2 border-blue-500 pb-2">
          Asset Details
        </h2>

        {/* Flex container for image and info */}
        <div className="flex space-x-6">
          {/* Left side (image/icon) */}
          <div className="w-1/3">
            <img
              src= {`${process.env.PUBLIC_URL}/svg/${AssetCategoryTranslator(asset.asset_cat, true)}.svg`}
              alt="Asset"
              className="rounded-lg"
            />
          </div>
          
          {/* Right side (info) */}
          <div className="w-2/3 bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">
              <span className="font-semibold">Asset ID:</span> {asset.asset_id}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Category:</span> {AssetCategoryTranslator(asset.asset_cat, false)}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Quantity:</span> {asset.asset_qty}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Expiry Date:</span> {asset.asset_exp_date || "None"}
            </p>
          </div>
        </div>

        {/* Asset description */}
        <div className="mt-6">
          <h3 className="text-l font-bold text-gray-700 mb-2 border-b border-gray-300 pb-1">
            Description
          </h3>
          <p className="text-gray-600">{asset.asset_desc || "No description available"}</p>
        </div>

        {/* Close button */}
        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetModal;
