"use strict"
const express = require('express');
const baseDir = 'public';

let app = express();
app.use(express.static(baseDir));
app.listen(8000, function(){
    console.log("listen success");
});