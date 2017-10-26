exports.find = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err, connection){
    	connection.query('SELECT * FROM cliente WHERE rutCliente = ?', input.find_rut, function(err, rows){
    		if(err)
    			console.log("Error Selecting : %s", err);
    		console.log(rows);
    		res.send(rows);
    	});
    });
}

exports.new = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err, connection){
        data = {
            rutCliente: input.rut,
            nombreCliente: input.nombre, 
            telefono: input.telefono,
            mail: input.mail,
            fecha_nacimiento: input.fecha_nacimiento,
            monedero: 0
        };
        connection.query("INSERT INTO cliente SET ?", data, function(err, rows){
            if (err)
                console.log("Error inserting : %s ",err );
            else{
                res.redirect('/render_client'); 
            }
        });
    });
}



exports.list = function(req, res){
	res.render('client_list', {page_title: 'Nuestros Clientes', login_admin: req.session.login_admin});
}
exports.render = function(req, res){
    req.getConnection(function(err, connection){
            connection.query('SELECT * FROM cliente', function(err, rows){
                if(err)
                    console.log("Error Selecting : %s", err);

                res.render('render_client', {data:rows});
            });
    });
}


exports.erase = function(req, res){
    req.getConnection(function(err,connection){
                        var input = JSON.parse(JSON.stringify(req.body));
                        var rut = input.rut;
                        console.log(rut);
                        connection.query('DELETE FROM cliente WHERE rutCliente = ?', [rut],function(err,rows)
                        {
                                if(err)
                                        console.log("Error Selecting : %s ",err );

                            console.log(rows);
                            res.redirect('/render_client'); 
                        });//SE BORRA EL PROVEEDOR
                        
                });
}


exports.createMoney = function(req, res){
    req.getConnection(function(err, connection){
        connection.query('alter table cliente add monedero int(11) null after fecha_nacimiento', function(err, rows){
            if(err)
                console.log('Error Selecting : %s', err);
            console.log(rows);
            res.send('ok');
        });
    });
}