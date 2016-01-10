using System;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.UI.WebControls;
using cookbook.Data;
using cookbook.Models;
using ApiController = System.Web.Http.ApiController;
using HttpResponseException = System.Web.Http.HttpResponseException;
using System.IO;
using System.Net.Http.Headers;

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
                Delete(recipeId);
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

            // TODO: remove recipe photo
        }

        [HttpPost]
        [Route("api/recipes/photo")]
        public async Task<HttpResponseMessage> PostPhoto()
        {
            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            var root = HttpContext.Current.Server.MapPath("~/Content/photos");
            var provider = new CustomMultipartFormDataStreamProvider(root);

            try
            {
                // Read the form data.
                await Request.Content.ReadAsMultipartAsync(provider);
                return HttpRequestMessageCommonExtensions.CreateResponse(Request, HttpStatusCode.OK);
            }
            catch (Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpGet]
        [Route("api/recipes/photo/{photoId}")]
        public HttpResponseMessage GetPhoto(string photoId)
        {
            var path = HttpContext.Current.Server.MapPath("~/Content/photos/" + photoId);
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            var stream = new FileStream(path, FileMode.Open);
            result.Content = new StreamContent(stream);
            return result;
        }
    }
}