use super::{RecipeForm, RecipeList};
use std::{cell::RefCell, rc::Rc};
use yew::UseReducerHandle;

#[derive(Default, PartialEq)]
pub struct State {
    pub recipe_list: Rc<RecipeList>,
    pub recipe_form: Rc<RecipeForm>,
}

pub type StateRef = Rc<RefCell<UseReducerHandle<State>>>;
