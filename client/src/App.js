import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [video, setVideo] = useState(null);
    const [vfx, setVfx] = useState('none');
    const [previewUrl, setPreviewUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVideoUpload = (event) => {
        setVideo(event.target.files[0]);
        setPreviewUrl('');
        setError('');
    };

    const handleVfxChange = (event) => {
        setVfx(event.target.value);
    };

    const handleSubmit = async () => {
        if (!video) {
            setError('Please upload a video.');
            return;
        }
        setIsLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('video', video);
        formData.append('vfx', vfx);

        try {
            const response = await axios.post('/api/process-video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPreviewUrl(response.data.previewUrl);
        } catch (err) {
            setError('Error processing video');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>Video VFX App</h1>
            <input type="file" onChange={handleVideoUpload} accept="video/*" />
            <select onChange={handleVfxChange}>
                <option value="none">Select VFX</option>
                <option value="vfx1">VFX 1</option>
                <option value="vfx2">VFX 2</option>
                <option value="vfx3">VFX 3</option>
                {/* Add more VFX options here */}
            </select>
            <button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Update Video'}
            </button>
            {error && <p className="error">{error}</p>}
            {previewUrl && (
                <div>
                    <video src={previewUrl} controls />
                    <a href={previewUrl} download>Download Processed Video</a>
                </div>
            )}
        </div>
    );
}

export default App;
