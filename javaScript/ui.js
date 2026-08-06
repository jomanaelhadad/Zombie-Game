let canvas;
let context;
let menu;
let shop;
let settings;
let buySkin2;
let buySkin3;
let buttons = [];
let buyBtns = [];
 


let BtnState = {
    menuState: { open: false },
    shopState: { open: false },
    settingState: { open: false },
}

let skinState = {
    default: { state: "equipped" },
    skin2: { state: "unowned" },
    skin3: { state: "unowned" }
}


document.addEventListener("DOMContentLoaded", initUI, false);

function initUI() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");
    GameUI();
    draw();
}


function draw() {
    DrawMenu();
    DrawShop();
    requestAnimationFrame(draw)
}


function GameUI() {

    canvas.addEventListener("click", handleClick)

    menu = { x: 440, y: 10, width: 50, height: 40 }

    shop = GenerateObjects(440, 55, "Shop", 50, 30)
    settings = GenerateObjects(440, 90, "Settings", 50, 30)

    buySkin2 = GenerateObjects(150, 300, "Buy Skin", 50, 30)
    buySkin3 = GenerateObjects(270, 300, "Buy Skin", 50, 30)


    buttons.push(shop);
    buttons.push(settings);

    buyBtns.push(buySkin2)
    buyBtns.push(buySkin3)

}

function handleClick(e) {
    let x = e.offsetX;
    let y = e.offsetY;

    if (Offset(x, y, menu)) { BtnState.menuState.open = !BtnState.menuState.open }

    if (BtnState.menuState.open) {
        if (Offset(x, y, shop)) { BtnState.shopState.open = !BtnState.shopState.open; }
        if (Offset(x, y, settings)) { BtnState.settingState.open = !BtnState.settingState.open; console.log("setting") }
    }


    if (BtnState.shopState.open) {
        if (Offset(x, y, settings)) { BtnState.shopState.open = false; BtnState.settingState.open = true; }
        if (Offset(x, y, buySkin2)) { skinState.skin2.state = !skinState.skin2.state; console.log("working") }
        if (Offset(x, y, buySkin3)) { skinState.skin3.state = !skinState.skin3.state; console.log("working again") }

    }


    if (BtnState.settingState.open) {
        if (Offset(x, y, shop)) { BtnState.shopState.open = true; BtnState.settingState.open = false; }
    }

}

function DrawMenu() {

    context.clearRect(0, 0, canvas.width, canvas.height)
    if (BtnState.shopState.open) { ColorBackground("pink") }
    if (BtnState.settingState.open) { ColorBackground("rgb(51, 47, 82)") }

    context.fillStyle = "white";
    context.fillRect(menu.x, menu.y, menu.width, menu.height);
    GenerateText("15px Arial", "black", "Menu", menu, 5, 25);


    if (BtnState.menuState.open) {
        for (let i of buttons) {
            context.fillStyle = "rgb(192, 93, 192)"
            context.fillRect(i.x, i.y, i.width, i.height)
            let dynamic = i.text;
            if (BtnState.shopState.open && i.text === "Shop" || BtnState.settingState.open && i.text === "Settings") { dynamic = "Home" }
            GenerateText("12px Arial", "black", dynamic, i, 2, 22)
        }
    }

    if (!BtnState.shopState.open && !BtnState.settingState.open) { GenerateText("30px Arial", "black", "Welcome", menu, -250, 35) }

    if (BtnState.settingState.open) { GenerateText("30px Arial", "black", "Settings", settings, -240, -50) }
    
}


function DrawShop() {
    if (BtnState.shopState.open) { GenerateText("30px Arial", "black", "Welcome to the Shop", shop, -330, -10) }

    if (BtnState.shopState.open) {
        for (let i of buyBtns) {
            context.fillStyle = "rgb(192, 93, 192)"
            context.fillRect(i.x, i.y, i.width, i.height)
            let dynamic = i.text;
            if (skinState.skin2.state === "unowned") { dynamic = "Buy Skin"; }
            GenerateText("12px Arial", "black", dynamic, i, 2, 22);

        }


    }
}



function Offset(x, y, rect) {
    return (
        x > rect.x &&
        x < rect.x + rect.width &&
        y > rect.y &&
        y < rect.y + rect.height
    );
}



function GenerateText(style, color, text, thing, x, y) {
    context.font = style;
    context.fillStyle = color;
    context.fillText(text, thing.x + x, thing.y + y);
}


function GenerateObjects(x, y, text, width, height) {
    return { x, y, text, width, height }
}


function ColorBackground(color) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
}


export { initUI }