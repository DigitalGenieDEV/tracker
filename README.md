``````js
import Tracker from './lib/Tracker'

// Initialize Tracker instance
const tracker = new Tracker({
  endpoint:  '', // Data reporting address
  sessionTimeout: 360 // Session timeout, default is 360s
})

// Manual event reporting
document.getElementById('btn').addEventListener('click', (e) => {
  tracker.onEvent({
    event_id: 'vip_button_click', // Event ID
    event_type: 'click', // Event type
    event_name: 'button_click', // Event name
    params: { // Event parameter information
      elementId: e.target.id
    }
  })
})

``````