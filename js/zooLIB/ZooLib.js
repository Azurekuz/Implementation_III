class ZooLib{
    constructor(params) {
        this.zoneManager = new ZoneManager();
        this.currentTime = new Date();
        this.availableAnimals = null;
        console.log("ZooLib successfully created!");
    }

    incrementTime(){
        this.zoneManager.increment();
    }

    importProfiles(profiles){
        this.availableAnimals = profiles;
    }

    populateZones(numZones){
        this.zoneManager.populate(numZones);
    }

    populateZones(numZones, profiles){
        this.zoneManager.populate(numZones, profiles);
    }

    fetchZoneTitle(zoneID){
        return this.zoneManager.getZoneName(zoneID);
    }

    fetchZone(zoneID){
        return this.zoneManager.getZone(zoneID);
    }

    areAllLocked(){
        return this.zoneManager.areAllLocked();
    }

    areAllFed(){
        return this.zoneManager.areAllFed();
    }

    areAllWatered(){
        return this.zoneManager.areAllWatered();
    }

    toggleAllLock(bool){
        this.zoneManager.toggleAllLock(bool);
    }

    toggleAllFeed(bool){
        this.zoneManager.toggleAllFeed(bool);
    }

    toggleAllWater(bool){
        this.zoneManager.toggleAllWater(bool);
    }
}

class Profile{
    constructor(name, feedTime){
        this.typeName = name;
        //Recommended feeding interval
        this.recFeedInterval = feedTime;
        this.alive = true;
    }

    getRecFeedingInterval(){
        return this.recFeedInterval;
    }

    die(){
        this.alive = false;
    }
}

class ProfileManager{
    constructor(){
        this.profiles = [];
    }

    populate(){
        this.profiles.push(new Profile("Tiger", 15));
        this.profiles.push(new Profile("Lion", 20));
        this.profiles.push(new Profile("Zebra", 30));
        this.profiles.push(new Profile("Gazelle", 28));
        this.profiles.push(new Profile("Sea Lion", 22));
        this.profiles.push(new Profile("Penguin", 21));
        this.profiles.push(new Profile("Orangutan", 23));
        this.profiles.push(new Profile("Giraffe", 29));
        this.profiles.push(new Profile("Birds", 32));
        this.profiles.push(new Profile("Snakes", 17));

    }
}

class Pen{
    constructor(animalType = null){
        this.animalType = animalType;
        this.locked = true;
        this.beingFed = true;
        this.lastFed = 0;
        if(animalType == null){
            this.curInterval;
        }else{
            this.curInterval = this.animalType.getRecFeedingInterval();
        }
    }

    increment(){
        this.lastFed += 1;
        if(this.isStarving() && this.beingFed && this.animalType.alive && ((this.lastFed - this.curInterval) >= 0)){
            this.feed();
        }else if(this.isStarving() && !this.beingFed){

        }
        if(this.starveToDeath()){

        }
    }

    isLocked(){
        return this.locked;
    }

    toggleLock(){
        this.locked = !this.locked;
    }

    setLock(state){
        this.locked = state;
    }

    getProfile(){
        return this.animalType;
    }

    isStarving(){
        if((this.lastFed - this.animalType.getRecFeedingInterval())>=0){
            return true;
        }else{
            return false;
        }
    }

    canBeFed(curTime){
        if(this.isStarving(curTime)){
            return true;
        }else{
            return false;
        }
    }

    isGoodInterval(interval){
        if(interval >= this.animalType.getRecFeedingInterval()){
            return true;
        }else{
            return false;
        }
    }

    feed(){
        this.lastFed = 0;
    }

    starveToDeath(curTime){
        if((this.lastFed-(this.animalType.getRecFeedingInterval()*2))>=0){
            this.animalType.die();
            return true;
        }
        return false;
    }

    getRecFeedingInterval(){
        return this.animalType.getRecFeedingInterval();
    }

    getCurrentInterval(){
        return this.curInterval;
    }

    getLast(){
        return this.lastFed;
    }

    toggleFeed(){
        this.beingFed = !this.beingFed;
    }

    getBeingFed(){
        return this.beingFed;
    }

