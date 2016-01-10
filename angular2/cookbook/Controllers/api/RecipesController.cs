using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Web.Http;
using System.Web.UI.WebControls;
using cookbook.Data;
using cookbook.Models;

namespace cookbook.Controllers.api
{
    public class RecipesController : ApiController
    {
        private readonly RecipeContext db = new RecipeContext();

        [Route("api/recipes/")]
        public object Get(string sprop, bool sdesc, int skip, int limit)
        {
            var recipes = db.Recipes
                .SortBy(sprop + (sdesc ? " DESC" : ""))
                .Skip(skip)
                .Take(limit)
                .ToList();

            return new
            {
                recipes,
                recipesTotal = db.Recipes.Count()
            };
        }

        [Route("api/recipes/{recipeId}")]
        public Recipe Get(string recipeId)
        {
            return db.Recipes
                .Include(r => r.Ingredients)
                .Include(r => r.Steps)
                .First(r => r.Id.ToString() == recipeId);
        }

        [Route("api/recipes/{recipeId}")]
        public void Put(string recipeId, [FromBody] Recipe recipe)
        {
            if (db.Recipes.Any(r => r.Id.ToString() == recipeId))
            {
                // Remove existing entity and add again, so
                // there is no headache with updating dependencies
                // (extremely inefficient)
                this.Delete(recipeId);
            }

            db.Recipes.Add(recipe);
            db.SaveChanges();
        }

        [Route("api/recipes/{recipeId}")]
        public void Delete(string recipeId)
        {
            var rec = db.Recipes
                .Include(r => r.Ingredients)
                .Include(r => r.Steps)
                .First(r => r.Id.ToString() == recipeId);

            db.Ingredients.RemoveRange(rec.Ingredients);
            db.Steps.RemoveRange(rec.Steps);
            db.Recipes.Remove(rec);
            db.SaveChanges();
        }
    }
}