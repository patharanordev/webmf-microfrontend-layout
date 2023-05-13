import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./index.scss";
import ExampleInAppNotification from "./components/ExampleInAppNotification";
import ExampleFCM from "./components/ExampleFCM";
import Area1 from "content1/Area1";
import Area2 from "content2/Area2";

const App = () => {

  const [pressedPrevented, setPressPrevented] = useState(undefined);

  function handleContextMenu(event:any) {
    event.preventDefault();
    alert('Right-click context menu is not allowed!');
  }

  function preventExitFullscreen() {
    document.addEventListener("fullscreenchange", function(event) {
      if (!document.fullscreenElement) {
        // User exited fullscreen mode - re-enter immediately
        openFullscreen()
      }
    });
  }

  function blockKeyboardShortcuts(event:any) {
    const isF11Button = (event.keyCode === 122)
    const isF12Button = (event.keyCode === 123)
    const isPressed_JUCI = ([74, 85, 67, 73].includes(event.keyCode))
    const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent);

    const isSwitchFullscreen = isMac
    ? (event.key === "F" && event.metaKey && event.altKey && event.shiftKey && event.ctrlKey && event.getModifierState("Fn"))
    : isF11Button
    const isTryToExitFullscreen = (event.keyCode === 27 && document.fullscreenElement)

    let isPreventedKey = isMac
    ? (isF12Button || (event.metaKey && event.altKey && isPressed_JUCI))
    : (isF12Button || (event.ctrlKey && event.shiftKey && isPressed_JUCI))

    isPreventedKey = isPreventedKey || isSwitchFullscreen || isTryToExitFullscreen

    setPressPrevented(isPreventedKey)

    if (isPreventedKey) {
      event.preventDefault();
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', blockKeyboardShortcuts);
    document.addEventListener('keyup', blockKeyboardShortcuts);
    return () => {
      document.removeEventListener('keydown', blockKeyboardShortcuts);
      document.removeEventListener('keyup', blockKeyboardShortcuts);
    };
  }, []);

  useEffect(() => {
    preventExitFullscreen();
    openFullscreen()
  }, []);


  function openFullscreen() {
    // const elem = document.documentElement;
    // if (elem.requestFullscreen) {
    //   elem.requestFullscreen();
    // } else if (elem.webkitRequestFullscreen) { /* Safari */
    //   elem.webkitRequestFullscreen();
    // } else if (elem.msRequestFullscreen) { /* IE11 */
    //   elem.msRequestFullscreen();
    // }
  }
  
  function closeFullscreen() {
    const elem = document.documentElement;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
  }


  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl" onContextMenu={handleContextMenu}>
      <div>Name: layout</div>
      <div>Framework: react</div>
      <div>Language: TypeScript</div>
      <div>CSS: Tailwind</div>
      <div>Press prevented key: {pressedPrevented ? 'pressed' : 'no'}</div>

      <button onClick={openFullscreen}>Fullscreen</button>

      <div className="grid grid-cols-3 gap-4">
        <div className="">
          <Area1 />
        </div>
        <div className="col-span-2">
          <Area2 />
        </div>
        <div className="col-span-12">
          <ExampleInAppNotification />
          <ExampleFCM />
        </div>
      </div>
    </div>
  )
};
ReactDOM.render(<App />, document.getElementById("app"));
