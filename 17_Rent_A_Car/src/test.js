const db = require('../models');

async function probar() {

    const vehiculos = await db.Vehiculo.findAll();

    console.log(vehiculos);

}

probar();