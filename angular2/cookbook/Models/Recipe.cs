using System;

namespace cookbook.Models
{
    public class Recipe
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Complexity { get; set; }
        public int Popularity { get; set; }
    }
}