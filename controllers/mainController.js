const controller = {}

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const __dirname = process.cwd()


controller.inicio = (req,res) => {
  res.render('inicio')
}


controller.eventos = (req,res) => {
  res.render('eventos')
}

controller.nos = (req,res) => {
  res.render('nosotros')
}

controller.fotos = async (req,res) => {
    try {
        // Construimos la ruta: proyecto/public/pics
        const directoryPath = path.join(__dirname, 'public', 'pics');
        
        console.log("🔍 Buscando fotos en:", directoryPath);

        // 1. Verificamos si la carpeta existe
        if (!existsSync(directoryPath)) {
            console.error("❌ La carpeta 'public/pics' no fue encontrada.");
            return res.render('fotos', { fotos: [] });
        }

        // 2. Leemos la carpeta de forma asíncrona
        const files = await fs.readdir(directoryPath);
        
        // 3. Filtramos solo imágenes
        const fotos = files.filter(file => 
            /\.(jpg|jpeg|png|webp|avif)$/i.test(file)
        );

        console.log(`✅ Se encontraron ${fotos.length} fotos.`);

        // 4. Renderizamos enviando el array
        res.render('fotos', { fotos });

    } catch (error) {
        console.error("🔥 Error crítico:", error.message);
        res.status(500).render('fotos', { fotos: [] });
    }
};


export { controller }