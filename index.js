import express from 'express'
import cors from 'cors'
import path from 'path'
import { router } from './routes/main.js'
import exp from 'constants';

const app = express();
const __dirname = process.cwd()

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

//MANEJO DE ERRORES
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error del servidor');
});

app.listen(app.get('port'), () => {
  console.log('Conectados')
})