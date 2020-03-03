this.profileManager = new ProfileManager();
this.profileManager.populate();
this.drawerNav = new DrawerNav(50);
this.zooManager = new ZooLib();
this.zooManager.importProfiles(this.profileManager.profiles);
this.zooManager.populateZones(10, this.zooManager.availableAnimals);
var currentHover = null;
var curZone = null;
var curPen = null;
var curSetInterval = null;
var activePenElement = null
var currentUI = null;
var alerts = [];

function setupZoneOnHover(){
    zoneList = document.getElementsByClassName("zone");
    for(var zoneID = 0; zoneID < zoneList.length; zoneID++){
        zoneList[zoneID].onmouseover = zoneOnHover;
        zoneList[zoneID].onmouseout = zoneOffHover;
    }
}

function zoneOnHover(mouseEvent){
    if(mouseEvent.fromElement.id == "main-html" && mouseEvent.toElement.nodeName == "DIV"){
        currentHover = mouseEvent.target.id.substring(5);
        var element = document.getElementById("status-"+currentHover);
        element.style.visibility="visible";
    }
}

function zoneOffHover(mouseEvent){
    var element = document.getElementById("status-"+currentHover);
    if(mouseEvent.toElement.id == "main-html"){
        element.style.visibility="hidden";
    }else if((mouseEvent.fromElement.nodeName == "A" && mouseEvent.toElement.id == "main-html") 
    || (mouseEvent.fromElement.nodeName == "LI" && mouseEvent.toElement.id == "main-html")){
        document.getElementById("status-" + currentHover).style.visibility="hidden";
    }
}

function toggle(){
    this.drawerNav.toggle();
    document.getElementsByClassName("navToggle")[0].innerHTML = displayCorrectToggleState();
}

function displayCorrectToggleState(){
    if(!this.drawerNav.getState()){
        return "▲ <br> <b>Master Controls<b>"
    }else{
        return "▼"
    }
}

function updateHoverInfo(){
    elements = document.getElementsByClassName("status-all-locks");
    for(var element = 0; element < elements.length; element++){
        elements[element].innerHTML = "<a " + getStatus(element, 0) + "><i class=\"fa fa-lock\"></i></a>"
    }

    elements = document.getElementsByClassName("status-all-fed");
    for(var element = 0; element < elements.length; element++){
        elements[element].innerHTML = "<a " + getStatus(element, 2)+ "><i class=\"fa fa-cutlery\"></i></a>"
    }

    elements = document.getElementsByClassName("status-all-water");
    for(var element = 0; element < elements.length; element++){
        elements[element].innerHTML = "<a " + getStatus(element, 1)+ "><i class=\"fa fa-tint\"></i></a>"
    }
}

function getStatus(zone, mode){
    return this.zooManager.zoneManager.getStatus(zone, mode);
}

function getFeedInfo(zoneID){

}

function getFeedInfo(){
    
}

function displayOverlay(zoneID){
    document.getElementById("status-"+currentHover).style.visibility = "hidden";
    curZone = this.zooManager.fetchZone(zoneID);
    document.getElementsByClassName("zone-info")[0].style.opacity = "100%";
    document.getElementsByClassName("zone-overlay")[0].style.width = "100%";
    document.getElementsByClassName("zone-overlay")[0].style.height = "100%";
    document.getElementsByClassName("zone-overlay-back")[0].style.opacity = "100%";
    document.getElementsByClassName("zone-overlay")[0].style.opacity = "100%";
    document.getElementsByClassName("zone-overlay-back")[0].style.width = "100%";
    document.getElementsByClassName("zone-overlay-back")[0].style.height = "100%";
    document.getElementsByClassName("zone-overlay-back")[0].style.opacity = "100%";

    document.getElementById("zone-info-title").innerHTML = curZone.zoneName;
    document.getElementById("zone-info-description").innerHTML = "This is a description for " + curZone.zoneName;
    console.log(curZone);
}

function switchTo(mode){
    switch(mode){
        case 0:
            displayGateUI();
            break;
        case 1:
            displayFeedUI();
            break;
        case 2:
            displayWaterUI();
            break;
    }
}

