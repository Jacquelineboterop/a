const express = require("express");
const mongoose = require("mongoose");
const Note = require("./models/Note");
const PagesView = require("./models/PagesView");
const path = require('path');
const md = require('marked');
const app = express();

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/notes', { useNewUrlParser: true });

const registerPath = async (req, res, next)=> {
  const {path} = req;
  console.log(path)
  if (path) { 
    const result = await PagesView.findOne({path : path}, async(err, result) => {
    })
    if (result) {
      result.view +=1;
        result.save((err) =>{
        if (err) {
          console.log(err)
          return
        }
        console.log('Path Updated')
      })
      
    }
    else {
      const data = new PagesView({ 
        path : path,
        userAgent : req.headers["user-agent"],
        date : Date(),
        view : 1
      })
  
      await data.save((err) =>{
        if (err) {
          console.log(err)
          return
        }
        console.log('Path Created')
      })
    }
  }
  next()
}

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get("/", registerPath, async (req, res) => {
  const notes = await Note.find();
  res.render("index",{ notes: notes } )
});

app.get("/notes/new", registerPath, async (req, res) => {
 const notes = await Note.find();
 res.render("new", { notes: notes });
});

app.post("/notes", async (req, res, next) => {
  const data = {
    title: req.body.title,
    body: req.body.body
  };

  const note = new Note(req.body);
  try {
    await note.save();
  } catch (e) {
    return next(e);
  }

  res.redirect('/');
});

app.get("/notes/:id", registerPath, async (req, res) => {
  const notes = await Note.find();
  const note = await Note.findById(req.params.id);
  res.render("show", { notes: notes, currentNote: note, md: md });
});

app.get("/analytics", registerPath, async (req, res) => {
    PagesView.find().sort({view:-1}).exec((error, elements) =>{
      let trString = "";
      
      elements.map( (value) =>{
          trString += `
              <tr>
                  <td>${value.path}</td>
                  <td>${value.view}</td>
              </tr>
          `            
      })

      res.send(`
      <table>
          <thead>
              <th>Path</th>
              <th>Visits</th>
          </thead>
          <tbody>
              ${trString}
          </tbody>
      </table>
  `);       
  })
 });

app.get("/notes/:id/edit", registerPath, async (req, res, next) => {
  const notes = await Note.find();
  const note = await Note.findById(req.params.id);
  res.render("edit", { notes: notes, currentNote: note });
});

app.patch("/notes/:id", async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);

  note.title = req.body.title;
  note.body = req.body.body;

  try {
    await note.save();
  } catch (e) {
    return next(e);
  }

  res.status(204).send({});
});

app.delete("/notes/:id", async (req, res) => {
  await Note.deleteOne({ _id: req.params.id });
  res.status(204).send({});
});

app.listen(3000, () => console.log("Listening on port 3000 ..."));
