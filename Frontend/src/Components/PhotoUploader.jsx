import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { TbCameraPlus } from "react-icons/tb";
import { ImCross } from 'react-icons/im';
import '../Styles/photo-uploader.css';

const LONG_PRESS_MS = 350;
// moving further than this before the hold registers cancels it
const MOVE_TOLERANCE_PX = 6;
const MAX_OUTPUT_PX = 1024;
const STAGE_MAX_WIDTH = 460;
const STAGE_MAX_HEIGHT = 340;

const loadImage = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
});

// The largest square in the middle of a width x height image: its side is the shorter of the two
const centeredCrop = (width, height) => {
    const size = Math.min(width, height);
    return { x: (width - size) / 2, y: (height - size) / 2, size };
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// The chosen square of the photo as a new file, which is what gets uploaded
const cropToFile = async (source, crop) => {
    const img = await loadImage(source.url);
    const side = Math.round(Math.min(crop.size, MAX_OUTPUT_PX));
    const canvas = document.createElement('canvas');
    canvas.width = side;
    canvas.height = side;
    canvas.getContext('2d').drawImage(img, crop.x, crop.y, crop.size, crop.size, 0, 0, side, side);
    const type = ['image/png', 'image/webp'].includes(source.file.type) ? source.file.type : 'image/jpeg';
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, 0.92));
    return new File([blob], source.file.name || 'photo', { type });
}