function displayFeedUI(){
    currentUI = null;
    document.getElementsByClassName("zone-pens")[0].innerHTML = "<h2>Feeding</h2><a class=\"button\" id=\"water-mode\" onclick=\"switchTo(2)\">Water</a><a class=\"button active\" id=\"feed-mode\" onclick=\"switchTo(1)\">Food</a> <a class=\"button\" id=\"gate-mode\" onclick=\"switchTo(0)\">Gates</a><br><ul class=\"pen-list\"></ul><br>";
    console.log("Displaying Feed UI");
    var penList = document.getElementsByClassName("pen-list")[0];
    penList.innerHTML = "";
    for(var pen = 0; pen < curZone.getNumberPens();pen++){
        penList.innerHTML += "<li class=\"pen\" onclick=\"displayFeedSettings(" + pen + ")\"><a"+ " id=" + "\"pen-" + (pen+1) +"\">Pen " + (pen+1) + "</a></li>";
        if((pen+1)%4==0){
            penList.innerHTML += "<br>";
        }
    }
    var currentUI = document.getElementsByClassName("zone-pens")[0];
    currentUI.innerHTML += "<div class=\"feed-settings\"></div>";
}

function displayFeedSettings(penID){
    getFeedPen(penID);
}

function displayFeedInfo(penID){
    currentUI = document.getElementsByClassName("feed-settings")[0];
    curSetInterval = curZone.getCurrentFeedingInterval(penID);
    currentUI.innerHTML = "";
    currentUI.innerHTML += "<hr><h2>Feed Settings</h2><a class=\"button\" id=\"feed-toggle\" onclick=\"toggleFeed("+penID+")\">Feed?</a><br><p><b>Pen Animal: </b>"+ curPen.animalType.typeName +"<br><b class=\"rfi\" title=\"Recommended Feeding Interval\"><u>RFI:</u></b> Every "+ curPen.animalType.getRecFeedingInterval() +" hours<br><b>Last Fed: </b>" + curZone.getLastFed(penID)+ " hour(s) ago</p><br><p style=\"margin:0;float:left\"><b>Current Interval</b></p>";
    currentUI.innerHTML += "<div class=\"feed-adjustor\"><a class=\"current-feed-time\" id=\""+penID+"\">"+ curSetInterval +" hour(s)</a><a class=\"button\" id=\"feed-plus\" onclick=\"plusIntervalDisplay(0)\">+</a><a class=\"button\" id=\"feed-minus\" onclick=\"minusIntervalDisplay(0)\">-</a><a class=\"button\" id=\"feed-submit\" onclick=\"submitInterval()\"><i class=\"fa fa-check\"></i></a></div>";
    displayAlerts();
    displayProperFeed(penID);
    starveCheck();
}

function displayAlerts(){
    currentUI.innerHTML += "<br><br>"
    for(var alert = 0; alert < alerts.length; alert++){
        currentUI.innerHTML += "<p class=\"alert-feed\" style=\"margin:0;padding:0;text-align:left;color:"+alerts[alert][2]+"\">" + alerts[alert][0] + "</p><br>";
    }
}

function pushAlert(alert, color){
    if(!alerts.includes(alert)){
        alerts.push([alert, 0, color]);
    }
}

function incAlertExpiration(){
    for(var alert = 0; alert < alerts.length; alert++){
        alerts[alert][1] += 1;
    }
}

function cleanAlert(){
    if(alerts.length != 0){
        incAlertExpiration();
        if(alerts[0][1]>=5){
            alerts.shift();
        }
    }
}

function updateFeedIntervalDisplay(){
    cleanAlert();
    currentUI = document.getElementsByClassName("feed-settings")[0];
    currentUI.innerHTML = "";
    currentUI.innerHTML += "<hr><h2>Feed Settings</h2><a class=\"button\" id=\"feed-toggle\" onclick=\"toggleFeed("+(parseInt(activePenElement.id.substring(4))-1)+")\">Feed?</a><br><p><b>Pen Animal: </b>"+ curPen.animalType.typeName +"<br><b class=\"rfi\" title=\"Recommended Feeding Interval\"><u>RFI:</u></b> Every "+ curPen.animalType.getRecFeedingInterval() +" hours<br><b>Last Fed: </b>" + curZone.getLastFed(parseInt(activePenElement.id.substring(4))-1)+ " hour(s) ago</p><br><p style=\"margin:0;float:left\"><b>Current Interval</b></p>";
    currentUI.innerHTML += "<div class=\"feed-adjustor\"><a class=\"current-feed-time\" id=\""+(parseInt(activePenElement.id.substring(4))-1)+"\">"+ curSetInterval +" hour(s)</a><a class=\"button\" id=\"feed-plus\" onclick=\"plusIntervalDisplay(0)\">+</a><a class=\"button\" id=\"feed-minus\" onclick=\"minusIntervalDisplay(0)\">-</a><a class=\"button\" id=\"feed-submit\" onclick=\"submitInterval()\"><i class=\"fa fa-check\"></i></a></div>";
    displayAlerts();
    displayProperFeed(parseInt(activePenElement.id.substring(4))-1);
    starveCheck();
}

