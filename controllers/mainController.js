const controller = {}
import sheetdb from 'sheetdb-node';

controller.inicio = (req,res) => {
  res.render('inicio')
}

controller.agenda = (req, res) => {

  const config = {
    address: 'job0hpcx2z0oc',
    auth_login: 'BASIC_AUTH_login',
    auth_password: 'BASIC_AUTH_password'
  };

  const client = sheetdb(config);

  const agenda = [];

 // Obtiene consulta de la hoja showAgenda
client.read({ limit: 20, offset: 0, sheet: 'showAgenda' }).then(function(data) {

  let servicio = data.split('{')

  for (let i = 1; i < servicio.length; ++i) {
    
    const elementos = servicio[i].replace(/"/g, '')
    agenda.push(elementos)


  }

  res.render('main', {
    agenda
  })  
}, function(err){
  console.log(err);
});

}

controller.web = (req,res) => {
  res.render('web')
}

export { controller }