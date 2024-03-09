import "../Styles/timepicker.css";
import { timePicker } from "analogue-time-picker";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

const TimePicker = (props) => {
  const [showTime, setShowTime] = useState();
  const {time, setTime, type} = props;

  useEffect(() => {
    setShowTime(
      timePicker({
        element: document.getElementById("clock"),
        mode: 12,
        width: "300px",
        time: { hour: time.hour, minute: time.minute }
      })
    );
  }, []);

  useEffect(() => {
    const element = document.querySelector('.atp-background-color');
    element.style.width = 'auto';
  }, []);

  useEffect(() => {
    const object = showTime && showTime.getTime();
    if (object) {
      const am = document.querySelector(".atp-am").hasAttribute('aria-pressed');

      const newTime = {
        hour: object.hour,
        minute: object.minute,
        am: am
      };

      console.log(object);
      setTime(newTime);
    }
    else
    {
      const element = document.getElementById(`${type}-time-picker`);
      element.style.display = 'none';
    }
  }, [showTime, setTime, time, type]);

  return (
    <div className="App" id={`${type}-time-picker`} style={{display: 'none'}}>
      <div id="clock"></div>
      <div className="mat-card">
        <button className="button" onClick={() => setShowTime(() => undefined)}>
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
