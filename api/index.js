// Neofetch Profile API - Vercel Serverless Function
// Generates SVG stats card for GitHub users

import { Jimp } from 'jimp';
import sharp from 'sharp';

const THEMES = {
  'github-dark': {
    bg: '#161b22',
    key: '#0000FF',
    val: '#0000FF',
    sep: '#0000FF',
    add: '#0000FF',
    del: '#0000FF',
    ascii: '#0000FF',
    text: '#0000FF'
  },
  'github-light': {
    bg: '#f6f8fa',
    key: '#0000FF',
    val: '#0000FF',
    sep: '#0000FF',
    add: '#0000FF',
    del: '#0000FF',
    ascii: '#0000FF',
    text: '#0000FF'
  }
};

// ASCII character set for image conversion (light to dark)
const ASCII_CHARS = ' .`"^-+*o()[]{}?#%@M';

// Convert RGB to hex color
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// Helper to parse offset value (supports "10px", "50%", or just numbers)
// For ASCII grid: percentage is relative to grid dimension, px is scaled (10px ≈ 1 char)
function parseOffset(value, dimension) {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return Math.round(value);
  if (typeof value !== 'string') return 0;

  value = value.trim();
  if (value.endsWith('%')) {
    const percent = parseFloat(value) / 100;
    return Math.round(dimension * percent);
  }
  if (value.endsWith('px')) {
    // Scale px to character units (10px ≈ 1 character)
    const px = parseInt(value, 10) || 0;
    return Math.round(px / 10);
  }
  // Plain number = character units
  return Math.round(parseInt(value, 10) || 0);
}

