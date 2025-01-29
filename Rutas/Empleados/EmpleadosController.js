const Empleado = require('../../Modelos/Empleado'); // Modelo de empleados
const PdfPrinter = require('pdfmake');
const dayjs = require('dayjs');
class EmpleadosController {
  // Obtener todos los empleados y mostrar sus datos
  static async obtenerTodos(req, res) {
    try {
      // Consultar todos los empleados desde la base de datos
      const empleados = await Empleado.findAll();

      // Convertir los resultados a JSON para enviarlos directamente en la respuesta
      const empleadosDatos = empleados.map((empleado) => ({
        id: empleado.id,
        NOMBRE: empleado.NOMBRE,
        CONTRATO: empleado.CONTRATO,
        PLANTA: empleado.PLANTA,
        FECHA_DE_BAJA: empleado.FECHA_DE_BAJA,
        FECHA_DE_ENTRADA: empleado.FECHA_DE_ENTRADA,
        NSS: empleado.NSS,
        RFC: empleado.RFC,
        CURP: empleado.CURP,
        VENCIMIENTO_DE_CONTRATO: empleado.VENCIMIENTO_DE_CONTRATO,
        PERIODO_DE_PAGO: empleado.PERIODO_DE_PAGO,
        SD: empleado.SD,
        CANTIDAD_CON_LETRA: empleado.CANTIDAD_CON_LETRA,
        SDI: empleado.SDI,
        STATUS: empleado.STATUS,
        DEPARTAMENTO: empleado.DEPARTAMENTO,
        PUESTO: empleado.PUESTO,
        ACTIVIDAD: empleado.ACTIVIDAD,
        PROYECTO: empleado.PROYECTO,
        UBICACION: empleado.UBICACION,
        NOMBRE_DEL_JEFE_DIRECTO: empleado.NOMBRE_DEL_JEFE_DIRECTO,
        EMPRESA: empleado.EMPRESA,
        SINDICALIZADO_CONFIANZA: empleado.SINDICALIZADO_CONFIANZA,
        TURNO: empleado.TURNO,
        SEXO: empleado.SEXO,
        LUGAR_DE_NACIMIENTO: empleado.LUGAR_DE_NACIMIENTO,
        FECHA_DE_NACIMIENTO: empleado.FECHA_DE_NACIMIENTO,
        EDAD: empleado.EDAD,
        NOMBRE_DEL_PADRE: empleado.NOMBRE_DEL_PADRE,
        NOMBRE_DE_LA_MADRE: empleado.NOMBRE_DE_LA_MADRE,
        DIRECCION: empleado.DIRECCION,
        COLONIA: empleado.COLONIA,
        CIUDAD_MUNICIPIO: empleado.CIUDAD_MUNICIPIO,
        ESTADO: empleado.ESTADO,
        CP: empleado.CP,
        ESTADO_CIVIL: empleado.ESTADO_CIVIL,
        TELEFONO: empleado.TELEFONO,
        N_TARJETA: empleado.N_TARJETA,
        CTA_BANCARIA: empleado.CTA_BANCARIA,
        CLABE_INTERBANCARIA: empleado.CLABE_INTERBANCARIA,
        BANCO: empleado.BANCO,
        REGISTRO_PATRONAL_IMSS: empleado.REGISTRO_PATRONAL_IMSS,
        CORREO_ELECTRONICO: empleado.CORREO_ELECTRONICO,
        CALZADO: empleado.CALZADO,
        TALLA_PLAYERA_CAMISA: empleado.TALLA_PLAYERA_CAMISA,
        TALLA_PANTALON: empleado.TALLA_PANTALON,
        TARJETA_DE_VALES: empleado.TARJETA_DE_VALES,
      }));

      // Responder con los datos obtenidos
      res.status(200).json(empleadosDatos);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      res.status(500).json({ message: 'Error al obtener empleados', error: error.message });
    }
  }
static async crearEmpleado(req, res) {
  try {
    // 1. Tomar datos desde req.body
    const {
      NOMBRE,
      CONTRATO,
      PLANTA,
      FECHA_DE_BAJA,
      FECHA_DE_ENTRADA,
      NSS,
      RFC,
      CURP,
      // ...incluye aquí todos los campos adicionales que necesites
    } = req.body;

    // 2. Crear el registro en BD
    const nuevoEmpleado = await Empleado.create({
      NOMBRE,
      CONTRATO,
      PLANTA,
      FECHA_DE_BAJA,
      FECHA_DE_ENTRADA,
      NSS,
      RFC,
      CURP,
      // ...resto de campos
    });

    // 3. Generar el PDF con pdfmake
    // 3a) Fuentes para pdfmake
    const PdfPrinter = require('pdfmake');
    const fonts = {
      Roboto: {
        normal: Buffer.from(
          require('pdfmake/build/vfs_fonts').pdfMake.vfs['Roboto-Regular.ttf'],
          'base64'
        ),
        bold: Buffer.from(
          require('pdfmake/build/vfs_fonts').pdfMake.vfs['Roboto-Medium.ttf'],
          'base64'
        )
      }
    };

    // 3b) Crear instancia de PdfPrinter
    const printer = new PdfPrinter(fonts);

    // 3c) Estructura del documento
    const docDefinition = {
      pageSize: 'LETTER',
      pageMargins: [40, 60, 40, 60],
      content: [
        { text: 'FICHA DE IDENTIFICACIÓN', style: 'header' },
        { text: `\nFecha de Ingreso: ${nuevoEmpleado.FECHA_DE_ENTRADA || ''}`, style: 'subheader' },
        { text: `Nombre del Trabajador: ${nuevoEmpleado.NOMBRE || ''}` },
        { text: `RFC: ${nuevoEmpleado.RFC || ''}` },
        { text: `CURP: ${nuevoEmpleado.CURP || ''}` },
        { text: `NSS: ${nuevoEmpleado.NSS || ''}` },
        // ...agrega aquí el resto de campos que quieras mostrar
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center'
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5]
        }
      }
    };