// "Position your photo": the whole photo with a circle on its centered square. Holding the photo shows all of it
// (shaded outside the circle), and dragging moves the circle. Save hands back the chosen square.
const PhotoPositioner = ({ file, onSave, onCancel, onChooseAnother }) => {
    const [source, setSource] = useState(null);
    const [crop, setCrop] = useState(null);
    const [isHolding, setIsHolding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const press = useRef(null);

    useEffect(() => {
        let ignore = false;
        const url = URL.createObjectURL(file);
        loadImage(url).then((img) => {
            if(ignore)
            {
                return;
            }
            setSource({ file, url, width: img.naturalWidth, height: img.naturalHeight });
            setCrop(centeredCrop(img.naturalWidth, img.naturalHeight));
        }).catch(() => {
            // a load abandoned by the cleanup below fails once its URL is released; only a real failure closes the popup
            if(!ignore)
            {
                onCancel();
            }
        });
        return () => {
            ignore = true;
            URL.revokeObjectURL(url);
        };
    }, [file, onCancel]);

    // Escape closes it, like the other popups
    useEffect(() => {
        const onKey = (e) => { if(e.key === 'Escape') onCancel(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onCancel]);

    // the whole photo, fitted into the stage
    const maxWidth = Math.min(STAGE_MAX_WIDTH, window.innerWidth - 80);
    const scale = source ? Math.min(maxWidth / source.width, STAGE_MAX_HEIGHT / source.height) : 1;

    const handlePointerDown = (e) => {
        if(e.button !== 0 || !crop)
        {
            return;
        }
        // only a press inside the circle picks it up
        const stage = e.currentTarget.getBoundingClientRect();
        const radius = crop.size * scale / 2;
        const centerX = stage.left + crop.x * scale + radius;
        const centerY = stage.top + crop.y * scale + radius;
        if(Math.hypot(e.clientX - centerX, e.clientY - centerY) > radius)
        {
            return;
        }
        e.currentTarget.setPointerCapture(e.pointerId);
        press.current = { startX: e.clientX, startY: e.clientY, lastX: e.clientX, lastY: e.clientY, held: false };
        press.current.timer = setTimeout(() => {
            press.current.held = true;
            setIsHolding(true);
        }, LONG_PRESS_MS);
    }

    const handlePointerMove = (e) => {
        const p = press.current;
        if(!p)
        {
            return;
        }
        if(p.held)
        {
            const dx = (e.clientX - p.lastX) / scale;
            const dy = (e.clientY - p.lastY) / scale;
            setCrop(previous => ({
                ...previous,
                x: clamp(previous.x + dx, 0, source.width - previous.size),
                y: clamp(previous.y + dy, 0, source.height - previous.size),
            }));
        }
        else if(Math.hypot(e.clientX - p.startX, e.clientY - p.startY) > MOVE_TOLERANCE_PX)
        {
            clearTimeout(p.timer);
            press.current = null;
            return;
        }
        p.lastX = e.clientX;
        p.lastY = e.clientY;
    }

    const handlePointerUp = () => {
        if(press.current)
        {
            clearTimeout(press.current.timer);
        }
        press.current = null;
        setIsHolding(false);
    }

    const save = async () => {
        setIsSaving(true);
        const centered = centeredCrop(source.width, source.height);
        // left in the middle, the original photo shows the same everywhere (photos are shown as their centered square)
        const isCentered = Math.abs(crop.x - centered.x) < 0.5 && Math.abs(crop.y - centered.y) < 0.5;
        onSave(isCentered ? file : await cropToFile(source, crop));
    }

    return createPortal(
        <div className='photo-positioner-backdrop' onPointerDown={(e) => { if(e.target === e.currentTarget) onCancel(); }}>
            <div className='photo-positioner' role='dialog' aria-label='Position your photo'>
                <button type='button' className='photo-positioner-close' aria-label='Close' onClick={onCancel}><ImCross/></button>
                <h3>Position your photo</h3>
                <p className='photo-positioner-hint'>Double click the circle, then drag it to position.</p>

                {source && crop ?
                <div className={'photo-positioner-stage' + (isHolding ? ' holding' : '')}
                     style={{ width: source.width * scale, height: source.height * scale }}
                     onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
                     onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}
                     onContextMenu={(e) => e.preventDefault()}>
                    <img src={source.url} alt='' draggable={false}/>
                    <div className='photo-positioner-circle' style={{
                        left: crop.x * scale,
                        top: crop.y * scale,
                        width: crop.size * scale,
                        height: crop.size * scale,
                    }}/>
                </div>
                :
                <div className='photo-positioner-loading'>Loading...</div>}

                <div className='photo-positioner-actions'>
                    <button type='button' className='photo-positioner-link' onClick={onChooseAnother}>Choose another photo</button>
                    <span className='photo-positioner-spacer'/>
                    <button type='button' className='photo-positioner-btn' onClick={onCancel}>Cancel</button>
                    <button type='button' className='photo-positioner-btn primary' disabled={!crop || isSaving} onClick={save}>Save</button>
                </div>
            </div>
        </div>,
        document.body
    );
}

PhotoPositioner.propTypes = {
    file: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChooseAnother: PropTypes.func.isRequired,
};

// A round profile photo picker. Choosing a photo, or clicking the one already there, opens "Position your photo",
// where the circle can be moved over the photo; Save hands setSelectedFile the chosen square (or the original
// photo, when left in the middle).
// height: the circle's size in px; or fill: the circle grows to its parent's height (the camera icon keeps its size)
const PhotoUploader = ({height, fill, selectedFile, setSelectedFile}) => {
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    // the photo being positioned in the popup
    const [pending, setPending] = useState(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if(!selectedFile)
        {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [selectedFile]);

    const openPicker = () => fileInputRef.current.click();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        event.target.value = '';
        if(file && file.type.startsWith('image/'))
        {
            setPending(file);
        }
    };

    const closePositioner = useRef(() => setPending(null)).current;

    const size = fill ? '100%' : `${height}px`;

    return (
        <div className='photo-uploader' style={{marginBottom: fill ? '0px' : '15px', height: fill ? '100%' : undefined}}>
            <div className='photo-uploader-circle'
                 style={{height: size, width: fill ? 'auto' : size}}
                 title={selectedFile ? 'Click to position your photo or choose another' : 'Choose a photo'}
                 onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}
                 onClick={() => selectedFile ? setPending(selectedFile) : openPicker()}>
                <img className='photo-uploader-image' src={previewUrl ?? '/default_profile_pic.jpeg'} alt='' draggable={false}/>
                {isHovering && <div className='photo-uploader-camera'><TbCameraPlus/></div>}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
            />

            {pending &&
                <PhotoPositioner file={pending} onCancel={closePositioner} onChooseAnother={openPicker}
                                 onSave={(file) => { setPending(null); if(file !== selectedFile) setSelectedFile(file); }}/>}
        </div>
    );
};

PhotoUploader.propTypes = {
    height: PropTypes.number,
    fill: PropTypes.bool,
    selectedFile: PropTypes.object,
    setSelectedFile: PropTypes.func.isRequired,
};

export default PhotoUploader;
