var response = require('../../response');
var Category = require('../../models/category');

function getCategories(req, res) {
    /*
    /categories - get a list of categories (get)
    */
    Category.find({}, function(err, categories) {
        if (err) {
            res.json(response.error(err));
        } 

        if (!categories) {
            res.json(response.error('No categories in database.'));
        } else {
            res.json(response.success(categories));
        }
    });
}

var categoriesRead = {
    getCategories: getCategories
};

module.exports = categoriesRead;