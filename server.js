const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Cria a pasta uploads se não existir
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve os arquivos da pasta atual (index.html, estudio.html, etc)
app.use(express.static(__dirname));
// Serve a pasta de vídeos para o navegador conseguir abrir o vídeo
app.use('/uploads', express.static('uploads'));
app.use(express.json());

// ROTA CORRIGIDA: Adicionamos o 'res' nos parênteses abaixo
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Erro no upload: Nenhum arquivo recebido.');
    }
    
    // Retorna o link real para o seu estudio.html
    res.json({ url: `/uploads/${req.file.filename}` });
});

app.listen(port, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${port}`);
});
