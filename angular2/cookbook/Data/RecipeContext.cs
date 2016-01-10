using System.Data.Entity;
using cookbook.Models;

namespace cookbook.Data
{
    public class RecipeContext : DbContext
    {
        public DbSet<Recipe> Recipes { get; set; }

        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<Step> Steps { get; set; }
    }
}