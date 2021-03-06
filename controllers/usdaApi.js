var request = require('request');

function foodSearch(query, callback) {
  var data = 'no results';
  var url = 'https://api.nal.usda.gov/ndb/search/?format=json&q=' + query + '&ds=Standard Reference&max=1&api_key=WaKpXBFRRj4A6YcAcgNCi9DzIi2HSHTi2tqyyHcZ';
  ; console.log(url)
  request(url, function (error, response, body) {
    if (error) throw error;
    var results = JSON.parse(body);
    var foodItem = results.list.item[0].ndbno;
    console.log(foodItem);
    callback(foodItem);
  });
}

function nutrientSearch(ndbno, callback) {
  var url = 'https://api.nal.usda.gov/ndb/V2/reports?ndbno=' + ndbno + '&type=f&format=json&api_key=WaKpXBFRRj4A6YcAcgNCi9DzIi2HSHTi2tqyyHcZ'
  request(url, function (error, response, body) {
    if (error) throw error;
    var stats = []
    body = JSON.parse(body)
    var nutrients = body.foods[0].food.nutrients
    for (var i = 0; i < nutrients.length; i++) {
      var nutriName = nutrients[i].name
      var nutriValue = nutrients[i].value
      var nutriUnit = nutrients[i].unit
      if (nutriName === 'Protein' || nutriName === 'Carbohydrate, by difference' || nutriName === 'Fiber, total dietary' || nutriName === 'Sugars, total' || nutriName === 'Cholesterol' || nutriName === 'Total lipid (fat)') {
        nutrients[i].formattedName = nutriName + ' ' + nutriValue + nutriUnit;
        stats.push(nutrients[i]);
        // console.log(nutriName + ' ' +nutriUnit + ' ' + nutriValue)      
      }
    }
    callback(stats);
  });


}

function findNutrientsByFoodName(foodName, callback) {
  foodSearch(foodName, function (nbdno) {
    nutrientSearch(nbdno, function (results) {
      callback(results);
    });
  });
}

function findNutrientsByRecipeName(query, foodName, callback) {

  var data = 'no results';
  var url =  query 
  ; console.log(url)
  request(url, function (error, response, body) {
    if (error) throw error;
    var results = JSON.parse(body);
    var foodItem = results.list.item[0].ndbno;
    console.log(foodItem);
    callback(foodItem);
  });
}
module.exports = {
  foodSearch: foodSearch,
  nutrientSearch: nutrientSearch,
  findNutrientsByFoodName: findNutrientsByFoodName
};
