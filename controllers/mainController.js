const controller = {}

import { sheets_v4 } from '@googleapis/sheets';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
// const __dirname = process.cwd()
const __dirname = path.dirname(__filename);
import servicios from '../public/data/agenda.json' with { type: 'json' };

const SPREADSHEET_ID = '1efrlnzEJ707W796uoMGMFCqrPydtdizIUhBVOey4dfA'; 
const RANGE = 'eventos!A:I';

controller.inicio = (req,res) => {
  res.render('inicio')
}


controller.eventos = async (req, res) => {

try {
    let authConfig;

    // Detectamos si estamos en producción (Vercel) o si la variable existe
    if (process.env.VERCEL === '1' || process.env.GOOGLE_CREDENTIALS) {
      
      // Verificación de seguridad en la consola de Vercel
      if (!process.env.GOOGLE_CREDENTIALS) {
        throw new Error("La variable GOOGLE_CREDENTIALS no está configurada en Vercel.");
      }

      authConfig = {
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS.trim()),
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      };
      
    } else {
      // Si estamos en tu iMac local, usamos el archivo credentials.json sin problemas
      authConfig = {
        keyFile: path.join(__dirname, '../credentials.json'), 
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      };
    }

    // 3. Autenticación con Google
    const auth = new GoogleAuth(authConfig);
    const sheets = new sheets_v4.Sheets({ auth });

    // 4. Pedir los datos a la hoja de cálculo
    const respuesta = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const filas = respuesta.data.values;

    // Si está vacía la hoja, respondemos con un array vacío de una vez
    if (!filas || filas.length === 0) {
      return res.json([]);
    }

    // 5. Procesamos y formateamos las filas a JSON
    const [cabeceras, ...filasDeDatos] = filas;

    const listaEventos = filasDeDatos.map(fila => {
      const objeto = {};
      cabeceras.forEach((cabecera, indice) => {
        objeto[cabecera] = fila[indice] ?? ""; 
      });
      return objeto;
    });

    // 6. RESPUESTA: Enviamos los datos al frontend o vista
    // Si usas una API que devuelve JSON:
    res.render('eventos', {
    servicios: listaEventos
  })
    // return res.json(listaEventos);
    
    // Si vas a renderizar una vista de EJS/Pug (descomenta la línea de abajo y comenta el res.json):
    // return res.render('eventos', { eventos: listaEventos });

  } catch (error) {
    console.error('Error en el controlador de eventos (Sheets):', error);
    return res.status(500).json({ error: 'Error al cargar los eventos' });
  }
};

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

  // SE INCLUYERON LAS CREDENCIALES DE GOOGLE CONSOLE, SOLO FALTA EL CODIGO JS EN ES6 PARA LLAMAR DESDE EL GOOGLE SHEETS

  // const hoy = new Date();
  
  // const proximos = []

  // servicios.forEach(ind => {
  //   const comp = new Date (ind.fesha)
  //   if ((comp > hoy) || (comp == hoy)) {
  //     proximos.push(ind)
  //   } else {
  //     console.log(ind.donde, "ya paso, fue el ", ind.fesha, " y hoy es ", hoy)
  //   }
  // });

  // res.render('eventos', {
  //   servicios: proximos
  // })


export { controller }