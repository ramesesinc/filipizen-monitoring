import React from "react";
import MasterTemplate from "./templates/MasterTemplate";
import Content from "./components/Content";
import Graph from "./components/Graph";

function Monitor() {
  return (
    <MasterTemplate>
      <Graph />
    </MasterTemplate>
  );
}

export default Monitor;
