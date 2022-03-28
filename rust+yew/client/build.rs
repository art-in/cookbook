fn main() {
    simple_logger::init_with_level(log::Level::Trace).unwrap();

    css_mod::Compiler::new()
        .add_modules("src/**/*.css")
        .compile("build-assets/app.css");
}
