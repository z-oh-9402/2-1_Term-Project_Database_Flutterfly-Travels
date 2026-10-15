const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 MB
    }
});

const deleting = async (photoPath) => {
    if(photoPath) {
        fs.unlink(photoPath, (err) => {
            if (err) {
                console.error('Error deleting profile picture:', err);
            } else {
                console.log('Profile picture deleted successfully');
            }
        });
    }
}

exports.upload = upload;
exports.deleting = deleting;