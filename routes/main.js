import express from 'express'
const router = express.Router();
import { controller } from '../controllers/mainController.js';

const app = express()

router.get('/', controller.inicio)

router.get('/fotos', controller.fotos)

router.get('/eventos', controller.eventos)
router.get('/nosotros', controller.nos)




export { router }