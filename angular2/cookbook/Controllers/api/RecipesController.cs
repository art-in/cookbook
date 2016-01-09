using System.Linq;
using System.Web.Http;
using System.Web.UI.WebControls;
using cookbook.Data;

namespace cookbook.Controllers.api
{
    public class RecipesController : ApiController
    {
        private readonly RecipeContext db = new RecipeContext();

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
    }
}