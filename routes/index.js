module.exports = {
    
    index: function(req,res){
        // var env = process.env.ENVIRONMENT === "production" ? 
            
        res.render('index.html', { 
            title: "We the People Dashboard",
            scripts: '[typeahead.js]'
            }
        );
    }
};