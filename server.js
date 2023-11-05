const http = require('http');
const express = require('express'), bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const mariadb = require('mariadb');
const { log } = require('console');
const pool = mariadb.createPool({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'tractor'
});

app.get('/student/all', async(req, res) => {
  let conn;
  try{
      conn = await pool.getConnection();
      const rows = await conn.query('select * from student')
      console.log(rows);
      const jsonS = JSON.stringify(rows);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(jsonS);
  }catch(e){

  }
});

//-------------------Customer
app.get('/customer/select', async(req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query('select * from customers')
        console.log(rows);
        const jsonS = JSON.stringify(rows);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(jsonS);
    }catch(e){

    }
});

app.post('/customer/create', async (req, res) => {
    const { username, password, phone, name, address } = req.body;
  
    let conn;
    try {
      conn = await pool.getConnection();
      const insertResult = await conn.query('INSERT INTO customers (username, password, phone, name, address) VALUES (?, ?, ?, ?, ?)', [username, password, phone, name, address]);
      conn.release();
      res.end();
    } catch (e) {
    }
  });

  app.post('/customer/login', async (req, res) => {
    const { username, password} = req.body;
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query('select id, username, phone, name, address from customers where username = ? and password = ?', [username, password])
        console.log(rows);
        const jsonS = JSON.stringify(rows);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(jsonS);
    }catch(e){

    }
  });

  app.get('/customer/select/:id', async (req, res) => {
    const id = req.params.id; // Get the id from the URL parameter
    let conn;
    try {
      conn = await pool.getConnection();
      const query = 'select id, username, phone, name, address from customers WHERE id = ?'; // Corrected SQL query
      const rows = await conn.query(query, [id]);
      console.log(rows);
      const jsonS = JSON.stringify(rows);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(jsonS);
    } catch (e) {
      // Handle errors
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      if (conn) {
        conn.release(); // Release the database connection
      }
    }
  });

//-------------------Owner
app.get('/owner/select', async(req, res) => {
  let conn;
  try{
      conn = await pool.getConnection();
      const rows = await conn.query('select * from owner')
      console.log(rows);
      const jsonS = JSON.stringify(rows);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(jsonS);
  }catch(e){

  }
});

app.post('/owner/updateQ', async(req, res) => {
  const {id} = req.body;

  let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('UPDATE owner SET que = que + 1 WHERE id = ?', [id])
      conn.release();
      res.end();
    } catch (e) {
    }
});

//-------------------Owner
app.post('/order/create', async (req, res) => {
  const {cus_id, owner_id, land, price} = req.body;
  tprice = land * price;
  let conn;
  try {
    conn = await pool.getConnection();
    const insertResult = await conn.query('INSERT INTO iorder (cus_id, owner_id, land, price) VALUES (?, ?, ?, ?)', [cus_id, owner_id, land, tprice]);
    conn.release();
    res.end();
  } catch (e) {
  }
});

app.get('/order/select/:id', async (req, res) => {
  const id = req.params.id; // Get the id from the URL parameter
  let conn;
  try {
    conn = await pool.getConnection();
    const query = 'SELECT * FROM  iorder WHERE cus_id = ?'; // Corrected SQL query
    const rows = await conn.query(query, [id]);
    console.log(rows);
    const jsonS = JSON.stringify(rows);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(jsonS);
  } catch (e) {
    // Handle errors
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release(); // Release the database connection
    }
  }
});

app.get('/order/updateStatus/:id', async(req, res) => {
  const id = req.params.id;

  let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('UPDATE iorder SET status = "ชำระแล้ว" WHERE order_id = ?', [id])
      conn.release();
      res.end();
    } catch (e) {
    }
});

http.createServer(app).listen(5000, ()=>{
    console.log('Express Server started 5000');
});
