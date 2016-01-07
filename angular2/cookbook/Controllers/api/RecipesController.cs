using System.Collections.Generic;
using System.Web.Http;
using cookbook.Models;

namespace cookbook.Controllers.api
{
    public class RecipesController : ApiController
    {
        public List<Recipe> Get()
        {
            return new List<Recipe>
            {
                new Recipe { Name = "Recipe 1" },
                new Recipe { Name = "Recipe 2" }
            };
        }
    }
}