// Convert avatar image to ASCII art
// Pipeline: Load -> Contain -> Scale -> Offset -> ASCII -> Crop
async function avatarToAscii(avatarUrl, maxHeight = 25, maxWidth = 38, respectTransparency = false, colored = false, imageScale = 1, removeBackground = false, offsetX = 0, offsetY = 0) {
  const gridWidth = maxWidth;
  const gridHeight = maxHeight;

  // Handle imageScale = 0 (don't render)
  if (imageScale <= 0) {
    if (colored) {
      const emptyLine = Array(gridWidth).fill({ char: ' ', color: null });
      return { colored: true, lines: Array(gridHeight).fill(null).map(() => [...emptyLine]) };
    }
    return Array(gridHeight).fill(' '.repeat(gridWidth));
  }

  try {
    // STEP 1: Load image (full size including transparent areas)
    let image;
    const isSvg = avatarUrl.toLowerCase().endsWith('.svg');

    if (isSvg) {
      const response = await fetch(avatarUrl);
      const svgBuffer = Buffer.from(await response.arrayBuffer());
      const pngBuffer = await sharp(svgBuffer, { density: 300 }).png().toBuffer();
      image = await Jimp.read(pngBuffer);
    } else {
      image = await Jimp.read(avatarUrl);
    }

    // Remove background if requested
    if (removeBackground) {
      const w = image.width;
      const h = image.height;
      const tolerance = 30;

      const corners = [
        image.getPixelColor(0, 0),
        image.getPixelColor(w - 1, 0),
        image.getPixelColor(0, h - 1),
        image.getPixelColor(w - 1, h - 1)
      ];

      const cornerColors = corners.map(c => ({
        r: (c >> 24) & 0xFF,
        g: (c >> 16) & 0xFF,
        b: (c >> 8) & 0xFF
      }));

      const bgColor = {
        r: Math.round(cornerColors.reduce((sum, c) => sum + c.r, 0) / 4),
        g: Math.round(cornerColors.reduce((sum, c) => sum + c.g, 0) / 4),
        b: Math.round(cornerColors.reduce((sum, c) => sum + c.b, 0) / 4)
      };

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const pixel = image.getPixelColor(x, y);
          const r = (pixel >> 24) & 0xFF;
          const g = (pixel >> 16) & 0xFF;
          const b = (pixel >> 8) & 0xFF;
          const diff = Math.sqrt(
            Math.pow(r - bgColor.r, 2) +
            Math.pow(g - bgColor.g, 2) +
            Math.pow(b - bgColor.b, 2)
          );
          if (diff <= tolerance) {
            image.setPixelColor(0x00000000, x, y);
          }
        }
      }
    }

    // STEP 1.5: For images with transparency, crop to bounding box of opaque pixels
    // This removes transparent padding so the actual content fills the grid
    // Skip this if removeBackground is enabled - user wants to keep original size
    if (respectTransparency && !removeBackground) {
      let minX = image.width, minY = image.height, maxX = 0, maxY = 0;
      let hasOpaquePixels = false;

      for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
          const color = image.getPixelColor(x, y);
          const a = color & 0xFF;
          if (a >= 128) {
            hasOpaquePixels = true;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      if (hasOpaquePixels && (minX > 0 || minY > 0 || maxX < image.width - 1 || maxY < image.height - 1)) {
        const cropW = maxX - minX + 1;
        const cropH = maxY - minY + 1;
        image.crop({ x: minX, y: minY, w: cropW, h: cropH });
      }
    }

    // STEP 2: CONTAIN mode - fit image in grid area, keep aspect ratio, center
    // Grid is gridWidth x gridHeight characters
    // Each character is visually charAspect wide by 1 tall (charAspect = 0.5)
    // So grid visual area is (gridWidth * charAspect) x gridHeight = 19 x 25
    const charAspect = 0.5;
    const gridVisualWidth = gridWidth * charAspect;  // 38 * 0.5 = 19
    const gridVisualHeight = gridHeight;              // 25

    // Image aspect ratio
    const imgAspect = image.width / image.height;

    // Calculate how to fit image in grid visual area (contain mode)
    // Scale factor to fit entirely within grid
    let visualWidth, visualHeight;
    if (imgAspect > gridVisualWidth / gridVisualHeight) {
      // Image is wider - fit by width
      visualWidth = gridVisualWidth;
      visualHeight = gridVisualWidth / imgAspect;
    } else {
      // Image is taller - fit by height
      visualHeight = gridVisualHeight;
      visualWidth = gridVisualHeight * imgAspect;
    }

    // Convert visual dimensions to character dimensions
    let baseCharWidth = visualWidth / charAspect;   // visual width -> char columns
    let baseCharHeight = visualHeight;               // visual height -> char rows

    // STEP 3: Apply scale (from center, no crop)
    const scaledCharWidth = Math.round(baseCharWidth * imageScale);
    const scaledCharHeight = Math.round(baseCharHeight * imageScale);

    // Resize image to character grid dimensions (1 pixel per character)
    image.resize({ w: scaledCharWidth, h: scaledCharHeight });

    // STEP 4 & 5: Apply offset and prepare for ASCII conversion
    const parsedOffsetX = parseOffset(offsetX, gridWidth);
    const parsedOffsetY = parseOffset(offsetY, gridHeight);

    // Calculate where to place the image (centered + offset)
    const imgStartX = Math.round((gridWidth - scaledCharWidth) / 2) + parsedOffsetX;
    const imgStartY = Math.round((gridHeight - scaledCharHeight) / 2) + parsedOffsetY;

    // STEP 6 & 7: Convert to ASCII and crop to grid
    // We iterate over the grid and sample from the image at the corresponding position
    const contrast = 1.2;
    const ASCII_CHARS = ' `.-\':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@';

    // Calculate average luminance for inversion decision
    let totalLuma = 0;
    let pixelCount = 0;
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        const color = image.getPixelColor(x, y);
        const a = color & 0xFF;
        if (a >= 128) {
          const r = (color >> 24) & 0xFF;
          const g = (color >> 16) & 0xFF;
          const b = (color >> 8) & 0xFF;
          totalLuma += 0.299 * r + 0.587 * g + 0.114 * b;
          pixelCount++;
        }
      }
    }
    const avgLuma = pixelCount > 0 ? totalLuma / pixelCount : 128;
    const shouldInvert = avgLuma < 128;

    let lines = [];

    for (let gridY = 0; gridY < gridHeight; gridY++) {
      let lineData = colored ? [] : '';

      for (let gridX = 0; gridX < gridWidth; gridX++) {
        // Calculate corresponding position in the image
        const imgX = gridX - imgStartX;
        const imgY = gridY - imgStartY;

        // Check if this grid position maps to a valid image pixel
        if (imgX < 0 || imgX >= image.width || imgY < 0 || imgY >= image.height) {
          // Outside image bounds - render as space
          if (colored) {
            lineData.push({ char: ' ', color: null });
          } else {
            lineData += ' ';
          }
          continue;
        }

        // Sample the image
        const color = image.getPixelColor(imgX, imgY);
        const r = (color >> 24) & 0xFF;
        const g = (color >> 16) & 0xFF;
        const b = (color >> 8) & 0xFF;
        const a = color & 0xFF;

        // Transparent pixel - render as space
        if (a < 128) {
          if (colored) {
            lineData.push({ char: ' ', color: null });
          } else {
            lineData += ' ';
          }
          continue;
        }

        // Calculate luminance and map to ASCII character
        let luma = 0.299 * r + 0.587 * g + 0.114 * b;
        let adjustedLuma = (luma - 128) * contrast + 128;
        adjustedLuma = Math.max(0, Math.min(255, adjustedLuma));
        if (shouldInvert) {
          adjustedLuma = 255 - adjustedLuma;
        }

        const charIndex = Math.floor(adjustedLuma / 255 * (ASCII_CHARS.length - 1));
        const char = ASCII_CHARS[charIndex];

        if (colored) {
          lineData.push({ char, color: rgbToHex(r, g, b) });
        } else {
          lineData += char;
        }
      }

      lines.push(lineData);
    }

    return colored ? { colored: true, lines } : lines;
  } catch (error) {
    console.error('Failed to convert avatar:', error);
    return null;
  }
}

