no original names of params/vars in debugger

which makes wasm modules much harder to read and debug

`wasm-pack` generates DWARF debug section which is not supported by wasm-to-wat converters (chrome/ff dev tools, `wasm2wat`).  
https://github.com/WebAssembly/wabt/issues/1290

---

cannot construct `Blob` in rust

`web-sys`'s `Blob` can only be constructed with `JsValue` as first param
(array), but I believe `JsValue` can only be sent from js side.  

https://rustwasm.github.io/wasm-bindgen/api/web_sys/struct.Blob.html

---

cannot pass `ArrayBuffer` to wasm module

https://github.com/rustwasm/wasm-bindgen/issues/1961

workaround: wrap it with `Uint8Array`