    // 3d) Crear el PDF en un 'stream'
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    // 3e) Acumular los datos del PDF
    const chunks = [];
    pdfDoc.on('data', (chunk) => {
      chunks.push(chunk);
    });

    pdfDoc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);

      // 4. Enviar el PDF como respuesta
      res.setHeader('Content-Type', 'application/pdf');
      // Opcional: forzar descarga con un nombre específico
      // res.setHeader('Content-Disposition', 'attachment; filename="fichaEmpleado.pdf"');

      res.send(pdfBuffer);
    });

    // Finalizar la creación del PDF
    pdfDoc.end();
    
  } catch (error) {
    console.error('Error al crear empleado:', error);
    return res.status(500).json({
      message: 'Error al crear empleado',
      error: error.message
    });
  }
}


/*PDF*/ 




  static async crearEmpleado(req, res) {
    try {
      // 1. Desestructuramos los datos del body; si no existen, quedarán como undefined
      const {
        NOMBRE,
        DIRECCION,
        TELEFONO,
        LUGAR_DE_NACIMIENTO,
        FECHA_DE_NACIMIENTO,
        NACIONALIDAD,
        ESTADO_CIVIL,
        RFC,
        CURP,
        NOMBRE_DEL_PADRE,
        NOMBRE_DE_LA_MADRE,
        CREDITO_INFONAVIT,
        CTA_BANCARIA,
        N_TARJETA,
        EMPRESA,
        UBICACION,
        INGRESO_MENSUAL_NETO,
        FECHA_DE_INGRESO
      } = req.body;

      // 2. Crear el registro en la base de datos
      //    Si algún valor no viene en req.body, Sequelize guardará null (si allowNull: true).
      const nuevoEmpleado = await Empleado.create({
        NOMBRE,
        DIRECCION,
        TELEFONO,
        LUGAR_DE_NACIMIENTO,
        FECHA_DE_NACIMIENTO,  // Asegúrate de que sea compatible (Date o string)
        ESTADO_CIVIL,
        RFC,
        CURP,
        NOMBRE_DEL_PADRE,
        NOMBRE_DE_LA_MADRE,
        // Si tu modelo tiene un campo para CREDITO_INFONAVIT (boolean) o algo similar, inclúyelo:
        // CREDITO_INFONAVIT,
        CTA_BANCARIA,
        N_TARJETA,
        EMPRESA,
        UBICACION,
        // Si tu modelo tiene un campo para ingreso mensual (e.g. INGRESO_MENSUAL_NETO) y fecha ingreso (e.g. FECHA_DE_ENTRADA):
        // Ajusta según los nombres que uses en tu modelo. Ejemplo:
        FECHA_DE_ENTRADA: FECHA_DE_INGRESO
      });

      // 3. Preparar la generación del PDF
      const fonts = {
        Roboto: {
          normal: Buffer.from(
            require('pdfmake/build/vfs_fonts').pdfMake.vfs['Roboto-Regular.ttf'],
            'base64'
          ),
          bold: Buffer.from(
            require('pdfmake/build/vfs_fonts').pdfMake.vfs['Roboto-Medium.ttf'],
            'base64'
          )
        }
      };
      const printer = new PdfPrinter(fonts);

      // Para formatear "Día / Mes / Año" de la fecha de nacimiento
      let diaNacimiento = '';
      let mesNacimiento = '';
      let anioNacimiento = '';
      if (nuevoEmpleado.FECHA_DE_NACIMIENTO) {
        const fechaNac = dayjs(nuevoEmpleado.FECHA_DE_NACIMIENTO);
        if (fechaNac.isValid()) {
          diaNacimiento = fechaNac.format('DD');
          mesNacimiento = fechaNac.format('MM');
          anioNacimiento = fechaNac.format('YYYY');
        }
      }

      // Convertimos el crédito Infonavit a "Sí" o "No", manejando caso undefined
      const creditoInfonavitTxt = (CREDITO_INFONAVIT === true)
        ? 'Sí'
        : (CREDITO_INFONAVIT === false ? 'No' : '');

      // 4. Definir el contenido del PDF
      const docDefinition = {
        pageSize: 'LETTER',
        pageMargins: [40, 60, 40, 60],
        content: [
          { text: 'Vianko Logo', style: 'logo', margin: [0, 0, 0, 10] },
          { text: 'FICHA DE IDENTIFICACIÓN', style: 'header' },
          {
            text: `Fecha de Ingreso:\n${FECHA_DE_INGRESO || ''}`,
            style: 'field'
          },
          {
            text: `Nombre del Trabajador:\n${nuevoEmpleado.NOMBRE || ''}`,
            style: 'field'
          },
          {
            text: `Dirección:\n${nuevoEmpleado.DIRECCION || ''}`,
            style: 'field'
          },
          {
            text: `Tel:\n${nuevoEmpleado.TELEFONO || ''}`,
            style: 'field'
          },
          {
            text: `Lugar de Nacimiento:\n${nuevoEmpleado.LUGAR_DE_NACIMIENTO || ''}`,
            style: 'field'
          },
          // Fecha de nacimiento descompuesta
          { text: 'Fecha de Nacimiento:', style: 'field' },
          {
            columns: [
              { width: 'auto', text: `Día: ${diaNacimiento}`, margin: [0, 0, 15, 0] },
              { width: 'auto', text: `Mes: ${mesNacimiento}`, margin: [0, 0, 15, 0] },
              { width: 'auto', text: `Año: ${anioNacimiento}`, margin: [0, 0, 15, 0] },
            ]
          },
          {
            text: `Nacionalidad:\n${NACIONALIDAD || ''}`,
            style: 'field'
          },
          {
            text: `Estado Civil:\n${nuevoEmpleado.ESTADO_CIVIL || ''}`,
            style: 'field'
          },
          {
            text: `RFC:\n${nuevoEmpleado.RFC || ''}`,
            style: 'field'
          },
          {
            text: `CURP:\n${nuevoEmpleado.CURP || ''}`,
            style: 'field'
          },
          {
            text: `Nombre del Padre:\n${nuevoEmpleado.NOMBRE_DEL_PADRE || ''}`,
            style: 'field'
          },
          {
            text: `Nombre de la Madre:\n${nuevoEmpleado.NOMBRE_DE_LA_MADRE || ''}`,
            style: 'field'
          },
          {
            text: `Tiene Crédito Infonavit:\n${creditoInfonavitTxt}`,
            style: 'field'
          },
          {
            text: `Cta. Bancaria:\n${nuevoEmpleado.CTA_BANCARIA || ''}`,
            style: 'field'
          },
          {
            text: `Nº Tarjeta:\n${nuevoEmpleado.N_TARJETA || ''}`,
            style: 'field'
          },
          {
            text: `Empresa:\n${nuevoEmpleado.EMPRESA || ''}`,
            style: 'field'
          },
          {
            text: `Ubicación:\n${nuevoEmpleado.UBICACION || ''}`,
            style: 'field'
          },
          {
            text: `Ingreso Mensual Neto:\n${INGRESO_MENSUAL_NETO || ''}`,
            style: 'field'
          },

          // Sección Check List
          { text: '\nCheck List:', style: 'subheader' },
          {
            ul: [
              'CV/Solicitud de empleo',
              'Identificación oficial',
              'Acta de nacimiento',
              'NSS',
              'Constancia de situación fiscal',
              'Comprobante de domicilio',
              'Comprobante de estudios',
              'Carta de recomendación laboral',
              'Carta de no antecedentes penales',
              'Carátula de contrato BANAMEX',
              'Carta oferta',
              'Consentimiento seguro de vida',
              'Hoja infonavit',
              'Contrato prueba',
              'Contrato indeterminado o proyecto',
              'Descriptivo de puesto',
            ]
          }
        ],
        styles: {
          logo: {
            fontSize: 12,
            bold: true,
            alignment: 'left'
          },
          header: {
            fontSize: 16,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 15]
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          field: {
            margin: [0, 5, 0, 5]
          }
        }
      };

      // 5. Crear el PDF en un 'stream' y acumularlo en un buffer
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks = [];
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);

        // 6. Enviar el PDF como respuesta HTTP
        res.setHeader('Content-Type', 'application/pdf');
        // Opcional: forzar la descarga con:
        // res.setHeader('Content-Disposition', 'attachment; filename="fichaEmpleado.pdf"');
        res.send(pdfBuffer);
      });
      pdfDoc.end();

    } catch (error) {
      console.error('Error al crear empleado:', error);
      return res.status(500).json({
        message: 'Error al crear empleado',
        error: error.message
      });
    }
  }


}
 


module.exports = EmpleadosController;
