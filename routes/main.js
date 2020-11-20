//main.js file
module.exports = function(app) {

    app.get("/", function(req, res){
        res.render("./index.html", { title: 'Home'});
    });

    app.get("/search", function(req, res){
        res.render("./search.html", { title: 'Search', keyword: ''});
    });

    app.get("/about", function(req, res){
        res.render("./about.html", { title: 'About'});
    });

    app.get("/list", (req, res) => {
        // query database to get all the books
        let sqlquery = "SELECT * FROM foods ORDER BY name;";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            res.render("./list.html", {title: 'List', food_items: result});
        });
    });

    app.get("/addfood", function(req, res){
        res.render("./addfood.html", { title: 'AddFood', food: {}});
    });

    app.post("/foodadded", function(req, res){
        // saving data in database
        let sqlquery = "INSERT INTO foods (name, typicalValue, unit, calories, carbs, fat, protein, salt, sugar) VALUES (?,?,?,?,?,?,?,?,?);";
        // execute sql query
        let newrecord = [req.body.name, req.body.typicalValue, req.body.unit, req.body.calories, req.body.carbs, req.body.fat, req.body.protein, req.body.salt, req.body.sugar];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.error(err.message);
                res.render("./error.html", { title: 'Error', error: err.message});
            } else {
                req.body.id = result.insertId; // SELECT LAST_INSERT_ID();
                res.render("./foodadded.html", { title: 'AddFood', food: req.body});
            }; 
        });
    });
    
    app.get("/update", function(req, res){
        if (req.query.id) { // update the food item with id
            // searching in the database
            let word = [req.query.id];
            let sqlquery = "SELECT * FROM foods WHERE id = ?;";

            // execute sql query
            db.query(sqlquery, word, (err, result) => {
                if (err) {
                    var error_msg = "An error has occured. Please see the following error message: " + err.message;
                    console.error(error_msg);
                    return res.render("./error.html", { title: 'Update', error: error_msg});
                } else {
                    if (result.length === 0) {
                        var error_msg = "No food item found with id = " + req.query.id + ", maybe it has already been deleted.";
                        return res.render("./error.html", { title: 'Update', error: error_msg});
                    }
                    return res.render("./update.html", { title: 'Update', food: result[0] });
                }
            });
        }
        else {
            res.render("./search.html", { title: 'Update'});
        }
    });

    app.post("/foodupdated", function(req, res){
        // saving data in database
        let sqlquery = "UPDATE foods SET name=?, typicalValue=?, unit=?, calories=?, carbs=?, fat=?, protein=?, salt=?, sugar=? WHERE id=?;";
        // execute sql query
        let update_record = [req.body.name, req.body.typicalValue, req.body.unit, req.body.calories, req.body.carbs, req.body.fat, req.body.protein, req.body.salt, req.body.sugar, req.body.id];
        db.query(sqlquery, update_record, (err, result) => {
            if (err) {
                console.error(err.message);
                res.render("./error.html", { title: 'Error', error: err.message});
            } else {
                res.render("./foodupdated.html", { title: 'Update', food: req.body});
            }; 
        });
    });

    app.post("/fooddeleted", function(req, res){
        // deleting data from database
        let sqlquery = "DELETE FROM foods WHERE id=?;";
        // execute sql query
        let delete_record = [req.body.id];
        db.query(sqlquery, delete_record, (err, result) => {
            if (err) {
                console.error(err.message);
                res.render("./error.html", { title: 'Error', error: err.message});
            } else {
                res.render("./fooddeleted.html", { title: 'Food Deleted', food: req.body});
            }; 
        });
    });

    app.get("/search-result", (req, res) => {
        // searching in the database
        let word = ['%' + req.query.keyword + '%'];
        let sqlquery = "SELECT * FROM foods WHERE name like ? ORDER BY name;";

        // execute sql query
        db.query(sqlquery, word, (err, result) => {
            if (err) {
                var error_msg = "No food item found with the keyword you have entered: " + req.query.keyword + "; error: "+ err.message
                console.error(error_msg);
                res.render("./error.html", { title: 'Search', error: error_msg});
                //res.redirect("./search"); //this can also be used in case of an error instead of the above line
            } else {
                //step 1:(this will only shows the collected form-data) for debugging purpose only
                // res.send(req.query);
                //step 2: (this shows keyword in collected form-data) for debugging purpose only
                //res.send("This is the keyword you entered: " + req.query.keyword+ ".<br><br>This is the result of the search:<br>");
                //step3: (this will show the result of the search) for debugging purpose only
                //res.send(result);
                //step4: (this will show the result of the search using an ejs template file, list.ejs can be used here)
                res.render ('./list.html', { title: 'Search', keyword: req.query.keyword, food_items: result });
            }
        });
    });

    app.use((req, res, next) =>{
        res.render('./404.html', { title: 'Results' });
    });

}