const express = require('express');
const multer = require('multer');
const path = require('path');
const ExcelJS = require('exceljs');
const moment = require('moment'); // Librería para manejo de fechas
const Empleado = require('../../Modelos/Empleado');

const router = express.Router();

// Configuración de almacenamiento con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const extname = /\.(xlsx|xls)$/i.test(file.originalname.toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error('Formato de archivo no válido. Solo se aceptan .xlsx y .xls'));
  },
});

// Función genérica para validar campos
const validarCampo = (campo, nombreCampo, fila, errores, regex = null) => {
  const valor = campo ? campo.toString().trim() : '';
  if (!valor) {
    errores.push(`Fila ${fila}: El campo "${nombreCampo}" está vacío o nulo.`);
    return null;
  }
  if (regex && !regex.test(valor)) {
    errores.push(`Fila ${fila}: El campo "${nombreCampo}" no cumple con el formato esperado.`);
    return null;
  }
  return valor;
};

// Función para procesar fechas con `moment`
const procesarFecha = (campoFecha, nombreCampo, fila, errores) => {
  if (!campoFecha) {
    errores.push(`Fila ${fila}: El campo "${nombreCampo}" está vacío o nulo.`);
    return null;
  }

  const fecha = moment(campoFecha, ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'D [de] MMMM [de] YYYY'], true);
  if (!fecha.isValid()) {
    errores.push(`Fila ${fila}: El campo "${nombreCampo}" no tiene un formato válido (${campoFecha}).`);
    return null;
  }
  return fecha.toDate(); // Retorna como objeto Date
};