function starveCheck(){
    if(curPen.isStarving()){
        pushAlert(curPen.animalType.typeName + " is hungry!", "#ff8080")
    }
}

function minusIntervalDisplay(mode){
    if(curSetInterval >= 1){
        curSetInterval -= 1;
    }
    switch(mode){
        case 0:
            updateFeedIntervalDisplay();
            break;
        case 1:
            updateWaterUI();
            break;
    }
}

function plusIntervalDisplay(mode){
    if(curSetInterval <= 98){
        curSetInterval += 1;
    }
    switch(mode){
        case 0:
            updateFeedIntervalDisplay();
            break;
        case 1:
            updateWaterUI();
    }
}

function submitWaterInterval(){
    curZone.setWaterInterval = curSetInterval;
    pushAlert("Sprinkler Interval successfully changed to " + curZone.setWaterInterval + "!", "green");
    
}

function submitInterval(){
    if(curSetInterval >= curPen.getRecFeedingInterval()){
        curPen.curInterval = curSetInterval;
        pushAlert("Feed Interval successfully changed to " + curPen.curInterval + "!", "#a0fa7d");
    }else{
        intervalAlert();
    }
}

function intervalAlert(){
    pushAlert("You\'d overfeed the " + curPen.animalType.typeName + "!", "#ff8080");
}

function getFeedPen(penID){
     if(curPen == curZone.fetchPen(penID)){
        document.getElementById("pen-"+(penID+1)).classList.toggle("active");
        document.getElementsByClassName("feed-settings")[0].innerHTML = "";
        console.log(document.getElementById("pen-"+(penID+1)));
        curPen = null;
        activePenElement.classList.remove("active");
        activePenElement = null;
    }else{
        if(activePenElement!=null){
            activePenElement.classList.remove("active");
        }
        curPen = curZone.fetchPen(penID);
        displayFeedInfo(penID);
        console.log(document.getElementById("pen-"+(penID+1)));
        document.getElementById("pen-"+(penID+1)).classList.toggle("active");
        activePenElement = document.getElementById("pen-"+(penID+1));
    }
}

function displayProperWater(){
    if(curZone.isWatering){
        document.getElementById("water-on").style.backgroundColor = "green";
        document.getElementById("water-on").style.color = "color:rgba(77, 130, 214, 1)"
        document.getElementById("water-on").innerHTML = "On";
    }else{
        document.getElementById("water-on").style.backgroundColor = "red";
        document.getElementById("water-on").style.color = "color:rgba(77, 130, 214, 1)" 
        document.getElementById("water-on").innerHTML = "Off";
    }
    if(curSetInterval != curZone.setWaterInterval){
        document.getElementsByClassName("current-water-time")[0].style.color = "#ff8080";
    }
}

function displayProperFeed(penID){
    if(curZone.getBeingFed(penID)){
        document.getElementById("feed-toggle").style.backgroundColor = "green";
        document.getElementById("feed-toggle").style.color = "color:rgba(77, 130, 214, 1)"
    }else{
        document.getElementById("feed-toggle").style.backgroundColor = "red";
        document.getElementById("feed-toggle").style.color = "color:rgba(77, 130, 214, 1)" 
    }
    if(curSetInterval != curPen.curInterval){
        document.getElementsByClassName("current-feed-time")[0].style.color = "#ff8080";
    }
}

function toggleFeed(penID){
    curZone.toggleFeed(penID);
    displayProperFeed(penID);
}

