exports.new_voucher = function(req, res){
	req.getConnection(function(err, connection){
		var query = connection.query("SELECT * FROM proveedor", function(err, rows){
			if(err)
				console.log("Error inserting: %s", err);
			res.render('new_voucher', {page_title: "Boleta", data:rows, login_admin: req.session.login_admin});
		}); 
	});
}

exports.generate_voucher = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var f = new Date();
	var providerName = "";
	var total = parseInt(input.costo) + (parseInt(input.iva)/100)*parseInt(input.costo);
	var fecha = f.getDate()+"/"+f.getMonth()+"/"+f.getFullYear()+" "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds();
	

		req.getConnection(function (err, connection) {
				var data = {
					Fecha 	: f,
					Costo   : input.costo,
					Iva		: input.iva,
					Ready   : false,
					bulto_pendiente: 0,
					Bultos  : input.bultos,
					Rut_Proveedor : input.id_proveedor,
					Num_Documento : input.num_documento
				};
				var query = connection.query("INSERT INTO factura SET ? ", data, function(err, rows)
				{

					if (err)
							console.log("Error inserting : %s ",err );
					var numFactura = rows.insertId;	
					connection.query('SELECT * FROM proveedor WHERE Rut_Proveedor = ?', [input.id_proveedor],function(err,rows)
						{
								if(err)
										console.log("Error Selecting : %s ",err );
								
								providerName = rows[0].Nombre_proveedor;
								var jre = require('node-jre');
								var output = jre.spawnSync(   
								    ['routes/java'],           
								    'impresora',                 
								    [input.costo, input.iva, input.bultos, fecha, providerName, numFactura, total],            
								    { encoding: 'utf8' }     
								  ).stdout.trim();
								res.redirect('/facture_list');
						 });	
					

				});
		});
}


exports.voucher_sale = function(req, res){
	var detalles = req.session.saleProducts;
	var Costo = req.session.CostoTotal;
	var details = ""; 
	var jre = require('node-jre');
	var f = new Date();
	var fecha = f.getDate()+"/"+f.getMonth()+"/"+f.getFullYear()+" "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds();
	
	for(var i=0; i<detalles.length; i++){
		if(detalles[i]!=null){
			var ite = 30 - parseInt(detalles[i].nombre.length);
			var space = ""; 
			for(var j=0; j<ite; j++){
				space += " ";
			}
			if(detalles[i].precioFinal || detalles[i].precioFinal == 0){
				details += "   " + detalles[i].nombre.replace(/,/g, " ") + space+"$"+ detalles[i].precioFinal+ "(antes $"+detalles[i].precio+")\n";
			}
			else{
				details += "   " + detalles[i].nombre.replace(/,/g, " ") + space+"$"+ detalles[i].precio+ "\n";	
			}
		}
	}
	var output = jre.spawnSync( 
	    ['routes/java'],                 
	    'impresoraSale',                  
	    [details, Costo, fecha, req.session.codVenta, req.session.nameSeller], 
	    { encoding: 'utf8' }      
	  ).stdout.trim();            
	console.log(output);
	console.log(details);
	console.log(req.session.nameSeller);
	res.redirect('/new_sale');	
}



exports.voucher_report = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
		var date = input.fecha.split('/');
		var fecha = "";
		for(var i=date.length-1; i>=0; i--){
			fecha += date[i];
			if(i != 0){fecha += "-";}
		}
		req.getConnection(function(err, connection){
			connection.query("select * from venta right join vendedor on (venta.rut_vendedor = vendedor.rutVendedor) left join cliente on (venta.rut_cliente = cliente.rutCliente)  where venta.fecha like '"+fecha+"%'", function(err, rows){
				if(err){
					console.log("Error Selecting : %s", err);
				}
				var jre = require('node-jre');
				var voucher = "";
				var fecha_hora = fecha;
				var total = 0;
				var cantidad_ventas = rows.length;
				for(var i=0; i<rows.length; i++){
					total += rows[i].monto;
					voucher += "Venta #"+rows[i].id_venta+": \n";
					voucher += "Nombre vendedor: "+rows[i].nombreVendedor+", Rut: "+rows[i].rut_vendedor +"\n";
					if(rows[i].rutCliente == null){
						voucher += "Nombre del Cliente: No Registrado. \n";		
					}
					else{
						voucher += "Nombre del Cliente: "+rows[i].nombreCliente+", Rut: "+rows[i].rut_cliente+"\n";	
					}
					voucher += "Monto: $"+rows[i].monto+"\n"; 
					voucher += "------------------------------------\n"
				}
				var output = jre.spawnSync( 
				    ['routes/java'],                 
				    'impresoraReport',                  
				    [voucher, total, fecha_hora, cantidad_ventas], 
				    { encoding: 'utf8' }      
				  ).stdout.trim();            
			});
		});	



}



