import { useRef} from 'react';
import PropTypes from 'prop-types';
import { TbCameraPlus } from "react-icons/tb";

// height: the circle's size in px; or fill: the circle grows to its parent's height (the camera icon keeps its size)
const PhotoUploader = ({height, fill, selectedFile, setSelectedFile}) => {
    const divHeight = fill ? '100%' : height.toString() + 'px';
    const picHeight = fill ? '100%' : (height-3).toString() + 'px';
    const fileInputRef = useRef(null);

    const divStyle = {
        position: 'relative',
        height: divHeight,
        width: fill ? 'auto' : divHeight,
        aspectRatio: '1 / 1',
        borderRadius: '100%',
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderColor: 'gray',
        borderWidth: '1.5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0px',
        overflow: 'hidden',
    }
    const photoContainerStyle = {
        height: picHeight,
        width: picHeight,
        borderRadius: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        margin: '0px',
    }
    const photoStyle = {
        height: picHeight,
        width: fill ? '100%' : undefined,
        borderRadius: '100%',
        objectFit: 'cover',
    }
    const cameraDivStyle = {
        display: 'none',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: picHeight,
        width: picHeight,
        borderRadius: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: "pointer",
    }

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleImageHover = (isHovering) => {
        if (isHovering) {
            document.getElementById('camera-icon-div').style.display = 'flex';
        } else {
            document.getElementById('camera-icon-div').style.display = 'none';
        }
    }

    return (
        <div style={{marginBottom: fill ? '0px' : '15px', height: fill ? '100%' : undefined, display: 'flex', justifyContent: 'center'}}>
            <div style={divStyle} onMouseEnter={()=>handleImageHover(true)} onMouseLeave={()=>handleImageHover(false)}>
                <div style={photoContainerStyle}>
                    <img 
                        src={selectedFile ? URL.createObjectURL(selectedFile) : "default_profile_pic.jpeg"}
                        style={photoStyle}
                    />
                </div>
                <div id='camera-icon-div' style={cameraDivStyle}><TbCameraPlus style={{fontSize: '30px', color: 'white'}} onClick={handleImageClick}/></div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
            />
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