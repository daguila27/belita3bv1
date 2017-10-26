exports.login = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err, connection){
        connection.query('SELECT * FROM usuario WHERE nombre = ?', input.nombre, function(err, rows){
          if(err)
            console.log('Error Selecting : %s', err);
  
          
          if(rows.length == 0){
            res.render('admin_login', {page_title: 'Ingrese de Administrador', login: 'failed_user'});
          }
          else if(rows[0].contrasenna != input.contrasenna){
            res.render('admin_login', {page_title: 'Ingreso de Administrador', login: 'failed_pass'});
          }
          else{
            console.log(req.session);
            req.session.login_admin = true;
            console.log(req.session);
            res.redirect('/facture_list');
          }
        });
    });
}
exports.user_login = function(req, res){
    req.session.login_admin = false;
    res.redirect('new_sale');

}

exports.cambiar_contrasena = function(req, res){
  var input = JSON.parse(JSON.stringify(req.body));
  req.getConnection(function(err, connection){
    connection.query('SELECT * FROM usuario WHERE nombre = "belita3b" AND contrasenna = ?', [input.contraActual], function(err, rows){
      if(err)
        console.log('Error Selecting : %s', err);
      if(rows.length > 0){
          connection.query('UPDATE usuario SET contrasenna = ? WHERE nombre = "belita3b"', [input.newPass],function(err, rows){
            if(err)
              console.log("Error Selecting : %s", err);
            res.redirect('/admin_login');
          });
      }
      else{
          res.redirect('/changePass')
      }
    });
  });
}