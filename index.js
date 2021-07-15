const express = require('express');
const https=require('https');
const ejs=require('ejs');
const bodyParser=require("body-parser");
const app=express();

const port=process.env.PORT || 3000
var search_arr=[];
var search_value;
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get("/",(req,res)=>{;
    const url="https://api.covid19api.com/summary";
    
    https.get(url, function(response){
        var data;

        response.on("data", function(chunk) {
          if (!data) {
            data = chunk;
          } else {
            data += chunk;
          }
        });
    
        response.on("end", function() {
            const Global_data=JSON.parse(data);
            // console.log(Global_data.Global);
            
            var NewConfirmed=Global_data.Global.NewConfirmed;
            var NewDeaths=Global_data.Global.NewDeaths;
            var NewRecovered=Global_data.Global.NewRecovered;
            var TotalConfirmed=Global_data.Global.TotalConfirmed;
            var TotalDeaths=Global_data.Global.TotalDeaths;
            var TotalRecovered=Global_data.Global.TotalRecovered;
            var LastUpdated=Global_data.Global.Date.slice(0,10);
            
            res.render("Global",{NC:NewConfirmed,ND:NewDeaths,NR:NewRecovered,TC:TotalConfirmed,TD:TotalDeaths,TR:TotalRecovered,LUP:LastUpdated});
        });
    });
});

app.route("/country").get((req,res)=>{
  const url="https://api.covid19api.com/summary";
  https.get(url, function(response){
      var data;
      response.on("data", function(chunk) {
        if (!data) {
          data = chunk;
        } else {
          data += chunk;
        }
      });
      
      response.on("end", function() {
          const country_data=JSON.parse(data);  
          var c_NewConfirmed=country_data.Countries[0].NewConfirmed;
          var c_NewDeaths=country_data.Countries[0].NewDeaths;
          var c_NewRecovered=country_data.Countries[0].NewRecovered;
          var c_TotalConfirmed=country_data.Countries[0].TotalConfirmed;
          var c_TotalDeaths=country_data.Countries[0].TotalDeaths;
          var c_TotalRecovered=country_data.Countries[0].TotalRecovered;
          var c_LastUpdated=country_data.Countries[0].Date.slice(0,10); 
          var country=country_data.Countries[0].Country;

          res.render("country",{c_name:country,c_NC:c_NewConfirmed,c_ND:c_NewDeaths,c_NR:c_NewRecovered,c_TC:c_TotalConfirmed,c_TD:c_TotalDeaths,c_TR:c_TotalRecovered,c_LUP:c_LastUpdated});
      });
  });
}).post((req,res)=>{
  search_value=req.body.country_name;
  // console.log(search_value);
  const url="https://api.covid19api.com/summary";
  https.get(url, function(response){
      var data;
      response.on("data", function(chunk) {
        if (!data) {
          data = chunk;
        } else {
          data += chunk;
        }
      });
      
      response.on("end", function() {
          const country_data=JSON.parse(data);  
              for(var i=0;i<191;i++){
                      search_arr.push(country_data.Countries[i].Country);
              }
              // console.log(search_arr);
              var index=search_arr.indexOf(search_value);
              console.log(index);

              if(index!=-1){
                  var c_NewConfirmed=country_data.Countries[index].NewConfirmed;
                  var c_NewDeaths=country_data.Countries[index].NewDeaths;
                  var c_NewRecovered=country_data.Countries[index].NewRecovered;
                  var c_TotalConfirmed=country_data.Countries[index].TotalConfirmed;
                  var c_TotalDeaths=country_data.Countries[index].TotalDeaths;
                  var c_TotalRecovered=country_data.Countries[index].TotalRecovered;
                  var c_LastUpdated=country_data.Countries[index].Date.slice(0,10); 
                  var country=country_data.Countries[index].Country;

                  res.render("country",{c_name:country,c_NC:c_NewConfirmed,c_ND:c_NewDeaths,c_NR:c_NewRecovered,c_TC:c_TotalConfirmed,c_TD:c_TotalDeaths,c_TR:c_TotalRecovered,c_LUP:c_LastUpdated});
          }else{
              var data_not_found=search_value+" is Not found";
              res.render("country",{c_name:data_not_found,c_NC:'0',c_ND:'0',c_NR:'0',c_TC:'0',c_TD:'0',c_TR:'0',c_LUP:'0000-00-00'});
          }
      });
  });
  // res.render('country');

});


app.listen(port,()=>{
    console.log("Server started at the port "+port);
})
