fn main() {
    dotenv::dotenv().unwrap();
    env_logger::init();

    css_mod::Compiler::new()
        .add_modules("src/**/*.css")
        .compile("build-assets/app.css");
}
