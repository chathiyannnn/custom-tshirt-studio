import React from 'react';
import { AssetGarment } from './gltfCatalog';

export default function GarmentModel({
  garmentType,
  color,
  decals,
  showGeometry = true,
  edgedFaces = false,
  displayPoints = false,
  onBounds,
}) {
  return (
    <AssetGarment
      garmentType={garmentType}
      color={color}
      decals={decals}
      showGeometry={showGeometry}
      edgedFaces={edgedFaces}
      displayPoints={displayPoints}
      onBounds={onBounds}
    />
  );
}
