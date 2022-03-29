`trunk` feels more appropriate for bundling rust-only frontend than `nodejs` + `webpack` + `wasm-pack`

lighter and smoother approach, as it requires less tools and configuration

---

`trunk` doesn't support css minification/auto-prefixing

it doesn't transform assets itself and has no plugin system for that either yet

https://github.com/thedodd/trunk/issues/7  
https://github.com/thedodd/trunk/issues/3

---

`trunk`'s debug rebuild is slow

duration of debug rebuild (from source file change to page auto-reload): ~7s  
same in cookbook/rust's js/webpack version: <1s

it includes a bug of double rebuild on each change, which adds up to the problem a bit
https://github.com/thedodd/trunk/issues/238

---

`trunk`-produced wasm file size is ok

wasm file size produced in release mode: ~500Kb (200Kb compressed)  
js files size in cookbook/rust's js/webpack version: ~200Kb (70Kb compressed)

- `trunk` passes wasm file through `wasm-opt` already  
- I've additionaly added LTO and `opt-level = 'z'` for release profile (770Kb -> 510Kb)  
- tried `wee_alloc` but it doesn't affect file size much
- not tried `wasm-snip` in order to strip panic strings

---

css assets should be prebuilt before actual Trunk build

Trunk runs asset pipelines in parallel (eg. css and rust), so in case cargo build-script generates
css assets it should run before Trunks's build process, otherwise css pipeline will fail with "file
does not exist"

Trunk's `pre_build` hook can be used to compile css beforehand.  

sad thing is cargo doesn't have command to run build script only. closest workaround is `cargo check`

---

cannot avoid unnecessary css re-compilation

there're three initiators of css compilation (ie. who run cargo build script):
- Trunk's `pre_build` hook in `Trunk.toml` (ie. `cargo check`)
- Trunk's build pipeline for rust (ie. `cargo build`)
- `rust-analyzer`

build script is skipped if no source files were changed and compilation options are the same
(target, debug/release). problem is that I don't see a way to share those compilation options
between all three places, and thus avoid unnecessary css recompilation

specifics:
- `cargo check` target can be specified explicitly (`cargo check --target wasm32-unknown-unknown`),
    but there's no way to figure out what debug/release mode is currently used
- there's no way to share compilation target with `rust-analyzer` for particular package.   
    - `rust-analyzer.cargo.target` cannot be used since it's global and wasm is wrong target for server.  
    - `.cargo/config.toml`  cannot be used since it's global too, and per-package target
        configuration is not supported yet. https://github.com/rust-lang/cargo/issues/9406

in the end css always gets compiled for two targets:
- `target/wasm32-unknown-unknown`
- `target/debug` - unnecessary

---

cannot work with CSS without pain

there're several UI component libs, but I would like to control styles myself for flexibility

there's [stylist](https://crates.io/crates/stylist), but I don't like css-in-code approach