function displayWaterUI(){
    currentUI = document.getElementsByClassName("zone-pens")[0];
    curSetInterval = curZone.setWaterInterval;
    activePenElement = null;
    curPen = null;
    document.getElementsByClassName("zone-pens")[0].innerHTML = "<h2>Sprinkler</h2><a class=\"button active\" id=\"water-mode\" onclick=\"switchTo(2)\">Water</a><a class=\"button\" id=\"feed-mode\" onclick=\"switchTo(1)\">Food</a> <a class=\"button\" id=\"gate-mode\" onclick=\"switchTo(0)\">Gates</a><br><ul class=\"pen-list\"></ul><br>";
    console.log("Displaying Water UI");
    currentUI.innerHTML += "<div class=\"water-settings\"></div>";
    currentUI = document.getElementsByClassName("water-settings")[0];
    currentUI.innerHTML = "<p id=\"last-water-label\"><b>Last Watered: </b>" + curZone.getLastWater() + " hours ago</p><a class=\"button\" id=\"water-on\" onclick=\"toggleSprinker()\">On?</a><br><p style=\"margin:0;float:left\"><b>Current Interval</b></p>";
    currentUI.innerHTML += "<div class=\"water-adjustor\"><a class=\"current-water-time\">"+ curSetInterval +" hour(s)</a><a class=\"button\" id=\"water-plus\" onclick=\"plusIntervalDisplay(1)\">+</a><a class=\"button\" id=\"water-minus\" onclick=\"minusIntervalDisplay(1)\">-</a><a class=\"button\" id=\"water-submit\" onclick=\"submitWaterInterval()\"><i class=\"fa fa-check\"></i></a></div>";
    displayAlerts();
    displayProperWater();
}

function updateWaterUI(){
    cleanAlert();
    currentUI.innerHTML = "<p id=\"last-water-label\"><b>Last Watered: </b>" + curZone.getLastWater() + " hours ago</p><a class=\"button\" id=\"water-on\" onclick=\"toggleSprinker()\">On?</a><br><p style=\"margin:0;float:left\"><b>Current Interval</b></p>";
    currentUI.innerHTML += "<div class=\"water-adjustor\"><a class=\"current-water-time\">"+ curSetInterval +" hour(s)</a><a class=\"button\" id=\"water-plus\" onclick=\"plusIntervalDisplay(1)\">+</a><a class=\"button\" id=\"water-minus\" onclick=\"minusIntervalDisplay(1)\">-</a><a class=\"button\" id=\"water-submit\" onclick=\"submitWaterInterval()\"><i class=\"fa fa-check\"></i></a></div>";
    displayAlerts();
    displayProperWater();
}

function toggleSprinker(){
    curZone.toggleWatering();
    displayProperWater();
}

function displayGateUI(){
    currentUI = null;
    activePenElement = null;
    curPen = null;
    document.getElementsByClassName("zone-pens")[0].innerHTML = "<h2>Locks</h2><a class=\"button\" id=\"water-mode\" onclick=\"switchTo(2)\">Water</a><a class=\"button\" id=\"feed-mode\" onclick=\"switchTo(1)\">Food</a> <a class=\"button active\" id=\"gate-mode\" onclick=\"switchTo(0)\">Gates</a><br><ul class=\"pen-list\"></ul><br><a class=\"button\" id=\"lock-all\" onclick=\"contextLock()\"><i class=\"fa fa-unlock-alt\"></i> All</a>";
    var penList = document.getElementsByClassName("pen-list")[0];
    penList.innerHTML = "";
    for(var pen = 0; pen < curZone.getNumberPens();pen++){
        penList.innerHTML += "<li class=\"pen\" onclick=toggleLock(" + pen + ")><a"+ " id=" + "\"pen-" + (pen+1) +"\">Pen " + (pen+1) + "<br>" + getProperLockSymbol(pen) + "</a></li>";
        useProperColor(("pen-" + (pen+1)), curZone.fetchLocked(pen));
        if((pen+1)%4==0){
            penList.innerHTML += "<br>";
        }
    }
    updateLockAllBtn();
}

function displayCorrect(bool, id){
    if(bool){
        document.getElementById(id).style.backgroundColor = "green";
        document.getElementById(id).style.color = "color:rgba(77, 130, 214, 1)"
    }else{
        document.getElementById(id).style.backgroundColor = "red";
        document.getElementById(id).style.color = "color:rgba(77, 130, 214, 1)" 
    }

}

function areAllLocked(){
    this.zooManager.toggleAllLock(!this.zooManager.areAllLocked());
    displayCorrect(this.zooManager.areAllLocked(), "all-lock");
    if(this.zooManager.areAllLocked()){
        alert("All pens in the zoo have been locked!");
    }else{
        alert("All pens in the zoo have been unlocked!");
    }
}

