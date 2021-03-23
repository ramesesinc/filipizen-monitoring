import React from "react";
import MasterTemplate from "./templates/MasterTemplate";
import Content from "./components/Content";
import LineGraph from "./components/LineGraph";
import BarGraph from "./components/BarGraph";

function Monitor() {
  return (
    <MasterTemplate>
      <BarGraph />
    </MasterTemplate>
  );
}

export default Monitor;