exports.voucher_stock = function(req, res){
	req.getConnection(function(err, connection){
		//SELECT * FROM belita2.producto WHERE producto.nombre LIKE '%poleron%' AND producto.nombre LIKE '%hombre%';
		connection.query("SELECT * FROM producto", function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			var datos = rows;
			connection.query("SELECT * FROM importaciones", function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				var totalProductos = 0;
				var importaciones = rows
				var detalles = "";
				if(datos.length > 0){
					for(var i=0; i<datos.length; i++){
						totalProductos += datos[i].cantidadtotal;
						detalles += datos[i].nombre.replace(/,/g, " ")+"    "+datos[i].cantidadtotal+"\n";
					}
					detalles +="\n******IMPORTACIONES******\n";
					for(var j=0; j<importaciones.length; j++){
						totalProductos += importaciones[j].cantidad_importacion;
						detalles += importaciones[j].nombre_importacion.replace(/,/g, " ")+"    "+importaciones[j].cantidad_importacion+"\n";
					}
					var jre = require('node-jre');
					var output = jre.spawnSync( 
				    	['routes/java'],                 
				    	'impresoraStock',                  
				    	[totalProductos, detalles], 
				    	{ encoding: 'utf8' }      
					).stdout.trim();
				}
			});
		});

	});
}



exports.voucher_stock_name = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var array = input.NombreProduct.split(',');
	var nombre = input.NombreProduct;
	var query = "SELECT * FROM belita2.producto WHERE ";
	var query2 = "SELECT * FROM belita2.importaciones WHERE ";
	for(var i = 0; i<array.length; i++){
		query += "nombre LIKE '%"+array[i]+"%'";
		query2 += "nombre_importacion LIKE '%"+array[i]+"%'";
		if(i!=array.length-1){
			query += " AND ";
			query2 += " AND ";
		}
	}
	console.log(query);
	console.log(query2);
	req.getConnection(function(err, connection){
		//SELECT * FROM belita2.producto WHERE producto.nombre LIKE '%poleron%' AND producto.nombre LIKE '%hombre%';
		connection.query(query, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			var datos = rows;
			connection.query(query2, function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				var totalProductos = 0;
				var importaciones = rows
				var detalles = "";
				if(datos.length > 0){
					for(var i=0; i<datos.length; i++){
						totalProductos += datos[i].cantidadtotal;
						detalles += datos[i].nombre.replace(/,/g, " ")+"    "+datos[i].cantidadtotal+"\n";
					}
					detalles +="\n*******IMPORTACIONES*******\n";
					for(var j=0; j<importaciones.length; j++){
						totalProductos += importaciones[j].cantidad_importacion;
						detalles += importaciones[j].nombre_importacion.replace(/,/g, " ")+"    "+importaciones[j].cantidad_importacion+"\n";
					}
					var jre = require('node-jre');
					var output = jre.spawnSync( 
				    	['routes/java'],                 
				    	'impresoraStock',                  
				    	[totalProductos, detalles], 
				    	{ encoding: 'utf8' }      
					).stdout.trim();
				}
			});
		});

	});
}



exports.excel_stock = function(req, res){
	var fs = require('fs');
	var date = new Date();
	var writeStream = fs.createWriteStream("excel/stock"+date+".xlsx");

	var datos = "Nombre"+"\t"+"Cantidad"+"\n";
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM producto', function(err, rows){
			if(err){
				console.log("Error Selecting: %s",err);
				res.send('error');
			}
			else{
				for(var i=0; i<rows.length; i++){

					datos += rows[i].nombre.replace(/,/g, " ")+"\t"+rows[i].cantidadtotal+"\n";
				}
				connection.query('SELECT * FROM importaciones', function(err, rows){
					if(err){
						console.log("Error Selecting : %s", err)
						res.send('error');
					}
					else{
						for(var i=0; i<rows.length; i++){
							datos += rows[i].nombre_importacion.replace(/,/g, " ")+"\t"+rows[i].cantidad_importacion+"\n";
						}
						console.log(datos);
						writeStream.write(datos);
						writeStream.close();
						res.send('ok');
					}
				});
			}
		});
	});
}