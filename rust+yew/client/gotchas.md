`trunk` feels more appropriate for bundling rust-only frontend than `nodejs` + `webpack` + `wasm-pack`

lighter and smoother approach, as it requires less tools and configuration

---

`trunk` doesn't support css minification/auto-prefixing

it doesn't transform assets itself and has no plugin system for that either yet

https://github.com/thedodd/trunk/issues/7

---

`trunk serve` builds twice after each source file change

https://github.com/thedodd/trunk/issues/238

---

cannot work with CSS without pain

there're several UI component libs, but I would like to control styles myself (not flexible)

there's [stylist](https://crates.io/crates/stylist), but I don't like css-in-code approach

I like [CSS modules](https://github.com/css-modules/css-modules) approach, but there's only
one implementation for rust: [css-modules](https://crates.io/crates/css-modules)

- it doesn't fully implement CSS modules spec (though it has all the vital features)
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

I want each of my UI components lay in separate folder (component can have personal assets like CSS
files, images, etc.), and component definition lay in `.rs` file with same name

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