I would like to use [CSS modules](https://github.com/css-modules/css-modules) approach, but there's
only one implementation for rust: [css-modules](https://crates.io/crates/css-modules)

- it doesn't fully implement CSS modules spec (it has all the vital features though)
- it is abandoned for 2 years now, and source code repo deleted (don't care while it works ok)
- it forces to use `nightly` rust toolchain, since it uses unstable macro-related feature
    (`proc_macro_span`)
- for same reason `rust-analyzer` cannot parse its calls, which forces to disable "macro-error"
    diagnostics (most painful, since disables type deduction for all other macros too)
- it forces to add `build.rs` for preprocessing and bundling all css modules into single css file

I've created another implementation: https://github.com/art-in/css_mod  

I took parser from `css-modules`, rewrote the rest without using unstable rust features. 
so it works on stable rust and without complains from `rust-analyzer`

---

`yew` doesn't have `use_dispatch` and `use_selector` hooks like in `react-redux`

state can be shared with entire component tree through context, but `use_context` will trigger
component re-render on change of any part of the state, not just selected part of it

parts of state can be passed down to components as properties, but in this case all intermediate
parent components should re-render in order to upate deep leaf component 

I've created my own hooks to workaround this, but they are not perfect

---

`yew` doesn't support [render props](https://reactjs.org/docs/render-props.html) pattern

lamda func cannot be easily passed as a property to another component

I've create my own `RenderProp` func wrapper for that

---

`yew` doesn't have dev tools yet

either through browser extension, or even better - by creating perfomance marks visible on chrome
devtools Performance timeline (like it's done in React)

have to debug with `log::trace!()` for now

https://github.com/yewstack/yew/issues/1090

---

`yew-router` is historiocentric like js-routers (eg. `react-router`)

browser history should be treated like part of the app state and managed the same way with actions
dispatching, and not like separate thing with it's own API

address bar should be treated like another DOM input

in order to achieve that good router should provide tool for synchronizing app state and history
state. while react/yew is state-DOM synchronizer, router should be a state-history synchronizer

currently achieved state-history syncronization with handmade hook which subscribes to state and
history changes, and two mappers - state-to-history and history-to-state

---

`rust`'s default deep comparison of smart pointers leads to unnecessary property comparison work

to avoid cloning heavy objects on passing to component properties we wrap them in `Rc` and cheaply
clone pointers instead of undelying structures.  

when we need to update some part of the state in reducer we recreate all parent structures from
updated part up to root state structure, and all side parts behind `Rc`s which are not affected can
be cheaply pointer-cloned

this is the same approach like in `react-redux`: immutable state, clone-update in reducer

this way rendered components hold pointers to previous properties. on further attempts to re-render
they can compare prevous properties with new ones, and if they are equal - skip rendering (`memo`)

difference is that js by default compares objects by pointers (shallow comparison), while in rust
`PartialEq` implementation for `Rc` compares objects by value (deep comparison)

it can short-circuit comparison of `Rc` with same pointer, but in case pointers are different
it will compare underlaying structures deeply, which is what we do not actually need. when pointers
are different means that underlying data is different in 99.9% of times (unless our reducer
recreates `Rc` without actually modifying underlying data, which is rare or never)

to avoid deep comparisons we need to implement `PartialEq` trait for properties manually and use
`Rc::ptr_eq` there, which is not convenient to do for every property structure. most of the time
people will use simple `#[derive(PartialEq)]`, which will lead to unnecessary work

---

`rust`'s move semantics forces boilerplate with explicit clonning on callbacks

component receives callback property, wraps it into another callback (which is ok since local
callback receives mouse event argument and we need to pass up something else), and then in order
to move data to local callback closure we need to clone it explicitly, which adds a lot of
boilerplate code for almost every single callback

```rs
let on_click = {
    let on_click = props.on_click.clone(); // <-- these clones are annoying
    let recipe = props.recipe.clone();
    move |_| on_click.emit(recipe.clone())
};
```

`rust-clippy` warns when child module named the same as parent module

which is generally OK diagnostic, but...

I want each of my UI components lay in separate directory (component can have personal assets like
CSS files, images, etc.), and component definition lay in `.rs` file with same name

```
components/
    my_module/
        my_module.rs
        my_module.css
        mod.rs
```

```rs
// mod.rs

#[allow(clippy::module_inception)] // <-- this is annoying
mod my_component;
pub use my_component::MyComponent;
```

https://rust-lang.github.io/rust-clippy/master/index.html#module_inception

---

`rustfmt` doesn't format contents of `yew`'s `html! {}` proc macro calls

https://github.com/yewstack/yew/issues/1446

---

`rust-analyzer` doesn't fully work for  `yew`'s `html! {}` proc macro calls

e.g.
- no autocomplete when adding new element of certain component type into DOM-structure.  
    to workaround this i have to type component type name outside `html ! {}` block, select type from
    autocomplete list (which adds `use` line to header), erase type name, and then use it inside DOM.
- not updating struct field name on "rename symbol"

though "go to references" finds usages inside proc macro calls ok.
