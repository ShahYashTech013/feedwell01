import bodyParser from 'body-parser';
import env from 'dotenv';
import express from 'express';
import pg from 'pg';

env.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'FeedwellDB',
    port: 5432,
    password:  '123456',
});
db.connect();

app.get('/', (req, res) => {
    res.render("index.ejs");
});
app.get('/donorreg' ,(req,res) => {
    res.render("donarregister.ejs");
});
app.get('/donorlogin' ,(req,res) => {
    res.render("donarlogin.ejs");
});
app.get('/recipreg',(req,res) => {
    res.render("recipreg.ejs");
});
app.get('/reciplogin',(req,res) => {
    res.render("reciplogin.ejs");
});

app.get('/supplierreg',(req,res) => {
    res.render("supplier_reg.ejs");
})
app.get('/login' , (req,res) => {
    res.render("supplogin.ejs");
})
app.get('/adminlogin' ,(req,res) => {
    res.render("adminlogin.ejs");
})
app.get('/about_us',(req,res) => {
    res.render("Aboutus.ejs");
});

app.get('/join-team',(req,res) => {
    res.render("Joinus.ejs");
});

app.post('/adlogin',(req,res) => {
    var adid = req.body["adminId"];
    var adpass = req.body["adminPass"];
    console.log(adid);
    if(adid == "123" && adpass == "1"){
        res.redirect("/admindash");
    }else{
      res.render("adminlogin.ejs",{
            warn : "Invalid details "
        });
    }
})

app.get('/admindash',async (req,res) => {
    try{
        const donorcount = await db.query('select count(*) from donordashboard');
        const recipcount = await db.query('select count(*) from recipientregister');
        res.render("admindash.ejs",{
            dcount : donorcount.rows[0].count,
            rcount : recipcount.rows[0].count
        });
    }catch(err){
        res.status(500).send("Error");
    }
    
});

app.post('/rdonor',async (req,res) => {
   var fname = req.body["first-name"];
   var lname = req.body["last-name"];
   var email = req.body["email"];
   var password = req.body["password"];
   var phone = req.body["phone"];
   var address = req.body["address"];
   try{
    await db.query('Insert into registerdonor (firstname,lastname,email,phoneno,address,password) values ($1,$2,$3,$4,$5,$6)',[fname,lname,email,phone,address,password]);
    console.log("Data Inserted");
    res.render("donordash.ejs",{
        icon: fname[0]
       });
   }catch(err){
    console.log(err);
    res.render("donarregister.ejs",{
        warn : "Invalid Details "
    })
   }
});


var phoneno;
var pass;
var fname;
app.post('/ldonor',async (req,res) => {
    pass = req.body['login-password'];
    phoneno = req.body['mobileno'];
   try{
    const result = await db.query('SELECT * FROM registerdonor WHERE phoneno = $1',[phoneno]);
    console.log(result.rows[0].password);
    fname= result.rows[0].firstname;
    if(pass == result.rows[0].password){
       return  res.render("donordash.ejs",{
        icon : fname[0]
       });
    }else{
        return res.render("donarlogin.ejs",{
            warn: "Invalid Password or Mobile Number " 
        })
    }
   }catch(err){
    res.status(500).send("Error");
    return res.render("donarlogin",{
        warn : "Invalid Password or Mobile Number "
    });
   }
});

app.post('/rrecip',async (req,res) => {
    var fname = req.body["first-name"];
    var lname = req.body["last-name"];
    var email = req.body["email"];
    var password = req.body["password"];
    var phone = req.body["phone"];
    var address = req.body["address"];
    
    try{
     await db.query('Insert into recipientregister (firstname,lastname,email,phoneno,address,password) values ($1,$2,$3,$4,$5,$6)',[fname,lname,email,phone,address,password]);
     console.log("Data Inserted");
     res.render("recidash.ejs",{
         icon: fname[0]
        });
    }catch(err){
     console.log(err);
     res.render("recipreg.ejs",{
         warn : "Invalid Details "
     })
    }
 });

 var rphoneno;
var rpass;
var rfname;
app.post('/lrecip',async (req,res) => {
    rpass = req.body['login-password'];
    rphoneno = req.body['mobileno'];
   try{
    const result = await db.query('SELECT * FROM recipientregister WHERE phoneno = $1',[rphoneno]);
    console.log(result.rows[0].password);
    rfname= result.rows[0].firstname;
    if(rpass == result.rows[0].password){
       return  res.render("recidash.ejs");
    }else{
        return res.render("reciplogin.ejs",{
            warn: "Invalid Password or Mobile Number " 
        })
    }
   }catch(err){
    res.status(500).send("Error");
    return res.render("reciplogin",{
        warn : "Invalid Password or Mobile Number "
    });
   }
});


app.post('/ressup',async (req,res) => {
    var fname = req.body["first-name"];
    var lname = req.body["last-name"];
    var email = req.body["email"];
    var password = req.body["password"];
    var phone = req.body["phone"];
    var address = req.body["address"];
    
    try{
     await db.query('Insert into supplierregister (firstname,lastname,email,phoneno,address,password) values ($1,$2,$3,$4,$5,$6)',[fname,lname,email,phone,address,password]);
     console.log("Data Inserted");
     res.redirect('/supdash');
    }catch(err){
     console.log(err);
     res.render("supplier_reg.ejs",{
         warn : "Invalid Details "
     })
    }
 });

 var sphoneno;
