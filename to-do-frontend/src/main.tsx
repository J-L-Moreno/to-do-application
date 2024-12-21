import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {App} from './App';
import './styles.css';
import store from './store/store';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
