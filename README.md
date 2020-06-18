# Polling.js

## Installation

`npm install polling-js`

## Usage

```javascript
import { setPolling } from 'polling-js';

const fetchUserData = (signal) => {
  return fetch('https://api.randomuser.me/', {signal})
    .then(response => response.json())
    .then(user => console.log(user));
};

const cancelPolling = setPolling(fetchUserData, 1000, new AbortController());

setTimeout(cancelPolling, 10000);
```

## License

MIT
