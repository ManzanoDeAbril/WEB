const express = require('express');
const app = express();

const vehiculosRoutes = require('./routes/vehiculosRoutes');

app.use(express.json());

app.use('/vehiculos', vehiculosRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'Rent A Car API funcionando'
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});

const reservasRoutes = require('./routes/reservasRoutes');
app.use('/reservas', reservasRoutes);
