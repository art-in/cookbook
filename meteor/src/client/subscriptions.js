Tracker.autorun(function () {
  Meteor.subscribe(
    'recipes',
    Session.get('sortProp'),
    Session.get('sortDirection'),
    Session.get('pageSize'),
    Session.get('pageNumber'));
});

Tracker.autorun(function () {
  Meteor.subscribe(
    'selectedRecipe',
    Session.get('selectedRecipeId'));
});