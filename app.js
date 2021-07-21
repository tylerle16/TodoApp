// require modules

const http = require('http')
const express = require('express');
const db = require('./modules/db')

// set up  server 
const app = express();
const server = http.createServer(app);

// include middleware (static files, )
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// make new todo entry
let id = 6;

// get all todos
app.get('/api/v1/todos', (req, res) => {
    res.json(db.todos)
});



// create new todo by id
app.post('/api/v1/todos', (req, res) => {
    // console.log(req.body)
    // if incorrect response responds with error
    if(!req.body || !req.body.text) {
        res.status(422).json({
            error: "Must include todo text"
        })
        return
    }
    const newtodo = {
        id: id++,
        text: req.body.text,
        completed: false
    }
    // adds to todo list
    db.todos.push(newtodo)
    // creates response with new json data
    res.status(201).json(newtodo)

})




app.patch('/api/v1/todos/:id', (req, res) => {
    //  function to get the id from route handle
    // parseint changes response into a number
    const id = parseInt(req.params.id)




    // function to find the existing todo 
    const todoIndex = db.todos.findIndex((todo) => {
        return todo.id === id
    })
    if(todoIndex === -1){
        res.json(404).json({ error: 'could not find todo with that id'})
    }
    // update the todo
    if (req.body && req.body.text){ 
    db.todos[todoIndex].text = req.body.text} 
    if (req.body && req.body.completed !== undefined){
    db.todos[todoIndex].completed = req.body.completed  
    }
    
    // respond with updated files
    res.json(db.todos[todoIndex])
})



// delete existing todo by id

app.delete('/api/v1/todos/:id', (req, res) => {
    // get the id
    const id = parseInt(req.params.id)
    // find the existing todo
const todoIndex = db.todos.findIndex((todo) => {
    return todo.id === id
})

//  if we cant find the todo with that id, respond with 404
if(todoIndex === -1){
    res.json(404).json({ error: 'could not find todo with that id'})
}
    // delete the todo
db.todos.splice(todoIndex, 1)


res.status(204).json()
    // respond with 204 and empty response
})





// server listen 
server.listen(3000, '127.0.0.1', () => { 
    console.log('Server Listening on http//:127.0.0.1:3000')
}) 