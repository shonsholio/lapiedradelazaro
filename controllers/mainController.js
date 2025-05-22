const controller = {}
import sheetdb from 'sheetdb-node';

controller.inicio = (req, res) => {

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
    
    console.log(servicio[i])
    agenda.push(servicio[i])
  }


  res.render('main', {
    agenda
  })  
}, function(err){
  console.log(err);
});

}

export { controller }