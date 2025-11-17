// Script para generar íconos PNG usando Node.js y Canvas
// Instalar dependencias: npm install canvas

const fs = require('fs');
const path = require('path');

// Intentar importar canvas
try {
    const { createCanvas } = require('canvas');
    
    function generateIcon(size) {
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        
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
        
        // Guardar archivo
        const buffer = canvas.toBuffer('image/png');
        const filename = `icon-${size}x${size}.png`;
        fs.writeFileSync(path.join(__dirname, filename), buffer);
        
        console.log(`✅ Icono ${filename} creado`);
    }
    
    // Generar todos los íconos
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    
    console.log('🎨 Generando íconos PNG para PWA...\n');
    
    sizes.forEach(size => {
        generateIcon(size);
    });
    
    console.log('\n🎉 ¡Todos los íconos han sido generados!');
    console.log('📁 Los archivos se encuentran en la carpeta: ' + __dirname);
    
} catch (error) {
    console.log('❌ Error: No se pudo cargar el módulo canvas.');
    console.log('💡 Solución alternativa: Usa el archivo generar-iconos.html en el navegador');
    console.log('📄 Abre: http://localhost:8000/icons/generar-iconos.html');
    console.log('');
    console.log('Para instalar canvas, ejecuta:');
    console.log('npm install canvas');
    console.log('');
    console.log('Error detallado:', error.message);
}