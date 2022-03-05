const express = require('express');
const app = express();

app.get('/', async (req, res) => {
    res.send('consumer_server');
})
app.listen(3000);