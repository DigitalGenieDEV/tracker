
### Tracke Api

##### 1. Create a global tracker file, global_tracker.js

``````js
import Tracker from './lib/track'

let _globalTracker;

const getInstance = () => {

  if (!_globalTracker) {
    // Initialize Tracker instance
    _globalTracker = new Tracker({
      endpoint:  '', // Data reporting address
      userId: '', // current UserId
      deviceId: '', // current deviceId
      lang: '', // current language
      country: '', // current country
      sessionTimeout: 360 // Session timeout, default is 360s
    });
  }

  return _globalTracker;
}

const globalTracker = getInstance();

export default globalTracker;

``````

##### 2. Reference global_tracker to execute event tracking
``````js
import globalTracker from './lib/globak_tracker';

// Manual event reporting
document.getElementById('btn').addEventListener('click', (e) => {
  globalTracker.onEvent({
    event_id: 'vip_button_click', // Event ID
    event_type: 'click', // Event type
    event_name: 'button_click', // Event name
    params: { // Event parameter information
      elementId: e.target.id
    }
  })
})
``````

##### 3. How to import in React
``````js
import React from 'react';
import globalTracker from './lib/globak_tracker';

const MyComponent = () => {
  const handleClick = (e) => {
    globalTracker.onEvent({
      event_id: 'vip_button_click', // Event ID
      event_type: 'click', // Event type
      event_name: 'button_click', // Event name
      params: { // Event parameter information
        elementId: e.target.id
      }
    });
  };

  return (
    <div>
      <p>Click the button below:</p>
      <button id="btn" onClick={handleClick}>Click Me!</button>
    </div>
  );
};

export default MyComponent;
``````


## How to Run the Demo

### Install Dependencies in the Root Directory
`````
npm install
`````

### Build the project
`````
npm run build
`````

### Install http-server
````
npm i -g http-server
````

### Execute in the Root Directory
````
http-server
````

### Open in Browser
http://127.0.0.1:8080/demo.html



[Shopizer-B2B Data Tracking](https://www.yuque.com/harry-vctjd/qfozpk/fctlmsg2q2s1hak9)
