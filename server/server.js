const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use('/processed', express.static(path.join(__dirname, 'processed')));

app.post('/api/process-video', upload.single('video'), (req, res) => {
    const vfx = req.body.vfx;
    const videoPath = path.join(__dirname, req.file.path);
    const outputPath = path.join(__dirname, 'processed', `${req.file.filename}_processed.mp4`);

    let ffmpegCommand = `ffmpeg -i ${videoPath} -vf "your_vfx_here" ${outputPath}`;

    // Modify ffmpegCommand based on selected VFX
    if (vfx === 'vfx1') {
        ffmpegCommand = `ffmpeg -i ${videoPath} -vf "drawbox=y=0:color=red:t=fill" ${outputPath}`;
    } else if (vfx === 'vfx2') {
        ffmpegCommand = `ffmpeg -i ${videoPath} -vf "hue=s=0" ${outputPath}`; // Grayscale
    } else if (vfx === 'vfx3') {
        ffmpegCommand = `ffmpeg -i ${videoPath} -vf "eq=brightness=0.1" ${outputPath}`; // Brightness
    }

    exec(ffmpegCommand, (error) => {
        if (error) {
            return res.status(500).send('Error processing video');
        }
        res.json({ previewUrl: `/processed/${path.basename(outputPath)}` });
        
        // Clean up uploaded file
        fs.unlink(videoPath, (err) => {
            if (err) console.error('Error deleting uploaded file', err);
        });
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
