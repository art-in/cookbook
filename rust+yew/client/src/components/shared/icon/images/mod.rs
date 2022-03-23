mod clock_icon;
mod eraser_icon;
mod pencil_icon;
mod plus_icon;
mod save_icon;
mod smile_icon;
mod spinner_icon;
mod times_icon;
mod trash_icon;

pub use clock_icon::ClockIcon;
pub use eraser_icon::EraserIcon;
pub use pencil_icon::PencilIcon;
pub use plus_icon::PlusIcon;
pub use save_icon::SaveIcon;
pub use smile_icon::SmileIcon;
pub use spinner_icon::SpinnerIcon;
pub use times_icon::TimesIcon;
pub use trash_icon::TrashIcon;

use yew::{Callback, Classes, MouseEvent, Properties};

#[derive(Properties, PartialEq)]
pub struct IconProps {
    pub class: Classes,
    pub title: String,
    pub width: i32,
    pub on_click: Callback<MouseEvent>,
}
