no original names of params/vars in debugger

which makes wasm modules much harder to read and debug

`wasm-pack` generates DWARF debug section which is not supported by wasm-to-wat converters (chrome/ff dev tools, `wasm2wat`).  
https://github.com/WebAssembly/wabt/issues/1290