    setInterval(newInterval){
        curSetInterval = newInterval;
    }
}

class PenManager{
    constructor(){
        this.pens = [];
    }

    getStatus(mode){
        switch(mode){
            case 0:
                var lockCount = 0;
                var unlockCount = 0;
                for(var penID = 0; penID < this.pens.length; penID++){
                    if(this.pens[penID].locked){
                        lockCount += 1;
                    }else{
                        unlockCount += 1;
                    }
                }
                return "title=\"Locked: " + lockCount + " | Unlocked: "+ unlockCount + "\"";
                break;
            case 2:
                var fedCount = 0;
                var unfedCount = 0;
                for(var penID = 0; penID < this.pens.length; penID++){
                    if(this.pens[penID].beingFed){
                        fedCount += 1;
                    }else{
                        unfedCount += 1;
                    }
                }
                return "title=\"Fed: " + fedCount + " | Unfed: "+ unfedCount + "\"";
                break;
        }
    }

    increment(){
        for(var penID = 0; penID < this.pens.length; penID++){
            this.pens[penID].increment();
        }
    }

    populate(maxPens){
        var ranNumPens = Math.floor(Math.random()*maxPens+1);
        for(var newPen = 0; newPen < ranNumPens; newPen++){    
            this.pens.push(new Pen());   
        }
    }

    populate(maxPens, animalProfiles){
        var ranNumPens = Math.floor(Math.random()*maxPens+1);
        for(var newPen = 0; newPen < ranNumPens; newPen++){    
            this.pens.push(new Pen(animalProfiles[Math.floor(Math.random()*(animalProfiles.length))]));   
        }
    }

    getPen(penID){
        return this.pens[penID];
    }

    getLocked(penID){
        return this.pens[penID].isLocked();
    }

    toggleLock(penID){
        this.pens[penID].toggleLock();
    }

    setLock(penID, state){
        this.pens[penID].setLock(state);
    }

    areAllLocked(){
        for(var pen=0; pen<this.pens.length;pen++){
            if(!this.pens[pen].isLocked()){
                return false;
            }
        }
        return true;
    }

    lockAllPens(){
        for(var pen=0; pen<this.pens.length;pen++){
            this.pens[pen].setLock(true);
        }
    }

    unlockAllPens(){
        for(var pen=0; pen<this.pens.length;pen++){
            this.pens[pen].setLock(false);
        }
    }

    isStarving(penID, curTime){
        this.pens[penID].isStarving(curTime);
    }

    canBeFed(penID, curTime){
        this.pens[penID].canBeFed(curTime);
    }

    isGoodInterval(penID, interval){
        this.pens[penID].isGoodInterval(interval);
    }

    feed(penID, curTime){
        this.pens[penID].feed(curTime);
    }

    starveToDeath(penID, curTime){
        this.pens[penID].starveToDeath(curTime);
    }

    getRecFeedingInterval(penID){
        return this.pens[penID].getRecFeedingInterval();
    }

    getCurrentInterval(penID){
        return this.pens[penID].getCurrentInterval();
    }

    getLast(penID){
        return this.pens[penID].getLast();
    }

    toggleFeed(penID){
        this.pens[penID].toggleFeed();
    }

    getBeingFed(penID){
        return this.pens[penID].getBeingFed();
    }

    areAllFed(){
        for(var pen=0; pen<this.pens.length;pen++){
            if(!this.pens[pen].getBeingFed()){
                return false;
            }
        }
        return true;
    }

    toggleAllLock(bool){
        for(var penID = 0; penID< this.pens.length; penID++){
            this.pens[penID].locked = bool;
        }
    }

    toggleAllFeed(bool){
        for(var penID = 0; penID< this.pens.length; penID++){
            this.pens[penID].beingFed = bool;
        }
    }
}

class Zone{
    constructor(name, profiles){
        this.zoneName = name;
        this.penManager = new PenManager();
        this.penManager.populate(10, profiles);
        this.isWatering = true;
        this.recWaterInterval = 10;
        this.setWaterInterval = this.recWaterInterval;
        this.lastWatered = 0;
    }

