import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

let names = [];
let tasks = [];


app.get('/', (req, res) => {
    res.render('index', { names, tasks });
});


app.get('/greet', (req, res) => {
    const name = req.query.name;
    if (name) {
        names.push(name);
        console.log(names);
        res.redirect('/');
    } else {
        res.render('index', { names, tasks, error: 'Nombre no válido.' });
    }
});


app.get('/greet/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < names.length) {
        res.render('wazzup', { name: names[index] });
    } else {
        res.render('index', { names, tasks, error: 'Índice no válido.' });
    }
});


app.get('/task', (req, res) => {
    res.json(tasks);
});


app.post('/task', (req, res) => {
    const task = req.body.task;
    if (task) {
        tasks.push(task);
    }
    res.redirect('/');
});


app.post('/task/:index/delete', (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < tasks.length) {
        tasks.splice(index, 1);
    }
    res.redirect('/');
});


app.post('/task/:index/up', (req, res) => {
    const index = parseInt(req.params.index);
    if (index > 0 && index < tasks.length) {
        const task = tasks[index];
        tasks.splice(index, 1);
        tasks.splice(index - 1, 0, task);
    }
    res.redirect('/');
});


app.post('/task/:index/down', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < tasks.length - 1) {
        const task = tasks[index];
        tasks.splice(index, 1);
        tasks.splice(index + 1, 0, task);
    }
    res.redirect('/');
});


app.put('/greet/:name', (req, res) => {
    const name = req.params.name;
    if (name) {
        names.push(name);
        res.json(names);
    } else {
        res.status(400).json({ error: 'Nombre no válido.' });
    }
});


app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