function areAllFed(){
    this.zooManager.toggleAllFeed(!this.zooManager.areAllFed());
    displayCorrect(this.zooManager.areAllFed(), "all-fed");
    if(this.zooManager.areAllFed()){
        alert("All feeding systems in the zoo have been activated!");
    }else{
        alert("All feeding systems in the zoo have been deactivated!");
    }
}

function areAllWatered(){
    this.zooManager.toggleAllWater(!this.zooManager.areAllWatered());
    displayCorrect(this.zooManager.areAllWatered(), "all-water");
    if(this.zooManager.areAllWatered()){
        alert("All sprinkler systems in the zoo have been turned on!");
    }else{
        alert("All sprinkler systems in the zoo have been turned off!");
    }
}

function getInfo(zoneID, mode=0){
    displayOverlay(zoneID);
    switchTo(mode);
}

function updateLockAllBtn(){
    var lockAllBtn = document.getElementById("lock-all");
    lockAllBtn.innerHTML = setProperBtnLock() + " All"
}

function contextLock(){
    var penList = document.getElementsByClassName("pen-list")[0];
    penList.innerHTML = "";
    if(!curZone.checkAllLocked()){
        lockAllPens();
    }else{
        unlockAllPens();
    }
    for(var pen = 0; pen < curZone.getNumberPens();pen++){
        penList.innerHTML += "<li class=\"pen\" onclick=toggleLock(" + pen + ")><a"+ " id=" + "\"pen-" + (pen+1) +"\">Pen " + (pen+1) + "<br>" + getProperLockSymbol(pen) + "</a></li>";
        useProperColor(("pen-" + (pen+1)), curZone.fetchLocked(pen));
        if((pen+1)%4==0){
            penList.innerHTML += "<br>";
        }
    }
    updateLockAllBtn();
}

function lockAllPens(){
    curZone.lockAllPens();
}

function unlockAllPens(){
    curZone.unlockAllPens();
}

function setProperBtnLock(){
    if(curZone.checkAllLocked()){
        return "<i class=\"fa fa-unlock-alt\"></i>"
    }else{
        return "<i class=\"fa fa-lock\"></i>"
    }
}

function getProperLockSymbol(curPen){
    if(curZone.fetchLocked(curPen)){
        return "<i style=\"font-size:30px\" class=\"fa fa-lock\"></i>"
    }else{
        return "<i style=\"font-size:30px\" class=\"fa fa-unlock-alt\"></i>"
    }
}

function useProperColor(elementID, locked){
    if(locked){
        document.getElementById(elementID).style.backgroundColor="green";
    }else{
        document.getElementById(elementID).style.backgroundColor="red";
    }
}

function toggleLock(penID){
    curZone.toggleLock(penID);
    document.getElementById("pen-"+(penID+1)).innerHTML = "Pen " + (penID+1) + "<br>" + getProperLockSymbol(penID);
    useProperColor(("pen-"+(penID+1)),curZone.fetchLocked(penID));
    updateLockAllBtn();
}

function dismissInfo(){
    document.getElementsByClassName("zone-info")[0].style.opacity = "0%";
    document.getElementsByClassName("zone-overlay")[0].style.width = "0%";
    document.getElementsByClassName("zone-overlay")[0].style.height = "0%";
    document.getElementsByClassName("zone-overlay")[0].style.opacity = "0%";
    document.getElementsByClassName("zone-overlay-back")[0].style.width = "0%";
    document.getElementsByClassName("zone-overlay-back")[0].style.height = "0%";
    document.getElementsByClassName("zone-overlay-back")[0].style.opacity = "0%";
    currentUI = null;
    curPen = null;
    curZone = null;
    activePenElement.classList.remove("active");
}

var totalTime = 0;
function update(){
    totalTime += 1;
    if(currentUI==null){
        return;
    }
    if(currentUI.className == "feed-settings"){
        updateFeedIntervalDisplay();
    }else if(currentUI.className == "water-settings"){
        updateWaterUI();
    }
}

function nothing(){
    //Do nothing
}

this.tick = true;
const tick = setInterval(function() {
    this.zooManager.incrementTime();
    update();
    updateHoverInfo();
  }, 1000);

 //clearInterval(tick);

 setupZoneOnHover();
 //toggle();
 displayCorrect(areAllLocked, "all-lock");
 displayCorrect(areAllFed, "all-fed");
 displayCorrect(areAllWatered, "all-water");