    getStatus(mode){
        switch(mode){
            case 0:
                return this.penManager.getStatus(mode);
                break;
            case 1:
                if(this.isWatering){
                    return "title=\"Sprinklers are turned on.\""
                }else{
                    return "title=\"Sprinklers are turned off.\""
                }
                break;
            case 2:
                return this.penManager.getStatus(mode);
                break;
        }
    }

    increment(){
        this.lastWatered += 1;
        this.water();
        this.penManager.increment();
    }

    setRecommendedInterval(newInterval){
        this.recWaterInterval = newInterval;
    }

    setWaterInterval(newInterval){
        this.setWaterInterval = newInterval;
    }

    getNumberPens(){
        return this.penManager.pens.length;
    }

    fetchPen(penID){
        return this.penManager.getPen(penID);
    }

    fetchLocked(penID){
        return this.penManager.getLocked(penID);
    }

    toggleLock(penID){
        this.penManager.toggleLock(penID);
    }

    setLock(penID, state){
        this.penManager.setLock(penID, state);
    }

    checkAllLocked(){
        return this.penManager.areAllLocked();
    }

    lockAllPens(){
        this.penManager.lockAllPens();
    }

    unlockAllPens(){
        this.penManager.unlockAllPens();
    }

    getCurrentFeedingInterval(penID){
        return this.penManager.getCurrentInterval(penID);
    }

    getLastWater(){
        return this.lastWatered;
    }

    getLastFed(penID){
        return this.penManager.getLast(penID);
    }

    toggleFeed(penID){
        this.penManager.toggleFeed(penID);
    }

    getBeingFed(penID){
        return this.penManager.getBeingFed(penID);
    }

    toggleWatering(){
        this.isWatering = !this.isWatering;
    }

    water(){
        if(this.isWatering && (this.lastWatered-this.setWaterInterval)>=0){
            this.lastWatered = 0;
        }
    }

    areAllLocked(){
        return this.penManager.areAllLocked();
    }

    areAllFed(){
        return this.penManager.areAllFed();
    }

    toggleAllLock(bool){
            this.penManager.toggleAllLock(bool);
    }

    toggleAllFeed(bool){
            this.penManager.toggleAllFeed(bool);
    }
}

class ZoneManager{
    constructor() {
        this.zones = [];
    }

    getStatus(zoneID, mode){
        return this.zones[zoneID].getStatus(mode);
    }

    increment(){
        for(var zoneID = 0; zoneID < this.zones.length; zoneID++){
            this.zones[zoneID].increment();
        }
    }

    populate(numZones){
        for(var num=0;num<numZones;num++){
            this.zones.push(new Zone("Zone " + (this.zones.length + 1)));
        }
    }

    populate(numZones, profiles){
        for(var num=0;num<numZones;num++){
            this.zones.push(new Zone("Zone " + (this.zones.length + 1), profiles));
        }
    }

    getZone(zoneID){
        return this.zones[zoneID];
    }

    getZoneName(zoneID){
        return this.zones[zoneID].zoneName;
    }

    areAllLocked(){
        for(var zoneID = 0; zoneID < this.zones.length; zoneID++){
            if(!this.zones[zoneID].areAllLocked()){
                return false;
            }
        }
        return true;
    }

    areAllFed(){
        for(var zoneID = 0; zoneID < this.zones.length; zoneID++){
            if(!this.zones[zoneID].areAllFed()){
                return false;
            }
        }
        return true;
    }

    areAllWatered(){
        for(var zoneID = 0; zoneID < this.zones.length; zoneID++){
            if(!this.zones[zoneID].isWatering){
                return false;
            }
        }
        return true;
    }

    toggleAllLock(bool){
        for(var zoneID = 0; zoneID < this.zones.length; zoneID++){
            this.zones[zoneID].toggleAllLock(bool);
        }
    }

    toggleAllFeed(bool){
        for(var zoneID = 0; zoneID < this.zones.length; zoneID++){
            this.zones[zoneID].toggleAllFeed(bool);
        }
    }

    toggleAllWater(bool){
        for(var zoneID = 0; zoneID < this.zones.length; zoneID++){
            this.zones[zoneID].isWatering = bool;
        }
    }
}