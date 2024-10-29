import express from "express";
import fs from "fs";
import bodyParser from "body-parser";


const app = express();
const port = 3000;

let data = [];
let oldid = 0;

try{
    const rawData = fs.readFileSync("data.json","utf-8");
    data = JSON.parse(rawData);
    console.log(data);
    if (data.length>0)
    {
        oldid = data[data.length - 1].id;
    }
}
catch(err)
{
    console.log("Error Reading JSON FILE ",err);
}


app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("index.ejs",{
        "data" : data
    });
    const del = req.body.delete;
    console.log(del);
})

app.post("/submit", (req,res) => {
    const title = req.body.title;
    if (title){
        const newData = {
            "id" : ++oldid,
            "title" : title,
            "date" : new Date()
        }
        data.push(newData);
        fs.writeFileSync("data.json",JSON.stringify(data,null,2));
    }
    res.redirect("/");
})

app.post("/edit",(req,res)=>{
    const updId = parseInt(req.body.id);
    const updDate = req.body.title;

    const filterData = data.findIndex(user => user.id == updId);
    if(filterData != -1){
        data[filterData].title = updDate;
        try {
            fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
        } catch (err) {
            console.error(err);
            return res.status(500).send("Error saving data");
        }
    }
    else{
        return res.status(404).send("No Task Found");
    }
    res.redirect("/");
})


app.post("/delete", (req, res) => {
    const delId = parseInt(req.body.id); // Get the ID from the hidden input
    console.log(`Deleting item with ID: ${delId}`);

    data = data.filter(item => item.id !== delId);
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

    res.redirect("/");
});

app.listen(port, ()=>{
    console.log(`Server Running on Port ${port}`);
})