import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../Styles/range-slider.css';
import PropTypes from 'prop-types';

const marks = {
    0: '৳0',
    5000: '৳5,000',
    10000: '৳10.000',
    15000: '৳15,000',
    20000: '৳20,000'
};

const RangeSlider = (props) => {
    const {values, funcs} = props;

    const handleChange = (newValues) => {
        if(newValues[1]-newValues[0]<1000)
        {
            if(newValues[1] === values[1])
            {
                funcs.setValues([newValues[1]-1000,newValues[1]]);
            }
            else
            {
                funcs.setValues([newValues[0],newValues[0]+1000]);
            }
        }
        else
        {
            funcs.setValues(newValues);
        }
        funcs.setIsFilterApplied(true);
    };

    return (
        <div>
            <h3>Price Range</h3>
            <Slider range
                className="range-slider"
                value={values}
                onChange={handleChange}
                allowCross={false}
                step={100}
                marks={marks}
                min={0}
                max={20000}
            />
            <p>Min: ৳{values[0]}</p>
            <p>Max: ৳{values[1]}</p>
        </div>
    );
};

RangeSlider.propTypes = {
    values: PropTypes.array,
    funcs: PropTypes.object
}

export default RangeSlider;
