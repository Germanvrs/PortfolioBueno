import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/calculate-bmi', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);
    
    if (!weight || !height) {
        return res.status(400).send('Por favor ingrese valores válidos.');
    }

    const bmi = (weight / (height * height)) * 10000; 
    res.send(`Su BMI es: ${bmi.toFixed(2)}`);
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
