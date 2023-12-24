const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";
const dropDown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
window.addEventListener("load", () => {
    updateExchangeRate();
})
for (let select of dropDown) {
    for (currCode in countryList) {
       let newOption = document.createElement("option");
       newOption.innerHTML = currCode;
       newOption.value = currCode;
       if(select.name === "from" && currCode == "USD"){
        newOption.selected = "selected";
       }else if(select.name === "to" && currCode == "INR"){
        newOption.selected = "selected";
       }
       select.append(newOption);
    }
    select.addEventListener("change" ,(evt) => {
        upDateFlag(evt.target);
    });
}
const upDateFlag = (element) => {
    let currCode = element.value;
    let countrycode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
    let img = element.parentElement.querySelector("img")
    img.src = newSrc;
};

btn.addEventListener("click",(evt) => {
    evt.preventDefault();
    updateExchangeRate();
});
const updateExchangeRate = async() => {
    let amount = document.querySelector(".amount input");
    let amnValue = amount.value;
    if(amnValue === "" || amnValue < 1){
        amnValue = 1;
        amount.value = "1";
    }
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;
    let responce = await fetch(URL);
    let data = await responce.json();
    let rate = data[toCurr.value.toLowerCase()];
    
    let finalAmount = amnValue * rate;
    msg.innerText = `${amnValue} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`
}