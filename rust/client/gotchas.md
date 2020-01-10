create-react-app still requires additional infrastructure building

basic template lacks:
- css linter
- state container
- router

unable to configure webpack css loader to change css-modules configuration, eg.
- to set `camelCase` class names
- files should have `*.module.css` sufix instead of simpler `*.css`

---

create-react-app does not support wasm modules

its webpack config passes wasm modules to file loader which returns default error  
```
.-image-effects/pkg/client_image_effects_bg.wasm
Module parse failed: magic header not detected
File was processed with these loaders:
 * ./node_modules/file-loader/dist/cjs.js
You may need an additional loader to handle the result of these loaders.
```

all we need is to ignore file loader and passthrough wasm modules directly to
webpack, which already supports wasm.

but since next webpack 5 moved wasm to experiments and disabled it by default,
cra decided to wait for stable support from webpack.  
https://github.com/facebook/create-react-app/issues/4912

and webpack 5 in its turn will support new WebAssembly/ES Module Integration spec.  
https://github.com/WebAssembly/esm-integration/tree/master/proposals/esm-integration

meanwhile we have to eject from cra to update webpack 4 config.

---

routers do not work with state containers correctly

when using state container you want to keep entire app state inside container ("single source of truth")

when you want to update DOM - you change container state through actions and later state is mapped to DOM  
but when you want to update URL - you need to update URL first and later it is mapped to container state or directly to DOM

this splits state into 2 pieces: container state and history state.  

most of redux router connectors are history centric, meaning
- to change state you have to change history state first:
  - either through store actions (eg. `dispatch(push('/home'))` in `connected-react-router`)  
  - or directly through `history` object (eg. `history.push("/home")` in `react-router`)
- to read state you have to read from history state:
  - either through container state, which was mapped from history state (eg. `state.router.location.pathname` in `connected-react-router`)
  - or through UI components which are connected directly to `history` object (eg. `<Route path="/about"><About /></Route>` in `react-router`)

current (wrong) way:  
```
(changing state unrelated to history) -> [action] -> [container state] -> [renderer] -> [browser API (DOM)]  
(changing state related to history)   -> [action] -> [browser API (history)] -> [container state] -> [renderer] -> [browser API (DOM)]  
                                       \__________/                           \___________________/
```

correct way:  
```
(changing state) -> [action] -> [container state] -> [renderer] -> [browser API (DOM)]
                                   |
                                [syncer]
                                   |
                                [browser API (history)]
```

`[syncer]` should relate to History API the same way as `[renderer]` relates to DOM API.  
ie. address bar should be treated the same as DOM input.  

- we should update container state normally (without considering if it should be mapped to history or not)
- `syncer` should listen to container state changes (container -> history)
  - map container state to subset that should be reflected in URL
  - compare it with current history state
  - if not equal - compose new URL and push it as new history record
- `syncer` should listen to history state changes (history -> container)
  - parse params from current history URL
  - compare it with current container state
  - if not equal - dispatch action to update container state
