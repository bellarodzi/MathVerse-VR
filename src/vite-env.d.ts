/// <reference types="vite/client" />

declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
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