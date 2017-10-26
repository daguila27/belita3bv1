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