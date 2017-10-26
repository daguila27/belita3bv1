exports.search = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err,connection){
                        console.log(input);
                        var search = input.tag; 
                        var query = 'SELECT * FROM tag WHERE tag LIKE "'+'%' + search + '%"';
                        connection.query(query,function(err,rows)
                        {
                                if(err)
                                        console.log("Error Selecting : %s ",err );

                                 
                                res.send(rows);
                        });
                });
}


exports.add = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err, connection){
                var data = {
                    tag : input.value
                };
                connection.query("INSERT INTO tag SET ? ", data, function(err,rows)
                        {
                                if(err)
                                        console.log("Error Selecting : %s ",err );

                                //res.render('test', {page_title: "Prueba", datos: rows});
                                 res.send(rows);
                        });
    });
}


exports.saveConnection = function(req, res){
    var productos = req.session.Productos;
    var tagSplit = {};
    for(var i=0; productos.length; i++){
       tagSplit = productos[i].nombre.split(",");
       for(var j=0; j<tagSplit.length; j++){
            console.log("AQUI");
            console.log("REGISTRO: " + tagSplit[j] + "  " + productos[i].id_producto);
            //store_tag(tagSplit[j], req);
            store_tag_product(tagSplit[j], productos[i].id_producto, req);
        }

    }
    res.send('Correcto!');
}        


exports.saveTags = function(req, res){
    var info = req.session.Productos;
    console.log(info);
    res.send('Correcto! Tags almacenados');
}

//INSERT INTO tags VALUES ('polera' , 122), ('pantalon', 133) 
function store_tag(Tag, req){
        req.getConnection(function(err, connection){
            Tag = UpperWord(Tag);
            var data = {tag: Tag};
            connection.query('SELECT * FROM tag WHERE tag = ?', Tag, function(err, rows){
                if(rows.length == 0){
                    console.log("NUEVO TAG")
                    connection.query("INSERT INTO tags SET ?", data, function(err,rows){
                            if(err)
                                    console.log("Error Selecting : %s ",err );
                            else{
                                console.log('Tag agregado correctamente : %s', rows);
                            }
                                //res.render('test', {page_title: "Prueba", datos: rows});
                            });
                }
                    
                });
            });
}
function UpperWord(word){
    return word[0].toUpperCase() + word.substring(1).toLowerCase();
}

function store_tag_product(Tag, idProducto, req){
    req.getConnection(function(err, connection){
        var data = {tag: Tag, id_producto: idProducto};
            connection.query("INSERT INTO tagproducto SET ?", data, function(err,rows)
                            {
                                if(err)
                                        console.log("Error Selecting : %s ",err );
                                else{
                                    console.log('Almacenando conexiones en la BD.');
                                }
                                //res.render('test', {page_title: "Prueba", datos: rows});
                            });
                });
        }


exports.list = function(req, res){
    res.render('tag_list', {page_title: 'Tags Registrados', login_admin: req.session.login_admin});
}        

exports.render = function(req, res){
    /*SELECT * FROM table1 LEFT JOIN table2 ON table1.id=table2.id
    ->          LEFT JOIN table3 ON table2.id=table3.id;*/
    
    req.getConnection(function(err, connection){
        connection.query("SELECT * FROM tag", function(err, rows){
            if(err)
                console.log("Error Selecting : %s", err);
            console.log(rows);
            res.render('tags_table', {data: rows});
        });

        
    });
}


exports.render_like = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err, connection){
        connection.query('SELECT * FROM tag WHERE tag LIKE "'+'%' + input.tag + '%"', function(err, rows){
            if(err)
                console.log("Error Selecting : %s", err);
            res.render('tags_table', {data: rows});
        });

        
    });

}

exports.info_tag = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err, connection){
        connection.query('SELECT * FROM tagproducto LEFT JOIN producto ON (tagproducto.id_producto = producto.id_producto) WHERE tag LIKE "'+'%' + input.tag + '%"', function(err, rows){
            if(err)
                console.log("Error Selecting : %s", err);
            console.log(rows);
            res.render('info_tag', {data: rows});
        });

        
    });
}


exports.liqTag = function(req, res){
    res.render('liqTag');
}





exports.addTagLiq = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err, connection){
        //insert into belita2.liquidaciontags values ('polera', 1990, 'precio'),('hombre', 10, 'porcentaje');
        var query = 'INSERT INTO liquidaciontags VALUES ';
        var data = {
            tag_liquidacion: input.tags,
            descuento: input.descuento,
            tipo: input.tipo
        }
        connection.query("INSERT INTO liquidaciontags SET ?", data, function(err, rows){
            if(err)
                console.log("Error Selecting : %s", err);
            res.redirect('/table_liquidaciontags');
        }); 
    });
}


exports.renderLiq = function(req,res){
    req.getConnection(function(err, connection){
        connection.query('SELECT * FROM liquidaciontags', function(err, rows){
            if(err)
                console.log('Error Selecting : %s', err);
            res.render('liquidacionesTags', {datos: rows});
        });
    });
}

exports.removeLiq = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err, connection){
        connection.query("DELETE FROM liquidaciontags WHERE id_tag_liquidacion = ?", [input.id], function(err, rows){
            if(err)
                console.log("Error Selecting : %s", err);
            res.redirect('/table_liquidaciontags');
        });
    });
} 


 