// Default ASCII art (fallback)
// Empty ASCII fallback (38 chars x 25 lines)
const DEFAULT_ASCII = Array(25).fill('3'.repeat(38));

// Helper to escape XML special characters
function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSimpleSvg(asciiArt, theme = 'github-dark') {
  const colors = THEMES[theme] || THEMES['github-dark'];
  
  // Center ascii
  const xCenter = 492;
  const textAnchor = ' text-anchor="middle"';

  let asciiLines;
  const isColored = asciiArt && asciiArt.colored;

  if (isColored) {
    asciiLines = asciiArt.lines.map((lineData, i) => {
      const y = 100 + i * 16;
      let lineContent = '';
      let currentColor = null;
      let buffer = '';

      for (const { char, color } of lineData) {
        if (color === currentColor) {
          buffer += escapeXml(char);
        } else {
          if (buffer) {
            if (currentColor) {
              lineContent += `<tspan fill="${currentColor}">${buffer}</tspan>`;
            } else {
              lineContent += buffer;
            }
          }
          buffer = escapeXml(char);
          currentColor = color;
        }
      }
      if (buffer) {
        if (currentColor) {
          lineContent += `<tspan fill="${currentColor}">${buffer}</tspan>`;
        } else {
          lineContent += buffer;
        }
      }

      return `<tspan x="${xCenter}" y="${y}">${lineContent}</tspan>`;
    }).join('\n');
  } else {
    asciiLines = asciiArt.map((line, i) => {
      const y = 100 + i * 16;
      return `<tspan x="${xCenter}" y="${y}">${escapeXml(line)}</tspan>`;
    }).join('\n');
  }

  const svg = `<?xml version='1.0' encoding='UTF-8'?>
<svg xmlns="http://www.w3.org/2000/svg" font-family="Consolas,Monaco,monospace" width="985px" height="600px" font-size="16px">
<style>
@font-face {
  src: local('Consolas'), local('Monaco'), local('monospace');
  font-family: 'CardFont';
  font-display: swap;
}
text, tspan { white-space: pre; }
</style>
<rect width="985px" height="600px" fill="${colors.bg}" rx="15"/>
<text x="${xCenter}" y="100" fill="${colors.ascii}"${textAnchor}>
${asciiLines}
</text>
<text x="${xCenter}" y="550" fill="${colors.text}" text-anchor="middle" font-size="20px">
Artist: Bato Dugarzhapov
</text>
</svg>`;

  return svg;
}

import fs from 'fs';
import path from 'path';

// Vercel serverless handler
export default async function handler(req, res) {
  const { theme = 'github-dark' } = req.query;

  try {
    const slideshowDir = path.join(process.cwd(), 'Slideshow');
    
    if (!fs.existsSync(slideshowDir)) {
      throw new Error('Slideshow directory not found at ' + slideshowDir);
    }
    
    const files = fs.readdirSync(slideshowDir).filter(f => f.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i));
    
    if (files.length === 0) {
       throw new Error('No images found in slideshow folder');
    }

    // Select a random image every time
    const randomIndex = Math.floor(Math.random() * files.length);
    const selectedFile = files[randomIndex];
    const imagePath = path.join(slideshowDir, selectedFile);

    // Generate ASCII
    // Using larger height/width since we have the whole SVG for it
    const asciiArt = await avatarToAscii(imagePath, 25, 60, true, true, 1.0, false, 0, 0);

    if (!asciiArt) {
      throw new Error('Failed to generate ASCII art');
    }

    const svg = generateSimpleSvg(asciiArt, theme);

    // Disable caching to change image on every load
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(svg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

