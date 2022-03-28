use super::{Ingredient, Step};
use derive_builder::Builder;
use serde::{Deserialize, Serialize};
use std::rc::Rc;
use web_sys::File;

#[derive(PartialEq, Serialize, Deserialize, Debug, Clone, Builder)]
#[builder(name = "RecipePatch")]
pub struct Recipe {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub complexity: i16,
    pub popularity: i16,
    pub ingredients: Vec<Rc<Ingredient>>,
    pub steps: Vec<Rc<Step>>,
    pub has_image: bool,
    #[serde(skip)]
    pub image_url: Option<String>,
    #[serde(skip)]
    pub image_file: Option<File>,
}

impl Default for Recipe {
    fn default() -> Self {
        Recipe {
            id: 0,
            name: "".to_string(),
            description: "".to_string(),
            complexity: 1,
            popularity: 1,
            ingredients: Vec::new(),
            steps: Vec::new(),
            has_image: false,
            image_url: None,
            image_file: None,
        }
    }
}

impl Recipe {
    pub fn apply_patch(&mut self, patch: RecipePatch) {
        if let Some(id) = patch.id {
            self.id = id;
        }

        if let Some(name) = patch.name {
            self.name = name;
        }

        if let Some(description) = patch.description {
            self.description = description;
        }

        if let Some(complexity) = patch.complexity {
            self.complexity = complexity;
        }

        if let Some(popularity) = patch.popularity {
            self.popularity = popularity;
        }

        if let Some(ingredients) = patch.ingredients {
            self.ingredients = ingredients;
        }

        if let Some(steps) = patch.steps {
            self.steps = steps;
        }

        if let Some(has_image) = patch.has_image {
            self.has_image = has_image;
        }

        if let Some(image_url) = patch.image_url {
            self.image_url = image_url;
        }

        if let Some(image_file) = patch.image_file {
            self.image_file = image_file;
        }
    }
}
