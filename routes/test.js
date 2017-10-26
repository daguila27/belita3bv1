exports.test = function(req, res){				
	req.getConnection(function(err,connection){
						var query = 'SELECT * FROM proveedor';
						connection.query(query,function(err,rows){
								if(err)
										console.log("Error Selecting : %s ",err );
								res.render('test', {page_title: "Prueba", datos: rows});
						});
				}); 
}

exports.search = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err,connection){
						var search = input.buscar; 
						if(search == null){search = "";}
						var query = 'SELECT * FROM proveedor WHERE Nombre_proveedor LIKE "'+'%' + search + '%"';
						connection.query(query,function(err,rows)
						{
								if(err)
										console.log("Error Selecting : %s ",err );

								//res.render('test', {page_title: "Prueba", datos: rows});
								console.log(rows);	
								res.send(rows);
						});
				});
}