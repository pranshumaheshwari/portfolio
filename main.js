const URL = `https://api.mfapi.in/mf/146127`;
const alternateURL = `https://www.quandl.com/api/v3/datasets/AMFI/146127.json`;

var value = document.getElementById("value");
var details = document.getElementById("details");
const units = [1473.4770, 1428.5710, 979.4320, 1990.0500];
const totalUnits = units.reduce((a, b) => a + b);
const startDate = [new Date("March 10, 2019"), new Date("May 28, 2019"), new Date("June 06, 2019"), new Date("July 02, 2019")];
const startNAV = [10.18, 10.50, 10.21, 10.05];
const startValue = Math.round(startNAV.reduce((r, a, i) => r + a * units[i], 0));

axios.get(URL)
     .then((res => res.data))
     .then(res => {
        if(res.status !== "SUCCESS") {
            value.innerHTML = "Error";
        } else {
            var currentStats = res.data[0];
            currentStats.nav = Math.round(currentStats.nav * 100) / 100;
            currentStats.value = Math.round(totalUnits * currentStats.nav * 100) /100;
            if(currentStats.value >= startValue)
                value.classList.add("green");
            else
                value.classList.add("red");

            value.innerHTML = "Rs. " + currentStats.value.toLocaleString('en', {useGrouping:true}) + " (" + (currentStats.value - startValue).toLocaleString('en', {useGrouping:true}) + ")";
            details.innerHTML += "<br />Current NAV: " + (currentStats.nav).toLocaleString('en', {useGrouping:true});
            details.innerHTML += "<br />Investment Amount: " + startValue.toLocaleString('en', {useGrouping:true});
            details.innerHTML += "<br />Scheme Name: " + res.meta.scheme_name;
        }
     });