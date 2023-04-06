import React from "react";
import ReactDOM from "react-dom";

import "./index.scss";
import Area1 from "content1/Area1";
import Area2 from "content2/Area2";

const App = () => (
  <div className="mt-10 text-3xl mx-auto max-w-6xl">
    <div>Name: layout</div>
    <div>Framework: react</div>
    <div>Language: TypeScript</div>
    <div>CSS: Tailwind</div>

    <div className="grid grid-cols-3 gap-4">
      <div className="">
        <Area1 />
      </div>
      <div className="col-span-2">
        <Area2 />
      </div>
    </div>
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));
