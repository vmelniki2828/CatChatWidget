import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

// const container = document.getElementById('my-react-widget');
// if (container) {
//   const root = ReactDOM.createRoot(container);
//   root.render(<App />);
// } else {
//   console.error('Target container is not a DOM element.');
// }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);