var spass;
var sfname;
app.post('/loginsup',async (req,res) => {
    spass = req.body['login-password'];
    sphoneno = req.body['mobileno'];
   try{
    const result = await db.query('SELECT * FROM supplierregister WHERE phoneno = $1',[sphoneno]);
    console.log(result.rows[0].password);
    sfname= result.rows[0].firstname;
    if(spass == result.rows[0].password){
        res.redirect('/supdash');
    }else{
        return res.render("supplogin.ejs",{
            warn: "Invalid Password or Mobile Number " 
        })
    }
   }catch(err){
    return res.render("supplogin.ejs",{
        warn : "Invalid Password or Mobile Number "
    });
   }
});


app.get('/supdash',async (req,res) => {
    try{
        const  data = await db.query('select * from donordashboard');
        const rdata = await db.query('select * from recipientdashboard');
        const rcolumn = getdata(rdata);
        const column= getdata(data);
        res.render("supdash.ejs" ,{
          dname : column.donorname,
          foodname : column.foodname,
          category : column.foodcategory,
          quantity : column.quantity,
          location : column.location ,
          rdname : rcolumn.recipient ,
          rfoodname : rcolumn.foodname, 
          rcategory : rcolumn.foodcategory ,
          rquantity : rcolumn.quantity ,
          rlocation : rcolumn.address
       });
    }catch(err){
        res.status(500).send("Error");
     }

});

app.post("/donate" ,async (req,res) => {
   var foodcategory = req.body["food-category"];
   var address = req.body["Address"];
   var foodnamae = req.body["foodname"];
   var date = req.body["service-date"];
   var quantity = req.body["quantity"];
   var occasion = req.body["occasion"];
   try{
    await db.query('insert into donordashboard (servicedate,servicetime,occasion,foodcategory,foodname,quantity,location,donorname,donorphno) values ($1,CURRENT_TIMESTAMP,$2,$3,$4,$5,$6,$7,$8)',[date,occasion,foodcategory,foodnamae,quantity,address,fname,phoneno]);
    res.render("donordash.ejs",{
        icon : fname[0],
        warn : "Donation Successfull"
       });
   }catch(err){
    console.log(err);
    res.render("donordash.ejs",{
        icon : fname[0],
        warn : "Donation Failed"
       });
   }
});

app.get('/donations',async (req,res) => {
    var columns = {};
    try{
        const result =await db.query('SELECT * FROM donordashboard WHERE donorname = $1',[fname]);
        console.log(result);
        columns = getdata(result);
        res.render("donordon.ejs",{
            servicedate : columns.servicedate,
            servicetime : columns.servicetime,
            foodcategory : columns.foodcategory,
            foodname : columns.foodname,
            quantity : columns.quantity,
            occasion : columns.occasion,
            location : columns.location,
        });
    }catch(err){
       res.status(500).send("Error");
    }
});

app.post("/reqfood",async ( req,res) => {
    var cate = req.body["category"];
    var foodname = req.body["name"];
    var quantity = req.body["quantity"];
    var add = req.body["address"];
    console.log("Check 2");
     try{
        await db.query('insert into recipientdashboard (foodcategory,foodname,quantity,address,recipient) values ($1,$2,$3,$4,$5)',[cate,foodname,quantity,add,rfname]);
     }catch(err){
        res.status(500).send("Error occured while processing");
     }
});

app.get('/mdonor' ,async (req,res) => {
    try{
        const data = await db.query('select * from registerdonor');
        const columns = getdata(data);
        res.render("Mdonor.ejs",{
            fname : columns.firstname,
            lname : columns.lastname,
            email : columns.email,
            phone : columns.phoneno,
            address : columns.address
        });
    }catch(err){
        res.status(500).send("Error");
    }
    
});

app.get('/mrecip' ,async (req,res) => {
    try{
        const data = await db.query('select * from recipientregister');
        const columns = getdata(data);
        res.render("Mrecip.ejs",{
            fname : columns.firstname,
            lname : columns.lastname,
            email : columns.email,
            phone : columns.phoneno,
            address : columns.address
        });
    }catch(err){
        res.status(500).send("Error");
    }
});
app.get('/mvolun' ,async (req,res) => {
    try{
        const data = await db.query('select * from supplierregister');
        const columns = getdata(data);
        res.render("Mvolunteer.ejs",{
            fname : columns.firstname,
            lname : columns.lastname,
            email : columns.email,
            phone : columns.phoneno,
            address : columns.address
        });
    }catch(err){
        res.status(500).send("Error");
    }
});

function getdata(rawdata){
    const columns = {};
    rawdata.fields.forEach(field => {
        columns[field.name] = [];
      });
    
      rawdata.rows.forEach(row => {
        rawdata.fields.forEach(field => {
            columns[field.name].push(row[field.name]);
      });
    });
    return columns;
}

app.listen(port, () => {
    console.log('Server running on port ${port}');
  });