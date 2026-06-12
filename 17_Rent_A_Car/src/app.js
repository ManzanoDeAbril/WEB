const express = require('express');
const cors = require('cors');

const { sequelize } = require('../models');

const app = express();

app.use(cors());
app.use(express.json());

const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const vehiculosRoutes = require('./routes/vehiculosRoutes');
const reservasRoutes = require('./routes/reservasRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const panelRoutes     = require('./routes/panelRoutes'); 
const extrasRoutes = require('./routes/extrasRoutes');
const multasRoutes = require('./routes/multasRoutes');
const authRoutes = require('./routes/authRoutes');   



app.use('/vehiculos', vehiculosRoutes);
app.use('/reservas', reservasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/panel',     panelRoutes);
app.use('/extras', extrasRoutes);
app.use('/multas', multasRoutes);
app.use('/auth', authRoutes); 

// 404
app.use(notFound);

// Error Handler
app.use(errorHandler);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'Rent A Car API funcionando'
    });
});


sequelize.authenticate()
    .then(() => {
        console.log('Conexión Sequelize exitosa');

        app.listen(3000, () => {
            console.log('Servidor corriendo en puerto 3000');
        });
    })
    .catch(error => {
        console.error('Error de conexión Sequelize:', error);
    });