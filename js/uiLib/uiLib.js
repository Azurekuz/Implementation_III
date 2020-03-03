class Bar{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.type;
        this.minimum;
        this.maximum;
        this.current;
    }

    setup(type, min, max){
        this.type = type;
        this.minimum = min;
        this.maximum = max;
    }

    setCurrent(current){
        this.current = current;
    }

    fetchPercentage(){
        return Math.floor((current/maximum)*100);
    }
}

class Button{
    constructor(width, height){
        this.width = width;
        this.height = height;
    }

    onclick(){
        //Do Something...
    }
}

class DrawerNav{
    constructor(openHeight){
        this.element = document.getElementById("drawer-nav");
        console.log(document.getElementById("drawer-nav"));
        this.openHeight = openHeight;
        this.opened = false;
    }

    open(){
        this.element.style.height = this.openHeight + "px";
        //console.log(document.getElementsByClassName("navToggle")[0].style);
        document.getElementsByClassName("navToggle")[0].style.marginBottom = this.openHeight + "px";
        document.getElementsByClassName("nav-options")[0].style.height = "100%";
        //document.getElementsByClassName("nav-options")[0].style.width = "auto";
    }

    close(){
        console.log(document.getElementsByClassName("navToggle"));
        document.getElementsByClassName("navToggle")[0].style.marginBottom = 0 + "px";
        this.element.style.height = 0;
    }

    toggle(){
        if(this.opened){
            this.close();
        }else if(!this.opened){
            this.open();
        }
        this.opened = !this.opened;
    }

    getState(){
        return this.opened;
    }
}

class DropDown{
    constructor(width, height, choices){
        this.width = width;
        this.height = height;
        this.choices = choices;
    }
}

class Toggle{
    constructor(){
        this.isToggled = false;
    }

    setToggle(isToggled){
        this.isToggled = isToggled;
    }

    toggle(){
        this.isToggled = !this.isToggled;
    }
}

console.log("uiLib successfully included!");