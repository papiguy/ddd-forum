
import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import configureStore from './shared/infra/redux/configureStore';
import { initialReduxStartupScript } from './shared/infra/redux/startupScript';

// Polyfill for findDOMNode (removed in React 19 but required by react-quill@2.0.0)
// @ts-ignore
if (!ReactDOM.findDOMNode) {
  // @ts-ignore
  ReactDOM.findDOMNode = (component: any) => {
    if (component == null) return null;
    if (component.nodeType === 1) return component;
    // For class components, try to access the internal fiber
    const fiber = component._reactInternals || component._reactInternalFiber;
    if (fiber) {
      // Walk up to find the host component
      let node = fiber;
      while (node) {
        if (node.stateNode && node.stateNode.nodeType === 1) {
          return node.stateNode;
        }
        node = node.child;
      }
    }
    return null;
  };
}

const store = configureStore();

//@ts-ignore
initialReduxStartupScript(store);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
