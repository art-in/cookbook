use crate::models::{EntitySubset, Recipe};
use anyhow::Result;
use diesel::Connection;
use futures::FutureExt;
use postgres_protocol::escape::escape_identifier;
use tokio_postgres::{connect, Client, NoTls, Row, Statement};

diesel_migrations::embed_migrations!("src/storage/db/migrations");

pub fn run_migrations(db_url: &str) -> Result<()> {
    let connection = diesel::pg::PgConnection::establish(db_url)?;
    embedded_migrations::run(&connection)?;
    Ok(())
}

pub struct Db {
    client: Client,
    statements: PreparedStatements,
}

struct PreparedStatements {
    count_recipes: Statement,
    select_recipe_by_id: Statement,
    insert_recipe: Statement,
    delete_recipe_by_id: Statement,
    update_recipe_by_id: Statement,
    update_recipe_has_image_by_id: Statement,
}

impl Db {
    pub async fn connect(db_url: &str) -> Result<Db> {
        let (client, connection) = connect(db_url, NoTls).await?;
        log::debug!("connected to database at: {}", db_url);

        actix_rt::spawn(connection.map(|_| ()));

        let statements = Db::prepare_statements(&client).await?;

        Ok(Db { client, statements })
    }

    async fn prepare_statements(client: &Client) -> Result<PreparedStatements> {
        let count_recipes = client.prepare("SELECT COUNT(*) FROM recipes").await?;
        let select_recipe_by_id = client.prepare(
            "SELECT id, name, description, complexity, popularity, has_image, ingredients, steps
            FROM recipes
            WHERE id = $1"
        ).await?;
        let insert_recipe = client.prepare(
            "INSERT INTO recipes (name, description, complexity, popularity, has_image, ingredients, steps) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id"
        ).await?;
        let delete_recipe_by_id = client.prepare("DELETE FROM recipes WHERE id = $1").await?;
        let update_recipe_by_id = client.prepare(
            "UPDATE recipes 
            SET name = $2, description = $3, complexity = $4, popularity = $5, has_image = $6, ingredients = $7, steps = $8
            WHERE id = $1"
        ).await?;
        let update_recipe_has_image_by_id = client
            .prepare("UPDATE recipes SET has_image = $2 WHERE id = $1")
            .await?;

        Ok(PreparedStatements {
            count_recipes,
            select_recipe_by_id,
            insert_recipe,
            delete_recipe_by_id,
            update_recipe_by_id,
            update_recipe_has_image_by_id,
        })
    }

    fn parse_recipe(row: &Row) -> Result<Recipe> {
        Ok(Recipe {
            id: row.try_get(0)?,
            name: row.try_get(1)?,
            description: row.try_get(2)?,
            complexity: row.try_get(3)?,
            popularity: row.try_get(4)?,
            has_image: row.try_get(5)?,
            ingredients: row.try_get(6)?,
            steps: row.try_get(7)?,
        })
    }

    pub async fn get_recipes(
        &self,
        sort_prop: &str,
        sort_dir: &str,
        page_offset: i64,
        page_limit: i64,
    ) -> Result<EntitySubset<Recipe>> {
        let recipe_rows = self
            .client
            .query(
                // cannot prepare this statement beforehand, because it's parameterized by column
                // identifier and order direction keyword, while SQL doesn't allow that
                &format!(
                    "SELECT id, name, description, complexity, popularity, has_image, ingredients, steps FROM recipes
                    ORDER BY {sort_prop} {sort_dir}
                    OFFSET {page_offset} LIMIT {page_limit}",
                    sort_prop = escape_identifier(sort_prop),
                    sort_dir = if sort_dir == "desc" { "DESC" } else { "ASC" },
                    page_offset = page_offset,
                    page_limit = page_limit
                ),
                &[],
            )
            .await?;

        let recipes = recipe_rows
            .iter()
            .map(Db::parse_recipe)
            .collect::<Result<Vec<Recipe>, anyhow::Error>>()?;

        let recipes_count_row = self
            .client
            .query_one(&self.statements.count_recipes, &[])
            .await?;
        let recipes_count = recipes_count_row.get(0);

        Ok(EntitySubset {
            items: recipes,
            total: recipes_count,
        })
    }

    pub async fn get_recipe(&self, recipe_id: i32) -> Result<Option<Recipe>> {
        let rows = self
            .client
            .query(&self.statements.select_recipe_by_id, &[&recipe_id])
            .await?;

        if rows.is_empty() {
            Ok(None)
        } else {
            let recipe = Db::parse_recipe(&rows[0])?;
            Ok(Some(recipe))
        }
    }

    pub async fn add_recipe(&self, recipe: Recipe) -> Result<i32> {
        let row = self
            .client
            .query_one(
                &self.statements.insert_recipe,
                &[
                    &recipe.name,
                    &recipe.description,
                    &recipe.complexity,
                    &recipe.popularity,
                    &recipe.has_image,
                    &recipe.ingredients,
                    &recipe.steps,
                ],
            )
            .await?;

        Ok(row.try_get(0)?)
    }

    pub async fn delete_recipe(&self, recipe_id: i32) -> Result<bool> {
        let rows_modified = self
            .client
            .execute(&self.statements.delete_recipe_by_id, &[&recipe_id])
            .await?;
        Ok(rows_modified == 1)
    }

    pub async fn update_recipe(&self, recipe: &Recipe) -> Result<bool> {
        let rows_modified = self
            .client
            .execute(
                &self.statements.update_recipe_by_id,
                &[
                    &recipe.id,
                    &recipe.name,
                    &recipe.description,
                    &recipe.complexity,
                    &recipe.popularity,
                    &recipe.has_image,
                    &recipe.ingredients,
                    &recipe.steps,
                ],
            )
            .await?;

        Ok(rows_modified == 1)
    }

    pub async fn update_recipe_has_image(&self, recipe_id: i32, has_image: bool) -> Result<bool> {
        let rows_modified = self
            .client
            .execute(
                &self.statements.update_recipe_has_image_by_id,
                &[&recipe_id, &has_image],
            )
            .await?;

        Ok(rows_modified == 1)
    }
}
