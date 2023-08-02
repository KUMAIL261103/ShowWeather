const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".main-container");
const grantAccessContainer = document.querySelector(".grant-location-access");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen= document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".User-info-container");
const API_key ="4cb627cea073c6b0374c9eebfdfe3115";
let currentTab =userTab;
currentTab.classList.add("current-Tab");
getfromSessionStorage();
userTab.addEventListener("click",()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-Tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-Tab");
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove ("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}
function getfromSessionStorage(){
    const localCoordination = sessionStorage.getItem("user-coordinates");
    if(!localCoordination){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordination);
        fetchuserWInfo(coordinates);

    }

}
async function fetchuserWInfo(coordinates){
    const {lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await res.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }catch(err){
            loadingScreen.classList.remove("active");
    }
}
function renderWeatherInfo(data){
        const cityName = document.querySelector("[data-cityName]");
        const countryIcon = document.querySelector("[data-countryIcon]");
        const desc = document.querySelector("[data-weatherDesc]");
        const weatherIcon = document.querySelector("[data-weatherIcon]");
        const temp = document.querySelector("[data-temp]");
        const windspeed = document.querySelector("[data-windspeed]");
        const humidity = document.querySelector("[data-humidity]");
        const cloudness = document.querySelector("[data-clouds]");
        cityName.innerText =data?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
        desc.innerText = data?.weather?.[0]?.description;
        weatherIcon.src =`https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
        temp.innerText = `${(data?.main?.temp).toFixed(2)} °C` ;
        windspeed.innerText =`${(data?.wind?.speed).toFixed(2)} m/s`;
        cloudness.innerText = `${data?.clouds?.all} %` ;
        humidity.innerText = `${data?.main?.humidity} %`;
}

const grantAccessbtn = document.querySelector("[data-grantAccess]");
grantAccessbtn.addEventListener("click",  getloction);
function getloction(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
            alert(" location acccess permission denied")
    }
}
function showPosition(position){
    const userCoordinate = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",  JSON.stringify(userCoordinate));
    fetchuserWInfo(userCoordinate);
}
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let City_name = searchInput.value;
    
    if(City_name===""){
        return;
    }
    fetchSearchWeatherinfo(City_name);
});
async function fetchSearchWeatherinfo( city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`)
    const data = await res.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
}catch(e){
    userInfoContainer.classList.remove("active");
    const displayerror =document.createElement("img");
    displayerror.src="weatherAppProject/weatherAppProject/assets/not-found.png";
    userContainer.appendChild(displayerror);

    console.log(`error bhai ${e}` );
}

}




