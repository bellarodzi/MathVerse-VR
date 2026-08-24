/// <reference types="vite/client" />

import type { JSX as ReactJSX } from "react";

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements extends ReactJSX.IntrinsicElements {
      "a-scene": any;
      "a-sky": any;
      "a-plane": any;
      "a-light": any;
      "a-entity": any;
      "a-camera": any;
      "a-cursor": any;
      "a-box": any;
      "a-sphere": any;
      "a-cylinder": any;
      "a-text": any;
    }
  }
}