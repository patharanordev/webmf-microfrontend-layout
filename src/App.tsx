import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import "./index.scss";
import { messaging, onMessage } from "./configs/firebase";
import ExampleInAppNotification from "./components/ExampleInAppNotification";
import Area1 from "content1/Area1";
import Area2 from "content2/Area2";

const App = () => {

  useEffect(() => {
    onMessage(messaging, (payload: any) => {
      console.log('Message received. ', payload);
      
      // Show the notification
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
          body: payload.notification.body,
          icon: payload.notification.icon,
      };
      
      // Show the notification
      new Notification(notificationTitle, notificationOptions);
    });
  }, [messaging]);

  return (
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
        <div className="col-span-12">
          <ExampleInAppNotification />
        </div>
      </div>
    </div>
  )
};
ReactDOM.render(<App />, document.getElementById("app"));
