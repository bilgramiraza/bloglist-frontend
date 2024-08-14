import { forwardRef, useImperativeHandle, useState } from 'react';

const Toggleable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  useImperativeHandle(refs, () => {
    return {
      hideComponent: hide
    };
  });

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
});

Toggleable.displayName = "Toggleable";

export default Toggleable;
