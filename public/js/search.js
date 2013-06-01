// /*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:2, maxerr:50 */
// /*global _:true */
// (function($){
//     "use strict";
    
//     var petitionData = [],
//         petitions = [], // this will be an array containing the title and ID
//         petitionTitles, // used for the typeahead/autocomplete input
//         ENDPOINT = 'https://api.whitehouse.gov/v1/petitions.jsonp';
    
//     var loadPetitions = function(offset){
//         offset = offset || 0;
//         $.getJSON(ENDPOINT + '?limit=1000&offset=' + offset + '&callback=?', function(data){
//             var resultset = data.metadata.resultset,
//                     results = data.results;

//             petitionData = petitionData.concat(results);
//             if (resultset.count - offset > resultset.limit){
//                 loadPetitions(resultset.offset + resultset.limit + 1);
//             } else {
//                 $('body').trigger('petitionsLoaded');
//             }

//         });
//     };
    
//     var mapPetitions = function(){
        
//         petitions = _.map(petitionData, function(p){
//                 var pet = {};
//                 pet.title = p.title;
//                 pet.id = p.id;
//                 return pet;
//             });

//             //Attach petitionTitles to autocomplete widget
//         petitionTitles = _.pluck(petitions, "title");
//         $('#petition-search').typeahead({
//             source: petitionTitles,
//             minLength: 2

//         });
//         $('body').trigger('autocompleteLoaded');
//     };

//     var getPetitionId = function(){
//         $('#search').on("click", function(e){
//             e.preventDefault();
//             var needle = $('#title-search').val(),
//                     host = document.location.host,
//                     iframe,
//                     result,
//                     theme;
//             result = _.find(petitions, function(p){
//                 return p.title === needle;
//             });
            
//             theme = $('.theme-selector input:checked').val();
//             theme = theme ? "?theme=" + theme : '';
//             //Build iframe code
//             iframe = '<iframe src="//' +
//                     host + '/widget/' + result.id + theme +
//                     '" style="width: 100%; height: 265px; border: 0;" scrolling="no"></iframe>';
//             $('#generated-widget').val(iframe);
            
//             // Populate preview area
//             $('#preview-inner').html(iframe);
//         });
//     };
    
//     $('#spinner').fadeIn();
//     loadPetitions();
//     getPetitionId();
//     $('body').on('petitionsLoaded', mapPetitions);
//     $('body').on('autocompleteLoaded', function(){
//         $('#spinner').fadeOut();
//     });
// }(jQuery));