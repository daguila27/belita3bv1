


exports.save_provider = function(req, res){
		var input = JSON.parse(JSON.stringify(req.body));
		req.getConnection(function (err, connection) {
				var data =	{ Nombre_proveedor: input.nombre,
								Rut_proveedor: input.rut,
								Telefono: input.telefono,
								Direccion: input.direccion,
								Mail: input.mail
							};
				var query = connection.query("INSERT INTO proveedor SET ? ", data, function(err, rows)
				{

					if (err)
							console.log("Error inserting : %s ",err );
					res.redirect('/render_provider');
				}); 
		});
}

exports.list = function(req, res){
	req.getConnection(function(err,connection){
					 
						connection.query('SELECT * FROM proveedor',function(err,rows)
						{
								if(err)
										console.log("Error Selecting : %s ",err );
								res.render('providers',{page_title:"Nuestros Proveedores", data: rows});				
						 });
				});
		}


exports.delete = function(req, res){
	req.getConnection(function(err,connection){
				 	var input = JSON.parse(JSON.stringify(req.body));
				 	var id = input.id_provider;
					connection.query('DELETE FROM proveedor WHERE Rut_proveedor = ?', [id], function(err,rows)
								{
									if(err)
										console.log("Error Selecting : %s ",err );
									res.redirect('/render_provider');	
								});//SE BORRA EL PROVEEDOR
				});

}


exports.render = function(req, res){
	req.getConnection(function(err,connection){
						connection.query('SELECT * FROM proveedor',function(err,rows)
						{
								if(err)
										console.log("Error Selecting : %s ",err );
								res.render('render_providers', {data: rows});				
						 });
				});
}