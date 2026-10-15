import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../Styles/range-slider.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const RangeSlider = (props) => {
    const {marks, minValue, maxValue, values, setValues, setIsFilterApplied} = props;
    const [min, setMin] = useState(values[0]);
    const [max, setMax] = useState(values[1]);

    useEffect(()=>{
        setMin(values[0]);
        setMax(values[1]);
    },[values]);

    const handleTextChange = (e,index) => 
    {
        const isValid = /^\d*$/.test(e.target.value);
        if(isValid || e.target.value.length === 0)
        {
            if(index === 0)
            {
                setMin(e.target.value);
            }
            else
            {
                setMax(e.target.value);
            }
        }
    }

    const handleBlur = (index) => {
        if(index === 0)
        {
            let newMin = Math.min(values[1]-2000, min.length === 0 ? 0 : parseInt(min));
            setValues([newMin,values[1]]);
            setMin(newMin);
        }
        else
        {
            let newMax = Math.max(values[0]+2000, max.length === 0 ? 0 : parseInt(max));
            setValues([values[0], newMax]);
            setMax(newMax);
            document.getElementById('max-input').blur();
        }
        setIsFilterApplied(true);
    }

    const handleEnterPress = (e,index) => {
        if(e.key === 'Enter')
        {
            handleBlur(index);
            if(index === 0)
            {
                document.getElementById('min-input').blur();
            }
            else
            {
                document.getElementById('max-input').blur();
            }
        }
    }

    const handleChange = (newValues) => {
        if(newValues[1] === values[1])
        {
            setValues([Math.min(newValues[1]-2000,newValues[0]),newValues[1]]);
            setMin(Math.min(newValues[1]-2000,newValues[0]));
        }
        else
        {
            setValues([newValues[0],Math.max(newValues[0]+2000,newValues[1])]);
            setMax(Math.max(newValues[0]+2000,newValues[1]));
        }
        setIsFilterApplied(true);
    };

    return (
        <div style={{paddingLeft: "10px"}}>
            <div style={{display: "block", width: "90%"}}>
                <Slider range
                    className="range-slider"
                    value={values}
                    onChange={handleChange}
                    allowCross={false}
                    step={100}
                    marks={marks}
                    min={minValue}
                    max={maxValue}
                />
                <div style={{height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <label>Min: ৳ <input 
                                    className='range-input' 
                                    id='min-input' 
                                    type="text" 
                                    value={min} 
                                    onChange={(e)=>handleTextChange(e,0)} 
                                    onKeyDown={(e)=>handleEnterPress(e,0)} 
                                    onBlur={() => handleBlur(0)}/>
                    </label>
                    <label>Max: ৳ <input 
                                    className='range-input' 
                                    id='max-input' 
                                    type="text" 
                                    value={max} 
                                    onChange={(e)=>handleTextChange(e,1)} 
                                    onKeyDown={(e)=>handleEnterPress(e,1)} 
                                    onBlur={() => handleBlur(1)}/>
                    </label>
                </div>
            </div>
        </div>
    );
};

RangeSlider.propTypes = {
    marks: PropTypes.object,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    values: PropTypes.array,
    setValues: PropTypes.func,
    setIsFilterApplied: PropTypes.func
}

export default RangeSlider;
