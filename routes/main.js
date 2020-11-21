//main.js file
module.exports = function(app, viewsDir) {

    /** Home Page */
    app.get("/", function(req, res){
        res.render(viewsDir + "index.html", { title: 'Home'});
    });

    /** About Page */
    app.get("/about", function(req, res){
        res.render(viewsDir + "about.html", { title: 'About'});
    });

    /** Add Page */
    app.get("/addfood", function(req, res){
        res.render(viewsDir + "addfood.html", { title: 'AddFood', food: {}});
    });

    /** Add Result Page (Food Added or Error) */
    app.post("/foodadded", function(req, res){
        // saving data in database
        let sqlquery = "INSERT INTO foods (name, typicalValue, unit, calories, carbs, fat, protein, salt, sugar) VALUES (?,?,?,?,?,?,?,?,?);";
        // execute sql query
        let newrecord = [req.body.name, req.body.typicalValue, req.body.unit, req.body.calories, req.body.carbs, req.body.fat, req.body.protein, req.body.salt, req.body.sugar];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.error(err.message);
                res.render(viewsDir + "error.html", { title: 'Error', error: err.message});
            } else {
                req.body.id = result.insertId; // SELECT LAST_INSERT_ID();
                res.render(viewsDir + "foodadded.html", { title: 'AddFood', food: req.body});
            }; 
        });
    });

    /** Search Page */
    app.get("/search", function(req, res){
        res.render(viewsDir + "search.html", { title: 'Search', keyword: ''});
    });

    /** Search Results Page (List or Error) */
    app.get("/search-result", (req, res) => {
        // searching in the database, using the food name, ordered ascendingly by name
        let word = ['%' + req.query.keyword + '%'];
        let sqlquery = "SELECT * FROM foods WHERE name like ? ORDER BY name;";

        // execute sql query
        db.query(sqlquery, word, (err, result) => {
            if (err) {
                var error_msg = "No food item found with the keyword you have entered: " + req.query.keyword + "; error: "+ err.message;
                console.error(error_msg);
                res.render(viewsDir + "error.html", { title: 'Search', error: error_msg});
            } else {
                res.render (viewsDir + 'list.html', { title: 'Search', keyword: req.query.keyword, food_items: result });
            }
        });
    });
    
    /** Update Page */
    app.get("/update", function(req, res){
        if (req.query.id) { // update the food item with id
            // searching in the database with the provided id
            let word = [req.query.id];
            let sqlquery = "SELECT * FROM foods WHERE id = ?;";

            // execute sql query
            db.query(sqlquery, word, (err, result) => {
                if (err) {
                    var error_msg = "An error has occured. Please see the following error message: " + err.message;
                    console.error(error_msg);
                    return res.render(viewsDir + "error.html", { title: 'Update', error: error_msg});
                } else {
                    if (result.length === 0) {
                        var error_msg = "No food item found with id = " + req.query.id + ", maybe it has already been deleted.";
                        return res.render(viewsDir + "error.html", { title: 'Update', error: error_msg});
                    }
                    return res.render(viewsDir + "update.html", { title: 'Update', food: result[0] }); // populate the result to update form
                }
            });
        }
        else {
            res.render(viewsDir + "search.html", { title: 'Update'});
        }
    });

    /** Update Result Page (Food Updated or Error) */
    app.post("/foodupdated", function(req, res){
        // saving data in database
        let sqlquery = "UPDATE foods SET name=?, typicalValue=?, unit=?, calories=?, carbs=?, fat=?, protein=?, salt=?, sugar=? WHERE id=?;";
        // execute sql query
        let update_record = [req.body.name, req.body.typicalValue, req.body.unit, req.body.calories, req.body.carbs, req.body.fat, req.body.protein, req.body.salt, req.body.sugar, req.body.id];
        db.query(sqlquery, update_record, (err, result) => {
            if (err) {
                console.error(err.message);
                res.render(viewsDir + "error.html", { title: 'Error', error: err.message});
            } else {
                res.render(viewsDir + "foodupdated.html", { title: 'Update', food: req.body});
            }; 
        });
    });

    /** List All Page */
    app.get("/list", (req, res) => {
        // query database to get all the foods
        let sqlquery = "SELECT * FROM foods ORDER BY name;";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            res.render(viewsDir + "list.html", {title: 'List', food_items: result});
        });
    });

    /** Delete Result Page (Food Deleted or Error) */
    app.post("/fooddeleted", function(req, res){
        // deleting data from database
        let sqlquery = "DELETE FROM foods WHERE id=?;";
        // execute sql query
        let delete_record = [req.body.id];
        db.query(sqlquery, delete_record, (err, result) => {
            if (err) {
                console.error(err.message);
                res.render(viewsDir + "error.html", { title: 'Error', error: err.message});
            } else {
                res.render(viewsDir + "fooddeleted.html", { title: 'Food Deleted', food: req.body});
            }; 
        });
    });

    /** Default 404 Not Found Page */
    app.use((req, res, next) =>{
        res.render(viewsDir + '404.html', { title: '404 Not Found' });
    });
}