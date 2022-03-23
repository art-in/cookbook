use super::Recipe;
use derive_builder::Builder;
use std::rc::Rc;

#[derive(Default, PartialEq, Clone, Builder)]
#[builder(name = "RecipeFormPatch")]
#[builder(derive(Debug))]
pub struct RecipeForm {
    pub is_visible: bool,
    pub is_loading: bool,
    pub is_editing: bool,
    pub is_editable: bool,
    pub is_deletable: bool,
    pub is_cancelable: bool,
    pub is_new_recipe: bool,
    pub is_image_changed: bool,
    pub recipe: Option<Rc<Recipe>>,
    pub recipe_id: Option<i64>,
    pub prev_recipe: Option<Rc<Recipe>>,
}

// TODO: find a way to avoid manual patch application
impl RecipeForm {
    pub fn apply_patch(&mut self, patch: RecipeFormPatch) {
        if let Some(is_visible) = patch.is_visible {
            self.is_visible = is_visible;
        }

        if let Some(is_loading) = patch.is_loading {
            self.is_loading = is_loading;
        }

        if let Some(is_editing) = patch.is_editing {
            self.is_editing = is_editing;
        }

        if let Some(is_editable) = patch.is_editable {
            self.is_editable = is_editable;
        }

        if let Some(is_deletable) = patch.is_deletable {
            self.is_deletable = is_deletable;
        }

        if let Some(is_cancelable) = patch.is_cancelable {
            self.is_cancelable = is_cancelable;
        }

        if let Some(is_new_recipe) = patch.is_new_recipe {
            self.is_new_recipe = is_new_recipe;
        }

        if let Some(is_image_changed) = patch.is_image_changed {
            self.is_image_changed = is_image_changed;
        }

        if let Some(recipe) = patch.recipe {
            self.recipe = recipe;
        }

        if let Some(recipe_id) = patch.recipe_id {
            self.recipe_id = recipe_id;
        }

        if let Some(prev_recipe) = patch.prev_recipe {
            self.prev_recipe = prev_recipe;
        }
    }
}
