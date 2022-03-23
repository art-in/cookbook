use crate::models::{RecipeFormPatch, RecipeListPatch, State};
use std::rc::Rc;
use yew::Reducible;

pub enum Action {
    UpdateRecipeList(RecipeListPatch),
    UpdateRecipeForm(RecipeFormPatch),
}

impl Reducible for State {
    type Action = Action;

    fn reduce(self: Rc<Self>, action: Self::Action) -> Rc<Self> {
        match action {
            Action::UpdateRecipeList(patch) => {
                log::debug!("Action::UpdateRecipeList: {:?}", patch);
                let mut recipe_list = Rc::clone(&self.recipe_list);
                Rc::make_mut(&mut recipe_list).apply_patch(patch);

                Rc::new(State {
                    recipe_list,
                    recipe_form: self.recipe_form.clone(),
                })
            }
            Action::UpdateRecipeForm(patch) => {
                log::debug!("Action::UpdateRecipeForm: {:?}", patch);
                let mut recipe_form = self.recipe_form.clone();
                Rc::make_mut(&mut recipe_form).apply_patch(patch);

                Rc::new(State {
                    recipe_list: self.recipe_list.clone(),
                    recipe_form,
                })
            }
        }
    }
}
