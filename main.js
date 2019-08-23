const URL = [`https://api.mfapi.in/mf/146127`, `https://server-for-portfolio.herokuapp.com`];
const alternateURL = `https://www.quandl.com/api/v3/datasets/AMFI/146127.json`;

var value = document.getElementById("value");
var details = document.getElementById("details");
const units = [
                [1473.4770, 1428.5710, 979.4320, 1990.0500],
                [216.296]
            ];
const totalUnits = units.map(a => a.reduce((r, v) => r + v, 0));
const startDate = [
                    [new Date("March 10, 2019"), new Date("May 28, 2019"), new Date("June 06, 2019"), new Date("July 02, 2019")],
                    [new Date("August 21, 2019")]
                ];
const startNAV = [
                    [10.18, 10.50, 10.21, 10.05],
                    [46.233]
                ];
const startValue = startNAV.map((a, i) => Math.round(a.reduce((r, a, j) => r + a * units[i][j], 0)));
const totalStartValue = startValue.reduce((r, a) => r + a, 0)
var totalCurrentValue = 0, currentValue = [], currentNAV = [];

let calculate = (async _ => {
    for(const i in URL) {
        await axios.get(URL[i])
            .then(res => res.data)
            .then(res => {
                if(res.status !== "SUCCESS") {
                    value.innerHTML = "Error";
                } else {
                    var currentStats = res.data[0];
                    currentStats.nav = Math.round(currentStats.nav * 100) / 100;
                    currentNAV.push(currentStats.nav)
                    currentStats.value = Math.round(totalUnits[i] * currentStats.nav * 100) /100;
                    totalCurrentValue += currentStats.value
                    currentValue.push(currentStats.value)
                }
            })

        if (i == URL.length - 1) {
            display();
        }
    }
})();


let display = async _ => {
    if(totalCurrentValue >= totalStartValue)
        value.classList.add("green");
    else
        value.classList.add("red");
    value.innerHTML = "Rs. " + totalCurrentValue.toLocaleString('en', {useGrouping:true}) + " (" + (totalCurrentValue - totalStartValue).toLocaleString('en', {useGrouping:true}) + ")";

    details.innerHTML += "<br />Indiviual values:&emsp;"
    currentValue.forEach((v, i) => {
        let Class = "green";
        if (v < startValue[i])
            Class = "red"
        if(i != currentValue.length - 1)
            details.innerHTML += `<span class=${Class}>` + (v).toLocaleString('en', {useGrouping:true}) + "</span> | ";
        else
            details.innerHTML += `<span class=${Class}>` + (v).toLocaleString('en', {useGrouping:true}) + "</span>";
    })

    details.innerHTML += "<br />Investment Amounts:&emsp;"
    startValue.forEach((v, i) => {
        if(i != startValue.length - 1)
        details.innerHTML += (v).toLocaleString('en', {useGrouping:true}) + " | ";
        else
        details.innerHTML += (v).toLocaleString('en', {useGrouping:true});
    })

    details.innerHTML += "<br />Current NAV's:&emsp;"
    currentNAV.forEach((v, i) => {
        if(i != currentNAV.length - 1)
            details.innerHTML += (v).toLocaleString('en', {useGrouping:true}) + " | ";
        else
            details.innerHTML += (v).toLocaleString('en', {useGrouping:true});
    })
}
