import React from "react";
const Ugly = () => {
  const [state] = React.useState(0);
  return (
    <div>
      <span>{state}</span>
      <button onClick={() => alert("click")}>Click</button>
    </div>
  );
};
export default Ugly;
