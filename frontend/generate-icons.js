const fs = require('fs');
const path = require('path');

// Tamaños de iconos necesarios
const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512];

// SVG base
const baseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="SIZE" height="SIZE">
  <!-- Background circle -->
  <circle cx="256" cy="256" r="256" fill="#f37a0a"/>
  
  <!-- Beer mug -->
  <g transform="translate(256,256)">
    <!-- Mug body -->
    <rect x="-60" y="-80" width="120" height="140" rx="15" ry="15" fill="#fff" stroke="#333" stroke-width="4"/>
    
    <!-- Beer foam -->
    <ellipse cx="0" cy="-65" rx="50" ry="20" fill="#f9f9f9"/>
    <circle cx="-20" cy="-75" r="8" fill="#fff"/>
    <circle cx="10" cy="-70" r="6" fill="#fff"/>
    <circle cx="25" cy="-80" r="5" fill="#fff"/>
    
    <!-- Beer liquid -->
    <rect x="-50" y="-50" width="100" height="100" rx="10" ry="10" fill="#ffd700"/>
    
    <!-- Mug handle -->
    <path d="M 60 -40 Q 90 -40 90 0 Q 90 40 60 40" fill="none" stroke="#333" stroke-width="6" stroke-linecap="round"/>
    
    <!-- XP Star -->
    <g transform="translate(0,80)">
      <polygon points="0,-15 4,-5 15,-5 7,2 11,12 0,6 -11,12 -7,2 -15,-5 -4,-5" fill="#ffd700" stroke="#333" stroke-width="2"/>
      <text x="0" y="3" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#333">XP</text>
    </g>
  </g>
</svg>`;

// Crear directorio de iconos si no existe
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generar iconos SVG para cada tamaño
sizes.forEach(size => {
  const svgContent = baseSvg.replace(/SIZE/g, size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✓ Generado: ${filename}`);
});

// Crear favicon.ico como SVG
const faviconSvg = baseSvg.replace(/SIZE/g, 32);
fs.writeFileSync(path.join(__dirname, 'public', 'favicon.ico'), faviconSvg);
console.log('✓ Generado: favicon.ico');

// Crear browserconfig.xml
const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="/icons/icon-72x72.svg"/>
      <square150x150logo src="/icons/icon-152x152.svg"/>
      <square310x310logo src="/icons/icon-384x384.svg"/>
      <TileColor>#f37a0a</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;

fs.writeFileSync(path.join(iconsDir, 'browserconfig.xml'), browserConfig);
console.log('✓ Generado: browserconfig.xml');

console.log('\n🎉 Todos los iconos PWA han sido generados exitosamente!');
console.log('📱 La aplicación ahora debería funcionar correctamente en móvil.');