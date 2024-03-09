import "../Styles/timePicker.css";
import { timePicker } from "analogue-time-picker";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

const TimePicker = (props) => {
  const {time, setTime, type} = props;
  const [showTime, setShowTime] = useState();

  useEffect(() => {
    setShowTime(
      timePicker({
        element: document.getElementById(`${type}-clock`),
        mode: 12,
        width: '224px',
        time: { hour: time.hour, minute: time.minute },
      })
    );
  }, []);

  function handleClick() {
    const object = showTime.getTime();
    console.log(object.hour, object.minute)
    const newObj = {
      ...time,
      hour: object.hour>12 ? object.hour-12 : (object.hour===0 ? 12 : object.hour),
      minute: object.minute,
      am: (object.hour!==0 && object.hour<=12)
    }
    console.log(object.hour, object.minute)
    setTime(newObj);
    document.getElementById(`${type}-time-picker`).style.display = 'none';
  }

  return (
    <div className="App" id={`${type}-time-picker`} style={{display: 'none'}}>
      <div id={`${type}-clock`}></div>
      <div className="mat-card">
        <button className="button" onClick={handleClick}>
          Get Selected Time
        </button>
      </div>
    </div>
  );
}


TimePicker.propTypes = {
  time: PropTypes.object,
  setTime: PropTypes.func,
  type: PropTypes.string.isRequired
};

export default TimePicker;
