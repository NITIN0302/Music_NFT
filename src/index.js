import { render } from "react-dom";
import 'bootstrap/dist/css/bootstrap.css'
import App from './App';
import * as ReactDOM from 'react-dom/client';
import * as serviceWorker from './serviceWorker';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render
(
<App />
);



serviceWorker.unregister();