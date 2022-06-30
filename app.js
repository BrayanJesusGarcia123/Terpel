

//1- invocamos a express 
const express = require('express');
const app = express();
const morgan = require('morgan');
//2- seteamos urleancoded para capturar los dato sin ningun error
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

//3 invocamos un paquete dotenv 

const dotenv = require('dotenv');
dotenv.config({
    path: './env/.env'
});

//4- el directorio public los archivos css imagenes etc 
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5- establecemos el motor de plantillas

app.set('view engine', 'ejs');


//middlewares

app.use(morgan('dev'));
//routes
const customerRoute = require('./routers/customer');

//6 invocamos a bcryptsj 
// para la proteccion de la conttraseña que la cifra
const bcryptjs = require('bcryptjs');

//7 var de ssesion

const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


//8 invocamos el modulo de conexion de la base de datos

const connect = require('./database/db');
const connection = require('./database/db');


app.get('/', (req, res) => {
    res.render('index.ejs');
})
app.get('/contactanos', (req, res) => {
    res.render('contactanos');
})

app.get('/registro', (req, res) => {
    res.render('registro');
})
app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/dashboarda', (req, res) => {
    res.render('dashboarda');
})


app.get('/agregraproductoa', (req, res) => {
 
        connection.query('SELECT * FROM administracion', (err, adm) => {
            if(err){
                next(err);
            }
            
            console.log(adm)
            res.render('agregraproductoa', {
                data: adm
            });
            
            });
        
        });

        app.get('/agregraproductoa2', (req, res) => {
 
            connection.query('SELECT * FROM administracion', (err, adm) => {
                if(err){
                    next(err);
                }
                
                console.log(adm)
                res.render('agregraproductoa', {
                    data: adm
                });
                
                });
            
            });



app.get('/ventasa', (req, res) => {
   
        connection.query('SELECT * FROM operario', (err, ventasa) => {
            if(err){
                next(err);
            }
            
            console.log(ventasa)
            res.render('ventasa', {
                dates: ventasa
            });
            
            });
        
        });

app.get('/graficaa', (req, res) => {
    res.render('graficaa');

})

app.get('/delete/:id', (req, res) => {

    console.log(req.params);
    const {id} = req.params;
    //const {id} = req.params
    connection.query('DELETE FROM administracion WHERE id = ? ', [id], (err, row) => {
        res.redirect('/agregraproductoa');
})

});


app.get('/deletep/:id', (req, res) => {

    console.log(req.params);
    const {id} = req.params;
    //const {id} = req.params
    connection.query('DELETE FROM administracion WHERE id = ? ', [id], (err, row) => {
        res.redirect('/productos');
})



});

//operario


  app.get('/operario', (req, res) => {
    res.render('operario');
})


app.get('/productos', (req, res) => {
    connection.query('SELECT * FROM administracion', (err, producto) => {
        if(err){
            next(err);
        }
        
        console.log(producto)
        res.render('productos', {
            data: producto
        });
        
        });
    
    });

app.get('/observacion', (req, res) => {
    res.render('observacion');
})


app.get('/agregarventa', (req, res) => {
 
    connection.query('SELECT * FROM operario', (err, producto) => {
        if(err){
            next(err);
        }
        
        console.log(producto)
        res.render('agregarventa', {
            data: producto
        });
        
        });
    
    });

    app.get('/agregarventa2', (req, res) => {

        connection.query('SELECT * FROM operario', (err, producto) => {
            if(err){
                next(err);
            }
            
            console.log(producto)
            res.render('agregarventa', {
                data: producto
            });
            
            });
        
        });




//agregaventa

app.get('/deleteo/:idoperario', (req, res) => {

    console.log(req.params);
    const {idoperario} = req.params;
    //const {id} = req.params
    connection.query('DELETE FROM operario WHERE idoperario = ? ', [idoperario], (err, row) => {
        res.redirect('/agregarventa');
})

});


app.get('/deletoo/:idoperario', (req, res) => {

    console.log(req.params);
    const {idoperario} = req.params;
    //const {id} = req.params
    connection.query('DELETE FROM operario WHERE idoperario = ? ', [idoperario], (err, row) => {
        res.redirect('/ventasa');
})

});













//paso 10 registro 

app.post('/registro', async (req, res) => {
    const nombre = req.body.nombre
    const correo = req.body.correo
    const contraseña = req.body.contraseña
    const rol = req.body.rol
    console.log(nombre, correo, contraseña, rol);
    let contraseñaHassh = await bcryptjs.hash(contraseña, 8);
    connection.query('INSERT INTO users SET ?', {
        nombre: nombre,
        correo: correo,
        contraseña: contraseñaHassh,
        rol: rol
    }, async (error, results) => {

        if (error) {
            console.log(error);
        } else {
            res.render('registroexito')
        }

    })

})


// 11-autentificacion



app.post('/auth', async (req, res)=>{

const correo = req.body.correo;
const contraseña = req.body.contraseña;
console.log(correo, contraseña);
let contraseñaHaash = await bcryptjs.hash(contraseña, 8);
if(correo && contraseña){
    connection.query('SELECT * FROM users WHERE correo = ?', [correo], async(error, results)=>{
        if(results.length == 0 || !(await bcryptjs.compare(contraseña, results[0].contraseña))){
            res.send('password incorrecto');
        } else{
            res.render('dashboarda');
        }
    })
}
})


//paso 12 registro producto


app.post('/add', async (req, res) => {
    const producto = req.body.producto
    const precio = req.body.precio
    const observacion = req.body.observacion
   
    console.log(producto, precio, observacion);
  
    connection.query('INSERT INTO administracion SET ?', {
        producto: producto,
        precio: precio,
       observacion: observacion,
    }, async (error, results) => {

        if (error) {
            console.log(error);
        } else {
            res.redirect('agregraproductoa');
        }

    })

})  

// agregar ventas operario
app.post('/agg', async (req, res) => {
    const producto = req.body.producto
    const unidades = req.body.unidades
    const precio = req.body.precio
   
    console.log(producto, unidades, precio);
  
    connection.query('INSERT INTO operario SET ?', {
        
        producto: producto,
        unidades: unidades,
       precio: precio,
    }, async (error, results) => {

        if (error) {
            console.log(error);
        } else {
            res.render('agregarventa')
        }

    })

})

app.listen(3000, (req, res) => {

    console.log('SERVER RUNNING IN HTPPS://localhost:3000');
})


