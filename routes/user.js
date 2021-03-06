


/* ------------------------------------------------------------------- */
/* -------------------------- EVENT ROUTES --------------------------- */
/* ------------------------------------------------------------------- */


var express         = require("express"),
    User            = require("../models/user"),
    Event           = require("../models/event"),
    passport        = require("passport"),
    router          = express.Router();    

/* --------------------------- INDEX ROUTE --------------------------- */

// Get a list of all users, we don't want that -- 404

/*router.get("/", function(req,res) {
   console.log("NOTHING HERE");
});*/

/* ---------------------------- NEW ROUTE ---------------------------- */

router.get("/new", function(req,res) {  
    res.render("user/new");
});

/* --------------------------- CREATE ROUTE -------------------------- */

router.post("/", function(req,res, next) { 
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function(err, response) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            passport.authenticate('local')(req,res, function() {
                req.flash("success", "Thank you for registering " + newUser.username + ". You are now logged in");
                res
                    .status(200)
                    .redirect("/user/" + response._id );
            });
        }
    });
});


/* ---------------------------- SHOW ROUTE --------------------------- */

router.get("/:id", function(req,res,next) {
        User.findById(req.params.id, function(err, foundUser) {
        if(err) {
           next(err);
        } else {
            if(req.query.futureEvents) {
                findAllFutureEvents(foundUser, res, req.query.futureEvents, next);
            } else {
                findAllUserEvents(foundUser, res, next);
            }
        }
    });
});

// find all events that belong to user
function findAllUserEvents(foundUser, res, next) {
    Event.find( { 'author.id' : foundUser._id } ).sort({date: 1}).exec(function(err, foundEvents) {
       if(err) {
           next(err);
       } else {
           res.render("user/show", {user: foundUser, events : foundEvents, checked: "false"});
       }
    });
}

// find all events after todayDate that belong to user
function findAllFutureEvents(foundUser, res, todayDate, next) {
    Event.find( { 'author.id' : foundUser._id, 'date' : {$gt:todayDate} } ).sort({date: 1}).exec(function(err, foundEvents) {
        if(err) {
           next(err);
       } else {
           res.render("user/show", {user: foundUser, events : foundEvents, checked: "true"});
       }
    });
}


/* ---------------------------- EDIT ROUTE --------------------------- */

// None , no need since we don't keep info about users
/*router.get("/:id/edit", function(req,res) {
        
});*/

/* --------------------------- UPDATE ROUTE -------------------------- */
// none, since no edit route
/*router.put("/:id", function(req, res) {

});*/

/* --------------------------- DESTROY ROUTE ------------------------- */

// none, since user can't delete his account
/*router.delete("/:id", function(req,res) {

});*/


/* ------------------------------------------------------------------ */
/* ----------------------------- EXPORT ----------------------------- */
/* ------------------------------------------------------------------ */

module.exports = router;