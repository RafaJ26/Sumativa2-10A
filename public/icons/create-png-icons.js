// Script para crear íconos PNG desde SVG
// Ejecutar este script en la consola del navegador en: http://localhost:8000/icons/

function createPNGIcon(size) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    
    // Fondo circular azul
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 2, 0, 2 * Math.PI);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = Math.max(1, size/100);
    ctx.stroke();
    
    // Cruz médica blanca
    ctx.fillStyle = 'white';
    const crossSize = size * 0.6;
    const crossWidth = Math.max(4, size/20);
    
    // Barra vertical
    ctx.fillRect(size/2 - crossWidth/2, size/2 - crossSize/2, crossWidth, crossSize);
    
    // Barra horizontal
    ctx.fillRect(size/2 - crossSize/2, size/2 - crossWidth/2, crossSize, crossWidth);
    
    // Píldoras alrededor
    const pillRadius = Math.max(3, size/30);
    const pillDistance = size * 0.25;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // 4 píldoras en las esquinas
    const positions = [
        [size/2 - pillDistance, size/2 - pillDistance],
        [size/2 + pillDistance, size/2 - pillDistance],
        [size/2 - pillDistance, size/2 + pillDistance],
        [size/2 + pillDistance, size/2 + pillDistance]
    ];
    
    positions.forEach(pos => {
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], pillRadius, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Convertir a PNG y descargar
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `icon-${size}x${size}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`✅ Icono ${size}x${size} creado`);
    }, 'image/png');
}

// Crear todos los íconos necesarios
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
sizes.forEach((size, index) => {
    setTimeout(() => createPNGIcon(size), index * 500);
});

console.log('🎨 Creando íconos PNG...');