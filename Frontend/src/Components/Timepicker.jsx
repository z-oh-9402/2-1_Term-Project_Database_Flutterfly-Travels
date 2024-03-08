import "../Styles/timepicker.css";
import { useState } from "react";
import TimeKeeper from "react-timekeeper";

const Timepicker = () => {
    const [time, setTime] = useState("12:34pm");
    const [showTime, setShowTime] = useState(true);

    return (
      <div className="time-picker-container">
        {showTime && (
          <TimeKeeper
            time={time}
            onChange={(newTime) => setTime(newTime.formatted12)}
            onDoneClick={() => setShowTime(false)}
            switchToMinuteOnHourSelect
          />
        )}
        <span>
          Time is {time}{" "}
          <input type="text" value={time} onClick={() => setShowTime(true)} />{" "}
        </span>
        {!showTime && <button onClick={() => setShowTime(true)}>Show</button>}
      </div>
    );
}

export default Timepicker;