const controller = {}

controller.list = (req,res) => {
req.getConnection((err,conn ) => {
    conn.query('SELECT * FROM administracion', (err,row) => {
      
        if (err) {
            res.json(err);
    }
  
res.render('agregraproductoa',{

data:row


    });
});
});
}