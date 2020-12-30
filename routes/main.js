//main.js file
module.exports = function(app, viewsDir) {

    /** 
     * Home Page
     * @purpose To display the home page when the route is / (root)
     * @inputs req: HTTP GET request with no parameters
     * @outputs res: HTTP response by rendering index.html in the views folder
     */
    app.get("/", function(req, res){
        res.render(viewsDir + "index.html", { title: 'Home'});
    });

    /** 
     * About Page
     * @purpose To display the about page when the route is /about
     * @inputs req: HTTP GET request with no parameters
     * @outputs res: HTTP response by rendering about.html in the views folder
     */
    app.get("/about", function(req, res){
        res.render(viewsDir + "about.html", { title: 'About'});
    });

    /** 
     * Add Food Page
     * @purpose To display the add food page when the route is /addfood
     * @inputs req: HTTP GET request with no parameters
     * @outputs res: HTTP response by rendering addfood.html in the views folder
     */
    app.get("/addfood", function(req, res){
        res.render(viewsDir + "addfood.html", { title: 'AddFood', food: {}});
    });

    /** 
     * Add Result Page (Food Added or Error)
     * @purpose To add a food item to the database and display the result/error, when the route is /foodadded
     * @inputs req: HTTP POST request using JSON with the following parameters in the object: name, typicalValue, unit, calories, carbs, fat, protein, salt and sugar
     * @outputs res: HTTP response by rendering foodadded.html in the views folder, using the req body and result id. Render error page if error occurs.
     */
    app.post("/foodadded", function(req, res){
        /**
         * Database Interaction
         * @purpose To insert a new food item into the foods table
         * @inputs name, typicalValue, unit, calories, carbs, fat, protein, salt and sugar
         * @outputs error, or the id for the food item in the database
         */
        let sqlquery = "INSERT INTO foods (name, typicalValue, unit, calories, carbs, fat, protein, salt, sugar) VALUES (?,?,?,?,?,?,?,?,?);";
        let newrecord = [req.body.name, req.body.typicalValue, req.body.unit, req.body.calories, req.body.carbs, req.body.fat, req.body.protein, req.body.salt, req.body.sugar];
        
        // execute sql query
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

    /** 
     * Search Page
     * @purpose To display the search page when the route is /search
     * @inputs req: HTTP GET request with no parameters
     * @outputs res: HTTP response by rendering search.html in the views folder
     */
    app.get("/search", function(req, res){
        res.render(viewsDir + "search.html", { title: 'Search', keyword: ''});
    });

    /** 
     * Search Results Page (List or Error)
     * @purpose To search for food items that contains the keyword, and display the results page, when the route is /search-result
     * @inputs req: HTTP GET request with the following parameter: keyword
     * @outputs res: HTTP response by rendering list.html in the views folder, using the req keyword and search result object. Render error page if error occurs.
     */
    app.get("/search-result", (req, res) => {
        /**
         * Database Interaction
         * @purpose To search for food items with names that contains the inputted keyword, and rearrange the results in alphabetical order
         * @inputs keyword
         * @outputs error, or an array of resulting food items which names contain the keyword
         */
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
    
    /** 
     * Update Page
     * @purpose To get the food item info with known id, and render the update page with the current data to the form, when the route is /update
     * @inputs req: HTTP GET request with the following parameter: id
     * @outputs res: HTTP response by rendering update.html in the views folder, using first search result object. Render error page if error occurs.
     */
    app.get("/update", function(req, res){
        if (req.query.id) { // update the food item with id
            /**
             * Database Interaction
             * @purpose To search for the food item in the database with the provided id
             * @inputs food item id
             * @outputs error, or an array that is empty or contains the resulting food item with the id
             */
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

    /** 
     * Update Result Page (Food Updated or Error)
     * @purpose To update an existing food item using its id by replacing it with the input food item info to the database, and display the result/error, when the route is /foodupdated
     * @inputs req: HTTP POST request using JSON with the following parameters in the object: name, typicalValue, unit, calories, carbs, fat, protein, salt and sugar
     * @outputs res: HTTP response by rendering foodupdated.html in the views folder, using the req body. Render error page if error occurs.
     */
    app.post("/foodupdated", function(req, res){
        /**
         * Database Interaction
         * @purpose To update the food item that has the known id in the database with the new data
         * @inputs id, name, typicalValue, unit, calories, carbs, fat, protein, salt and sugar
         * @outputs error, or the updated food item object
         */
        let sqlquery = "UPDATE foods SET name=?, typicalValue=?, unit=?, calories=?, carbs=?, fat=?, protein=?, salt=?, sugar=? WHERE id=?;";
        let update_record = [req.body.name, req.body.typicalValue, req.body.unit, req.body.calories, req.body.carbs, req.body.fat, req.body.protein, req.body.salt, req.body.sugar, req.body.id];
        
        // execute sql query
        db.query(sqlquery, update_record, (err, result) => {
            if (err) {
                console.error(err.message);
                res.render(viewsDir + "error.html", { title: 'Error', error: err.message});
            } else {
                res.render(viewsDir + "foodupdated.html", { title: 'Update', food: req.body});
            }; 
        });
    });

    /** 
     * List All Page
     * @purpose To list all food items and their nutrition values that exists in the database
     * @inputs req: HTTP GET request without any parameters
     * @outputs res: HTTP response by rendering list.html in the views folder, using the search result object. Render error page if error occurs.
     */
    app.get("/list", (req, res) => {
        /**
         * Database Interaction
         * @purpose To search for all food items from the database, and rearrange the results in alphabetical order
         * @inputs N/A
         * @outputs error, or an array that contains all existing food items
         */
        let sqlquery = "SELECT * FROM foods ORDER BY name;";

        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                console.error(err.message);
                res.render(viewsDir + "error.html", { title: 'Error', error: err.message});
            }
            res.render(viewsDir + "list.html", {title: 'List', food_items: result});
        });
    });

    /** 
     * Delete Result Page (Food Deleted or Error)
     * @purpose To delete an existing food item using its id from the database, and display the delete results
     * @inputs req: HTTP POST request using JSON with the following parameter in the object: id
     * @outputs res: HTTP response by rendering fooddeleted.html in the views folder, using the req body. Render error page if error occurs.
     */
    app.post("/fooddeleted", function(req, res){
        /**
         * Database Interaction
         * @purpose To delete an existing food item using the known id
         * @inputs food item id
         * @outputs error, or an array that contains the deleted food item
         */
        let sqlquery = "DELETE FROM foods WHERE id=?;";
        let delete_record = [req.body.id];

        // execute sql query
        db.query(sqlquery, delete_record, (err, result) => {
            if (err) {
                console.error(err.message);
                res.render(viewsDir + "error.html", { title: 'Error', error: err.message});
            } else {
                res.render(viewsDir + "fooddeleted.html", { title: 'Food Deleted', food: req.body});
            }; 
        });
    });

    /** 
     * Default 404 Not Found Page
     * @purpose To render a Not Found Page when the route entered matches none of the above routes
     * @inputs req: HTTP GET request with no parameters
     * @outputs res: HTTP response by rendering 404.html in the views folder
     */
    app.use((req, res, next) =>{
        res.render(viewsDir + '404.html', { title: '404 Not Found' });
    });
}