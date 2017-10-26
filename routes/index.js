exports.index = function(req, res){
    res.render('index', { title: 'Call Service' });
}

exports.to_login = function(req, res){
	res.render('admin_login', {page_title: 'Ingreso de Administrador', login: ''});
}



//PARA LA TIENDA DE SAN ANTONIO
exports.codes = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	console.log(input);
	res.render('BarCodes', {page_title: 'Imprimir codigos', precio: input.Precio, nombre: input.Nombre.replace(',',' '), codeProduct: parseInt(input.idP), Cantidad: parseInt(input.Cant), codFactura: parseInt(input.idF), Indice_Bulto: parseInt(input.indice_bulto), fontSize: parseInt(input.fontSize), indice_tienda: 1});	
}




//PARA LA TIENDA DE 4 ORIENTE
/*exports.codes = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	console.log(input);
	res.render('BarCodes', {page_title: 'Imprimir codigos', precio: input.Precio, nombre: input.Nombre.replace(',',' '), codeProduct: parseInt(input.idP), Cantidad: parseInt(input.Cant), codFactura: parseInt(input.idF), Indice_Bulto: parseInt(input.indice_bulto), fontSize: parseInt(input.fontSize), indice_tienda: 0});	
}*/

exports.rutCodes = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	res.render('RutCodes', {page_title: 'Imprimir codigos', nombre: input.nombre, rut: input.rut});
}


exports.changePass = function(req, res){
	res.render('changePass', {page_title: 'Cambiar contraseña'});
}


//SAN ANTONIO
exports.setNombresVentas = function(req, res){
	var insert = "";
	req.getConnection(function(err, connection){
		connection.query("SELECT * FROM ventaproducto", function(err, rows){
			if(err){console.log("Error Selecting :%s", err);}
			var vp=rows;
			for(var i=0; i<vp.length; i++){
				if(vp[i].codigo_producto.toString().substring(13, 14) == 1){
					var code = vp[i].codigo_producto;
					var query = connection.query("select * from ventaproducto right join producto on (ventaproducto.id_producto = producto.id_producto) WHERE id_venta="+vp[i].id_venta+" AND codigo_producto="+vp[i].codigo_producto.toString(),
						function(err, rows){
							if(err){console.log("Error Selecting : %s", err);}
							
							insert += "'"+rows[0].nombre+"'@"+rows[0].codigo_producto+"-";
						});
					setTimeout(function(){}, 1000);
				}
				else if(vp[i].codigo_producto.toString().substring(13, 14) == 0){
					var code = vp[i].codigo_producto;
					var query = connection.query("select * from ventaproducto right join importaciones on (ventaproducto.id_producto = importaciones.id_producto_importacion) WHERE id_venta="+vp[i].id_venta+" AND codigo_producto="+vp[i].codigo_producto.toString(),
						function(err, rows){
							if(err){console.log("Error Selecting : %s", err);}
							insert += "'"+rows[0].nombre_importacion+"'@"+rows[0].codigo_producto+"-";
						});
					setTimeout(function(){}, 1000);
						
				}
				if(i == vp.length-1){
					
					setTimeout(function(){
						var array = insert.substring(0, insert.length-1).split("-");
						console.log(array);
						for(var j=0; j<array.length; j++){
							var codigo = array[j].split("@");
							var query = connection.query("UPDATE ventaproducto SET nombre_producto = "+codigo[0] +" WHERE codigo_producto = "+codigo[1], function(err, rows){
								if(err){console.log("Error Selecting : %s", err);}
							});
							setTimeout(function(){}, 1000);
						}
						setTimeout(function(){res.redirect("/");}, 500); 

					}, 10000);
				}
			}
		});
	});
}

