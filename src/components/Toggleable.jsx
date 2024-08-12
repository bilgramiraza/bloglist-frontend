import { useState } from 'react';

const Toggleable = (props) => {
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <div>
      <div style={{ display: visible ? 'none' : '' }} >
        <button onClick={show}>{props.buttonLabel}</button>
      </div>
      <div style={{ display: visible ? '' : 'none' }} >
        {props.children}
        <button onClick={hide}>Cancel</button>
      </div>
    </div>
  );
};

export default Toggleable;
