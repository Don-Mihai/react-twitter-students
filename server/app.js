const express = require("express");
const uuid = require('uuid')
const fs = require("fs");
const mv = require('mv');

const app = express();
const jsonParser = express.json();

app.use(express.static(__dirname + "/public"));

app.post("/api/users", jsonParser, function (req, res) {
      
    if(!req.body) return res.sendStatus(400);
      
    const userName = req.body.name;
    const userAge = req.body.age;
    let user = {name: userName, age: userAge};
      
    let data = fs.readFileSync(filePath, "utf8");
    let users = JSON.parse(data);
      
    // находим максимальный id
    const id = Math.max.apply(Math,users.map(function(o){return o.id;}))
    // увеличиваем его на единицу
    user.id = id+1;
    // добавляем пользователя в массив
    users.push(user);
    data = JSON.stringify(users);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("users.json", data);
    res.send(user);
});


app.use('/', (req, res) => {
    try {
        const file = req?.files.file
       
        const avatarName = uuid.v4() + '.jpg'
        console.log(avatarName, file)
        file.mv(__dirname + '\\' + avatarName)
        return res.statusCode(200).json({message: 'Загрузка изображения удалась'})
        
    } catch(e) {
        console.log(e)
        return res.status(400).json({message: 'Загрузка изображения не удалась'})
    }
})
app.listen(3002, function(){
    console.log("Сервер ожидает подключения...");
});