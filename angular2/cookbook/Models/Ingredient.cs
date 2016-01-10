using System;

namespace cookbook.Models
{
    public class Ingredient
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public string Order { get; set; }
    }
}