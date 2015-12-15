Meteor.publish('recipes', function(sortProp, sortDirection, pageSize, pageNumber) {
    console.log('publishing recipes: ' +
                    'page size (' + pageSize + ') : ' +
                    'page number (' + pageNumber + ') : ' +
                    'sort prop ("' + sortProp + '") : ' +
                    'sort dir (' + sortDirection + ')');
    
    // publish total recipes count
    Counts.publish(this, 'recipes', Recipes.find(), { noReady: true });
    
    var sort = {};
    sort[sortProp] = parseInt(sortDirection, 10);
    var skip = pageSize * pageNumber;
    var limit = pageSize;
    
    return Recipes.find({}, {sort: sort, skip: skip, limit: limit}); 
});

Meteor.publish('selectedRecipe', function(recipeId) {
    console.log('publishing selected recipe: ' + recipeId);
    return Recipes.find({id: recipeId});
});
