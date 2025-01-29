const multer = require('multer');
const path = require('path');

// Configuración de Multer para manejar la subida del archivo
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // Límite de 50MB
  fileFilter: (req, file, cb) => {
    // Extensiones y tipos MIME permitidos
    const filetypes = /xlsx|xls/;
    const mimetype = filetypes.test(file.mimetype); // Validar tipo MIME
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Validar extensión

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error(`Formato de archivo no válido: ${file.originalname}. Solo se aceptan archivos .xlsx o .xls.`));
  },
});

module.exports = upload;