// Función para simular procesamiento lento
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Ruta para cargar y procesar el archivo Excel
router.post('/cargar', upload.single('archivo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No se subió ningún archivo' });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];

    const sheetData = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Saltar encabezados
      const rowData = {};
      worksheet.getRow(1).eachCell((cell, colNumber) => {
        const header = worksheet.getRow(1).getCell(colNumber).value;
        rowData[header] = row.getCell(colNumber).value || null;
      });
      sheetData.push(rowData);
    });

    console.log(`Total de filas a procesar: ${sheetData.length}`);

    const empleados = [];
    const errores = [];
    for (const [index, row] of sheetData.entries()) {
      console.log(`\nProcesando fila ${index + 1}...`);

      const empleado = {
        NOMBRE: validarCampo(row.NOMBRE, 'NOMBRE', index + 1, errores),
        CONTRATO: validarCampo(row.CONTRATO, 'CONTRATO', index + 1, errores),
        PLANTA: validarCampo(row.PLANTA, 'PLANTA', index + 1, errores),
        FECHA_DE_BAJA: procesarFecha(row.FECHA_DE_BAJA, 'FECHA DE BAJA', index + 1, errores),
        FECHA_DE_ENTRADA: procesarFecha(row.FECHA_DE_ENTRADA, 'FECHA DE ENTRADA', index + 1, errores),
        NSS: validarCampo(row.NSS, 'NSS', index + 1, errores, /^\d{11}$/),
        RFC: validarCampo(row.RFC, 'RFC', index + 1, errores, /^[A-Z]{4}\d{6}[A-Z0-9]{3}$/),
        CURP: validarCampo(row.CURP, 'CURP', index + 1, errores, /^[A-Z]{4}\d{6}[HM][A-Z]{5}\d{2}$/),
        VENCIMIENTO_DE_CONTRATO: validarCampo(row['VENCIMIENTO DE CONTRATO'], 'VENCIMIENTO DE CONTRATO', index + 1, errores),
        PERIODO_DE_PAGO: validarCampo(row['PERIODO DE PAGO'], 'PERIODO DE PAGO', index + 1, errores),
        SD: validarCampo(row.SD, 'SD', index + 1, errores, /^[0-9]+(\.[0-9]{1,2})?$/),
        CANTIDAD_CON_LETRA: validarCampo(row['CANTIDAD CON LETRA'], 'CANTIDAD CON LETRA', index + 1, errores),
        SDI: validarCampo(row.SDI, 'SDI', index + 1, errores, /^[0-9]+(\.[0-9]{1,2})?$/),
        STATUS: validarCampo(row.STATUS, 'STATUS', index + 1, errores),
        DEPARTAMENTO: validarCampo(row.DEPARTAMENTO, 'DEPARTAMENTO', index + 1, errores),
        PUESTO: validarCampo(row.PUESTO, 'PUESTO', index + 1, errores),
        ACTIVIDAD: validarCampo(row.ACTIVIDAD, 'ACTIVIDAD', index + 1, errores),
        PROYECTO: validarCampo(row.PROYECTO, 'PROYECTO', index + 1, errores),
        UBICACION: validarCampo(row['UBICACIÓN'], 'UBICACIÓN', index + 1, errores),
        NOMBRE_DEL_JEFE_DIRECTO: validarCampo(row['NOMBRE DEL JEFE DIRECTO'], 'NOMBRE DEL JEFE DIRECTO', index + 1, errores),
        EMPRESA: validarCampo(row.EMPRESA, 'EMPRESA', index + 1, errores),
        SINDICALIZADO_CONFIANZA: validarCampo(row['SINDICALIZADO/CONFIANZA'], 'SINDICALIZADO/CONFIANZA', index + 1, errores),
        TURNO: validarCampo(row.TURNO, 'TURNO', index + 1, errores),
        SEXO: validarCampo(row.SEXO, 'SEXO', index + 1, errores),
        LUGAR_DE_NACIMIENTO: validarCampo(row['LUGAR DE NACIMIENTO'], 'LUGAR DE NACIMIENTO', index + 1, errores),
        FECHA_DE_NACIMIENTO: procesarFecha(row['FECHA DE NACIMIENTO'], 'FECHA DE NACIMIENTO', index + 1, errores),
        EDAD: validarCampo(row.EDAD, 'EDAD', index + 1, errores, /^\d+$/),
        NOMBRE_DEL_PADRE: validarCampo(row['NOMBRE DEL PADRE'], 'NOMBRE DEL PADRE', index + 1, errores),
        NOMBRE_DE_LA_MADRE: validarCampo(row['NOMBRE DE LA MADRE'], 'NOMBRE DE LA MADRE', index + 1, errores),
        DIRECCION: validarCampo(row['DIRECCIÓN (CALLE,NÚMERO)'], 'DIRECCIÓN', index + 1, errores),
        COLONIA: validarCampo(row.COLONIA, 'COLONIA', index + 1, errores),
        CIUDAD_MUNICIPIO: validarCampo(row['CIUDAD/MUNICIPIO'], 'CIUDAD/MUNICIPIO', index + 1, errores),
        ESTADO: validarCampo(row.ESTADO, 'ESTADO', index + 1, errores),
        CP: validarCampo(row['C.P.'], 'C.P.', index + 1, errores, /^\d{5}$/),
        ESTADO_CIVIL: validarCampo(row['Estado Civil'], 'Estado Civil', index + 1, errores),
        TELEFONO: validarCampo(row.Teléfono, 'Teléfono', index + 1, errores, /^\d{10}$/),
        N_TARJETA: validarCampo(row['N° TARJETA'], 'N° TARJETA', index + 1, errores),
        CTA_BANCARIA: validarCampo(row['Cta. Banacaria'], 'Cta. Banacaria', index + 1, errores),
        CLABE_INTERBANCARIA: validarCampo(row['Clabe Interbancaria'], 'Clabe Interbancaria', index + 1, errores, /^\d{18}$/),
        BANCO: validarCampo(row.BANCO, 'BANCO', index + 1, errores),
      };

      console.log(`Datos procesados de la fila ${index + 1}:`, empleado);
      await delay(200); // Retardo de 200ms entre procesamientos
      empleados.push(empleado);
    }

    console.log('\nErrores detectados:', errores);

    const batchSize = 50; // Reducir tamaño del lote para mayor control
    for (let i = 0; i < empleados.length; i += batchSize) {
      const batch = empleados.slice(i, i + batchSize);
      console.log(`Insertando filas ${i + 1} a ${i + batch.length} en la base de datos...`);
      await Empleado.bulkCreate(batch);
    }

    res.status(200).json({
      message: 'Datos cargados exitosamente en la tabla Empleados',
      totalProcesados: empleados.length,
      errores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al procesar el archivo', error: error.message });
  }
});

module.exports = router;
