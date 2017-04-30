// requires
var express = require ('express');
var app = express();
var path = require ('path');
var pg = require ('pg');
var bodyParser = require ('body-parser');

// uses
app.use (bodyParser.urlencoded({extended:true}));
app.use (express.static('public'));

//set up config for pool
var config = {
  database: 'to-do-list',
  host: 'localhost',
  port: 5432,
  max: 15,
  timeOutMilliSec: 20000
};  //end config


//create new pool
var pool = new pg.Pool( config );

// spin up server
app.listen(3030, function(){
  console.log('listening on port 3030');
});

// ROUTES
// getListItems route
app.get ('/getListItems', function (req, res){
  console.log('hit get ListItems');
  // array of listItems
  var allListItems = [];
  var completedItems = [];
  // connect to db
  pool.connect( function( err, connection, done ){
    //check if error
    if( err ){
      console.log( err );
      // respond with error code
      res.send( 400 );
    }// end error
    else{
      console.log('connected to db');
      // send query for all list items in table ('list') and hold in var=resultSet
      var resultSet = connection.query( "SELECT * from list" );
      // convert each row into an object in the allListItems array
      // on each row, push the row into allListItems
      resultSet.on( 'row', function( row ){
        allListItems.push( row );
      }); //end on row push
      // on end of query, send array of list items as response
      resultSet.on( 'end', function(){
        // close connection
        done();
        // res.send array of list items
        res.send( allListItems );
      }); //end on end function
    } // end else
  }); //end pool
}); //end getListItems GET

// addListItem route
app.post ('/addListItem', function (req, res){
  console.log('hit addListItem');
  console.log('received from client:', req.body);
  // connect to db
  pool.connect( function( err, connection, done ){
    //check if there was an error
    if( err ){
      console.log( err );
      // respond with error code 400
      res.send( 400 );
    }// end error
    else{
      console.log('connected to db');
      //query to write this list item (req.body) to db
      connection.query( "INSERT INTO list (item) VALUES($1)", [req.body.item]);
      // close connection
      done();
      // res.send
      res.sendStatus(200);
    } // end else
  }); //end pool
}); //end addListItem POST

app.post('/completeItem/', function(req, res) {
  console.log('in POST completeItem');
  console.log('req.body ->', req.body.listId);
  pool.connect( function( err, connection, done ){
    //check if there was an error
    if( err ){
      console.log( err );
      // respond with error code 400
      res.send( 400 );
    }// end error
    else{
      console.log('connected to db');
      //query to write this list item (req.body) to db
      connection.query( "UPDATE list SET complete=true where id=$1", [req.body.listId]);
      // close connection
      done();
      // res.send
      res.sendStatus(200);
    } // end else
  }); //end pool
});  // end completeItem POST

app.delete('/deleteItem/', function(req, res) {
  console.log('in DELETE deleteItem route');
  console.log('req.body ->', req.body.listId);
  pool.connect( function( err, connection, done ){
    //check if there was an error
    if( err ){
      console.log( err );
      // respond with error code 400
      res.send( 400 );
    }// end error
    else{
      console.log('connected to db');
      //query to write this list item (req.body) to db
      connection.query( "DELETE from list where id=$1", [req.body.listId]);
      // close connection
      done();
      // res.send
      res.sendStatus(200);
    } // end else
  }); // end pool
});  // end deleteItem DELETE
