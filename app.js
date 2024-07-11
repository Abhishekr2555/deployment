const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors=require('cors')
const path=require('path')
const authRoute = require('./Routes/auth.route');
const postRoute = require('./Routes/post.route');
const messageRoute = require('./Routes/message.route');
const chatRoute = require('./Routes/chat.route');
const userRoute = require('./Routes/user.route');
const testRoute = require('./Routes/test.route');
const cookieParser = require('cookie-parser');

const clienturl=process.env.CLIENT_URL

// Middleware to parse JSON bodies
app.use(cors({origin:clienturl,credentials:true}))
app.use(cookieParser())
app.use(bodyParser.json());
app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);
app.use('/api/chat', chatRoute);
app.use('/api/message', messageRoute);
app.use('/api/user', userRoute);
app.use('/api/test', testRoute);

app.listen(8800, () => {
    console.log('server started on port 8800');
});

app.use(express.static(path.join(__dirname, './Client/build')));

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'./Client/build/index.html'))
})

app.use(bodyParser.json({ type: 'application/*+json' }))

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }))

module.exports = app;
