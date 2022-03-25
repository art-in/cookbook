use crate::models::Recipe;
use core::fmt;
use derive_builder::Builder;
use serde::{Deserialize, Serialize};
use std::fmt::{Display, Formatter};
use std::rc::Rc;

#[derive(Clone, Builder, PartialEq)]
#[builder(name = "RecipeListPatch")]
#[builder(derive(Debug))]
pub struct RecipeList {
    pub is_first_load: bool,
    pub is_loading: bool,
    pub items: Vec<Rc<Recipe>>,
    // sorting
    pub sort_prop: SortProp,
    pub sort_dir: SortDir,
    // paging
    pub total: i64,
    pub page_limit: i64,
    pub current_page_idx: i64,
}

impl Default for RecipeList {
    fn default() -> Self {
        RecipeList {
            is_first_load: true,
            is_loading: true,
            items: Vec::new(),
            sort_prop: SortProp::default(),
            sort_dir: SortDir::default(),
            total: 0,
            page_limit: 3,
            current_page_idx: 0,
        }
    }
}

impl RecipeList {
    pub fn apply_patch(&mut self, patch: RecipeListPatch) {
        if let Some(is_first_load) = patch.is_first_load {
            self.is_first_load = is_first_load;
        }

        if let Some(is_loading) = patch.is_loading {
            self.is_loading = is_loading;
        }

        if let Some(items) = patch.items {
            self.items = items;
        }

        if let Some(sort_prop) = patch.sort_prop {
            self.sort_prop = sort_prop;
        }

        if let Some(sort_dir) = patch.sort_dir {
            self.sort_dir = sort_dir;
        }

        if let Some(total) = patch.total {
            self.total = total;
        }

        if let Some(page_limit) = patch.page_limit {
            self.page_limit = page_limit;
        }

        if let Some(current_page) = patch.current_page_idx {
            self.current_page_idx = current_page;
        }
    }
}

#[derive(PartialEq, Clone, Copy, Debug, Serialize, Deserialize)]
pub enum SortProp {
    #[serde(rename = "name")]
    Name,
    #[serde(rename = "complexity")]
    Complexity,
    #[serde(rename = "popularity")]
    Popularity,
}

impl Default for SortProp {
    fn default() -> Self {
        SortProp::Name
    }
}

impl Display for SortProp {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        match *self {
            SortProp::Name => write!(f, "name"),
            SortProp::Complexity => write!(f, "complexity"),
            SortProp::Popularity => write!(f, "popularity"),
        }
    }
}

#[derive(PartialEq, Clone, Copy, Debug, Serialize, Deserialize)]
pub enum SortDir {
    #[serde(rename = "asc")]
    Ascending,
    #[serde(rename = "desc")]
    Descending,
}

impl Default for SortDir {
    fn default() -> Self {
        SortDir::Ascending
    }
}

impl SortDir {
    pub fn get_opposite(&self) -> Self {
        if *self == SortDir::Ascending {
            SortDir::Descending
        } else {
            SortDir::Ascending
        }
    }
}

impl Display for SortDir {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        match *self {
            SortDir::Ascending => write!(f, "asc"),
            SortDir::Descending => write!(f, "desc"),
        }
    }
}
