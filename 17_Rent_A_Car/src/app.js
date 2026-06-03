const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const vehiculosRoutes = require('./routes/vehiculosRoutes');
const reservasRoutes = require('./routes/reservasRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');

app.use('/vehiculos', vehiculosRoutes);
app.use('/reservas', reservasRoutes);
app.use('/usuarios', usuariosRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'Rent A Car API funcionando'
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});