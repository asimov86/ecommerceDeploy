const fs = require("fs");
const multer = require('multer');
const path = require('path');

// Función para definir la carpeta de destino según el tipo de archivo
const storage = (type) => multer.diskStorage({
    destination: (req, file, cb) => {
        let dest = '';
        if (type === 'profile') {
            dest = './uploads/profiles';
        } 
        if (type === 'product') {
            dest = './uploads/products';
        }
        if (type === 'document') {
            dest = './uploads/documents';
        }
        // Crea la carpeta si no existe
        fs.mkdir(dest, { recursive: true }, (err) => {
            if (err) throw err;
            cb(null, dest);
        });
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Middleware de Multer para procesar la subida de archivos
const upload = (type) => multer({
    storage: storage(type),
    limits: {
        fileSize: 10 * 1024 * 1024, // Límite de tamaño de archivo: 10MB
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf|docx/; // Tipos de archivos permitidos
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Solo se permiten archivos JPEG, JPG, PNG, PDF o DOCX');
        }
    }
}).array('documents', 5); // 'documents' debe coincidir con el nombre del campo del formulario

module.exports = { upload };