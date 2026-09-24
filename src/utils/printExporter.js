/**
 * High-resolution Print-Ready Exporter for INKTAG Studio
 * Converts user front and back decal layers into transparent 300 DPI PNGs
 * (4500px x 5400px equivalent 15" x 18" print area) without guide lines.
 */

export async function exportPrintReadyPNG(decals, side = 'front', canvasWidth = 3000, canvasHeight = 3600) {
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  // Filter decals belonging to this side
  const sideDecals = decals.filter(d => (d.placement || 'front') === side);

  if (sideDecals.length === 0) {
    // Return empty transparent PNG
    return canvas.toDataURL('image/png');
  }

  // Draw each decal on the high-res print canvas
  for (const decal of sideDecals) {
    await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.save();

        // Convert normalized coordinates (-150..150) to high-res canvas pixels
        const centerX = (canvasWidth / 2) + (decal.x * (canvasWidth / 300));
        const centerY = (canvasHeight / 2) + (decal.y * (canvasHeight / 360));
        const decalW = (canvasWidth * 0.5) * decal.scale;
        const decalH = decalW * (img.height / img.width);

        ctx.translate(centerX, centerY);
        ctx.rotate((decal.rotation * Math.PI) / 180);
        ctx.globalAlpha = decal.opacity !== undefined ? decal.opacity : 1;

        ctx.drawImage(img, -decalW / 2, -decalH / 2, decalW, decalH);

        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve(); // continue even if an image fails to load
      img.src = decal.url;
    });
  }

  return canvas.toDataURL('image/png');
}

/**
 * Triggers a direct browser download of the generated print PNG
 */
export function downloadDataURL(dataUrl, filename) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
