/***                   
TITLE : CA2
LAST UPDATED : 14/04/26 
***/


/***  GLOBAL VARIABLES  ***/
let canvas;
let context;
let request;
let elapsed;
let fpsInterval = 1000 / 25;
let now;
let then = Date.now();
let cameraX = 0;
let cameraY = 0
let speed = 4;
let currentBg;

/***  UI COLORS  ***/
let UIcolor = "rgb(192, 93, 192)"

/***  MENU ***/
let buttons = [];
let color = ""

// buttons used as flags to know whether a button is open or closed 
let BtnState = {
    // UI BTNS
    menuState: false,
    shopState: false,
    settingState: false,

    //GAME BTNS
    playState: false,
    reviveState: false,
    pauseState: false,
    levelState: false,

    // BUY BTNS
    default: false,
    buy2: false,
    buy3: false,

    // AUDIO SETTINGS BTNS
    increase: false,
    decrease: false,
}

let UI = {
    menu: null,
    play: null,
    pause: null,
    revive: null,
    nextLevel: null,

    shop: {
        defaultSkin: null,
        buySkin2: null,
        buySkin3: null
    },

    settings: {
        decreaseAudio: null,
        increaseAudio: null,
        easy: null,
        medium: null,
        hard: null,
        impossible: null,
        insane: null
    }
}

/***  SETTINGS  ***/
let settingsBtns = [];
let msg = "";
let modeMsg = ""; 

/***  SHOP  ***/
let buyBtns = [];
let statusMsg = "";

let skinState = {
    default: { state: "equipped", power: 1 },
    skin2: { state: "unowned", power: 1.5 },
    skin3: { state: "unowned", power: 3 }
}
let skinPrices = {
    default: 0,
    skin2: 399,
    skin3: 999
}
/***  BACKGROUND ***/
let Background = {
    imgLevel1: { image: new Image(), url: "assets/background/image1.png" },
    imgLevel2: { image: new Image(), url: "assets/background/image2.png" },
    imgLevel3: { image: new Image(), url: "assets/background/image3.png" },
    imgLevel4: { image: new Image(), url: "assets/background/image4.png" },
}
// background loop image 
let BgLoop = [
    Background.imgLevel1.image,
    Background.imgLevel2.image,
    Background.imgLevel3.image,
    Background.imgLevel4.image,
]
/***  AUDIO  ***/
let sounds = {
    clickSound: { audio: new Audio(), volume: 0.8, url: "assets/sound/clickSound.wav" },
    soundtrack: { audio: new Audio(), volume: 0.2, url: "assets/sound/soundtrack.wav" },
    attackSound: { audio: new Audio(), volume: 0.6, url: "assets/sound/attack.mp3" },
    enemyAttack: { audio: new Audio(), volume: 0.6, url: "assets/sound/enemyAttack.mp3" },
    enemyDead: { audio: new Audio(), volume: 0.6, url: "assets/sound/enemyDead.wav" },
    playerDead: { audio: new Audio(), volume: 0.4, url: "assets/sound/playerDead.wav" },
    playerHurt: { audio: new Audio(), volume: 0.4, url: "assets/sound/playerHurt.mp3" },
    coinAudio: { audio: new Audio(), volume: 1, url: "assets/sound/coin.wav" },
    levelUp: { audio: new Audio(), volume: 0.8, url: "assets/sound/levelUp.wav" },
    countdown: { audio: new Audio(), volume: 1, url: "assets/sound/countdown.wav" },
    broke: { audio: new Audio(), volume: 1, url: "assets/sound/noCoins.mp3" },

}

/***  OBJECTS  ***/
// all Control related things including flags and variables 
let GameControls = {
    gameOver: false,
    spawnTimer: 0,
    spawnInterval: 2000,
    levelComplete: false
}

// GAME DIFFICULTY LEVELS
let difficulty = {
    easy: { mode: "Easy", enemyHealth: 50, enemyMaxHealth: 50, enemyDamage: 10, enemySpeed: 2, enemySpawn: 3 },
    medium: {  mode: "Medium",  enemyHealth: 75, enemyMaxHealth: 75, enemyDamage: 15, enemySpeed: 4, enemySpawn: 6 },
    hard: {  mode: "Hard",  enemyHealth: 95, enemyMaxHealth: 95, enemyDamage: 20, enemySpeed: 6, enemySpawn: 9 },
    impossible: {  mode: "Impossible", enemyHealth: 120, enemyMaxHealth: 120, enemyDamage: 25, enemySpeed: 8, enemySpawn: 11 },
    insane: {  mode: "Insane", enemyHealth: 145, enemyMaxHealth: 145, enemyDamage: 30, enemySpeed: 9, enemySpawn: 13 }
}
let activeDifficulty = difficulty.easy

let LevelManager = {
    timer: 100, // seconds 
    currentTime: 100,
}
// Stats of the game 
let GameStats = {
    kills: 0,
    maxKills: 0,
    maxScore: 0,
    score: 0,
    level: 1,
    coins: 0,
    damageTimer: 0,
    damageCoolDown: 10,
    enemyDamageTimer: 0,
    enemyDamageCoolDown: 10,
    targetScore: 150
}

// Skins and player images 
let skins = {
    default: {
        walk: { image: new Image(), frames: 4, url: "assets/player/walk.png" },
        idle: { image: new Image(), frames: 6, url: "assets/player/idle.png" },
        run: { image: new Image(), frames: 8, url: "assets/player/run.png" },
        attack: { image: new Image(), frames: 8, url: "assets/player/attack.png" },
        dead: { image: new Image(), frames: 7, url: "assets/player/death.png" },
        hurt: { image: new Image(), frames: 5, url: "assets/player/hurt.png" }
    },
    skin2: {
        walk: { image: new Image(), frames: 4, url: "assets/skin2/walk.png" },
        idle: { image: new Image(), frames: 6, url: "assets/skin2/idle.png" },
        run: { image: new Image(), frames: 8, url: "assets/skin2/run.png" },
        attack: { image: new Image(), frames: 8, url: "assets/skin2/attack.png" },
        dead: { image: new Image(), frames: 7, url: "assets/skin2/death.png" },
        hurt: { image: new Image(), frames: 5, url: "assets/skin2/hurt.png" },
    },
    skin3: {
        walk: { image: new Image(), frames: 4, url: "assets/skin3/walk.png" },
        idle: { image: new Image(), frames: 6, url: "assets/skin3/idle.png" },
        run: { image: new Image(), frames: 8, url: "assets/skin3/run.png" },
        attack: { image: new Image(), frames: 8, url: "assets/skin3/attack.png" },
        dead: { image: new Image(), frames: 7, url: "assets/skin3/death.png" },
        hurt: { image: new Image(), frames: 5, url: "assets/skin3/hurt.png" },
    }
}

let activeSkins = skins.default

// object that lets me know which row in the sprite sheet is down, left, right or up 
let playerRows = {
    down: 0,
    left: 1,
    right: 2,
    up: 3
}
let enemies = []
let enemyImages = {
    walk: { image: new Image(), frames: 6, url: "assets/enemies/enemy_walk.png" },
    idle: { image: new Image(), frames: 4, url: "assets/enemies/enemy_idle.png" },
    run: { image: new Image(), frames: 8, url: "assets/enemies/enemy_run.png" },
    attack: { image: new Image(), frames: 8, url: "assets/enemies/enemy_attack.png" },
    dead: { image: new Image(), frames: 8, url: "assets/enemies/enemy_death.png" },
    hurt: { image: new Image(), frames: 6, url: "assets/enemies/enemy_hurt.png" }
}
let enemyRows = {
    down: 0,
    up: 1,
    left: 2,
    right: 3
}
let player = {
    x: 0, y: 170,
    width: 64,
    height: 64,
    frameX: 0,
    frameY: 0,
    facing: "down",
    state: "walk",
    health: 100,
    maxHealth: 100,
};
let keys = {
    moveLeft: false,
    moveUp: false,
    moveRight: false,
    moveDown: false,
    sprint: false,
    attack: false
}


document.addEventListener("DOMContentLoaded", init, false);


function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);


    currentBg = Background.imgLevel1.image

    let assets = []

    GameUI();

    //using for loops to loop through the game assets objects ! 
    for (let skinKey in skins) {
        for (let key in skins[skinKey]) {
            assets.push({
                "var": skins[skinKey][key].image, url: skins[skinKey][key].url
            })
        }
    }

    for (let key in enemyImages) {
        assets.push({
            "var": enemyImages[key].image, url: enemyImages[key].url
        })
    }

    for (let key in sounds) {
        sounds[key].audio.volume = sounds[key].volume
        assets.push({
            "var": sounds[key].audio, url: sounds[key].url
        })
    }

    for (let key in Background) {
        assets.push({
            "var": Background[key].image, url: Background[key].url
        })
    }


    load_assets(assets, draw)

    //enemy spawn 
    for (let i = 0; i < 3; i++) {
        EnemySpawn()
    }



}



/***  DRAW FUNCTIONS  ***/

function draw() {
    request = window.requestAnimationFrame(draw);

    let now = Date.now();
    elapsed = now - then;
    if (elapsed <= fpsInterval) { return; }
    then = now - (elapsed % fpsInterval);


    // only draw game when play button is pressed or state = open 
    if (BtnState.playState && !BtnState.pauseState) {
        DrawGame();
        sounds.soundtrack.audio.loop = true;
    }
    if (GameStats.score > GameStats.maxScore) {
        GameStats.maxScore = GameStats.score;
    }
    if (GameStats.kills > GameStats.maxKills) {
        GameStats.maxKills = GameStats.kills;
    }


    // invoking functions 
    DrawMenu();
    DrawShop();
    DrawSettings();

    console.log({
        pause: BtnState.pauseState,
        menu: BtnState.menuState,
        play: BtnState.playState,
        shop: BtnState.shopState,
        settings: BtnState.settingState
    });


}
function DrawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    ColorBackground("#13295C")

    DrawBackground(currentBg)
    Movement();


    DrawEntity(player, activeSkins, playerRows);
    HealthBar(player);

    for (let enemy of enemies) {
        Collision(enemy, player);
        EnemyDistance(enemy)
        Attack(enemy, player);
        Chasing(enemy, player);
        HealthBar(enemy);
        DrawEntity(enemy, enemyImages, enemyRows);
    }

    // highest kills and XP
    if (GameStats.score > GameStats.maxScore) { GameStats.maxScore = GameStats.score; }
    if (GameStats.kills > GameStats.maxKills) { GameStats.maxKills = GameStats.kills; }


    Levels();

    // Game UI drawing 
    DrawBorder("XP: ", GameStats.score, 15, 40, "white");
    DrawBorder("Coins: ", GameStats.coins, 15, 65, "white");
    DrawBorder("Kills: ", GameStats.kills, 15, 90, "white");
    DrawBorder("Level: ", GameStats.level, 15, 115, "white");
    DrawBorder("Highest XP: ", GameStats.maxScore, 15, 140, "black");
    DrawBorder("Highest Kills: ", GameStats.maxKills, 15, 165, "black");
    DrawBorder("Mode: ", activeDifficulty.mode , 15, 190, "black");



    DrawTimer();
    PlayerDead();


}
// handing the UI Btns click event 
function GameUI() {

    canvas.addEventListener("click", handleClick);

    // MENU 
    UI.menu = Objects(680, 10, "Menu", 60, 40);

    // GAME 
    UI.play = Objects(620, 10, "Play", 50, 40);
    UI.pause = Objects(550, 10, "Pause", 60, 40);
    UI.nextLevel = CenterObject("Next Level", 80, 40);
    UI.revive = CenterObject("Play Again", 140, 65);

    // SETTINGS 
    UI.settings = Objects(680, 90, "Settings", 60, 30);
    UI.settings.decreaseAudio = Objects(410, 250, "Decrease", 65, 30)
    UI.settings.increaseAudio = Objects(270, 250, "Increase", 65, 30)

    // DIFFICULTY SETTINGS 
    UI.settings.easy = Objects(150, 400, "Easy", 70, 30)
    UI.settings.medium = Objects(250, 400, "Medium", 70, 30)
    UI.settings.hard = Objects(350, 400, "Hard", 70, 30)
    UI.settings.impossible = Objects(450, 400, "Impossible", 70, 30)
    UI.settings.insane = Objects(550, 400, "Insane", 70, 30)



    // SHOP 
    UI.shop = Objects(680, 55, "Shop", 60, 30);
    UI.shop.defaultSkin = Objects(80, 330, "equipped", 75, 40);
    UI.shop.buySkin2 = Objects(300, 330, "Buy Skin", 75, 40);
    UI.shop.buySkin3 = Objects(510, 330, "Buy Skin", 75, 40);


    // Pushing objects to their lists 
    buttons.push(UI.shop);
    buttons.push(UI.settings);

    buyBtns.push(UI.shop.buySkin2);
    buyBtns.push(UI.shop.buySkin3);
    buyBtns.push(UI.shop.defaultSkin);

    settingsBtns.push(UI.settings.decreaseAudio);
    settingsBtns.push(UI.settings.increaseAudio);
    settingsBtns.push(UI.settings.easy);
    settingsBtns.push(UI.settings.medium);
    settingsBtns.push(UI.settings.hard);
    settingsBtns.push(UI.settings.impossible);
    settingsBtns.push(UI.settings.insane);



}
function DrawMenu() {
    if (!BtnState.playState || BtnState.pauseState) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }


    if (BtnState.shopState) { ColorBackground("pink") }
    if (BtnState.settingState) { ColorBackground("pink") }


    // if play button is true AND not shop OR settings 
    // Also implemented dynamic so text changes depending on the state
    if (BtnState.playState && !BtnState.shopState && !BtnState.settingState) {
        let dynamic = UI.pause.text
        if (BtnState.pauseState) { dynamic = "Unpause" }
        else { dynamic = "Pause" }
        DrawButton(UIcolor, UI.pause, "white", dynamic)
    }
    PauseScreen();


    // if NOT shop and NOT settings and NO play buttons are open 
    if (!BtnState.shopState && !BtnState.settingState && !BtnState.playState) {
        DrawTitle("#menuTitle", "ARE YOU READY?", true);
        DrawText("#menuText", "To play click the play button at the top right.", true)
        DrawText("#instructions", "HOW TO PLAY\n\n ->The goal is to fight as many enemies as you can before your 90 seconds countdown runs out.\n\n ->The timer decreases 20 second per new level as more enemies emerge.\n\nToo easy you say? Mhm sure ... Change the difficulty mode in settings! ", true)
    } else {
        // hiding the text 
        DrawTitle("#menuTitle", "", false)
        DrawText("#menuText", "", false)
        DrawText("#instructions", "", false)
    }

    // if NOT shop AND not settings draw play ( I wanted play to be visible with menu )
    if (!BtnState.shopState && !BtnState.settingState) {
        context.fillStyle = "rgb(226, 127, 226)"
        let dynamic = UI.play.text;
        if (BtnState.playState && UI.play.text === "Play") { dynamic = "Quit" }
        DrawButton(UIcolor, UI.play, "white", dynamic)
    }

    // if play and level complete AND NOT(shop AND settings)
    if (BtnState.playState && GameControls.levelComplete && (!BtnState.shopState && !BtnState.settingState)) {
        DrawButton(UIcolor, UI.nextLevel, "white", "Next Level")
    }

    // if play and player health is 0 ( dead ) AND not shop OR settings draw revive 
    if (BtnState.playState && player.health <= 0 && (!BtnState.shopState && !BtnState.settingState)) {
        DrawButton(UIcolor, UI.revive, "white", "Play Again")
    }


    DrawButton("white", UI.menu, UIcolor, "Menu")
    if (BtnState.menuState) {
        for (let i of buttons) {
            let dynamic = i.text;
            if (BtnState.shopState && i.text === "Shop" || BtnState.settingState && i.text === "Settings") { dynamic = "Home" }
            DrawButton("white", i, UIcolor, dynamic)

        }
    }

}


function DrawShop() {

    // condition where shop button is open and not settings to avoid conflict
    if (BtnState.shopState && !BtnState.settingState) {

        //doing a for loop to loop through the buyBtns list which has the skins objects 
        let keys = ["skin2", "skin3", "default"]
        for (let i = 0; i < buyBtns.length; i++) {


            let dynamic = buyBtns[i].text
            let skin = keys[i]
            let state = skinState[skin].state
            let price = skinPrices[skin]

            if (state === "unowned") { dynamic = `Buy $${price}` }
            else if (state === "owned") { dynamic = "Equip" }
            else if (state === "equipped") { dynamic = "Equipped" }

            DrawButton("white", buyBtns[i], UIcolor, dynamic)
        }

        context.font = "16px Arial";
        context.fillStyle = "#c20000";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(statusMsg, 374, 430)



        // double model size 
        let doubleWidth = player.width * 3.5;
        let doubleHeight = player.height * 3.5;
        let divide = canvas.width / 3  // 3 models in the canvas 


        // drawing skin models 
        DrawBorder("coins: ", GameStats.coins, 15, 40, "white");

        DrawModel(skins.default.idle.image, 90, 250, doubleWidth, doubleHeight);
        DrawModel(skins.skin2.idle.image, 320, 250, doubleWidth, doubleHeight);
        DrawModel(skins.skin3.idle.image, 525, 250, doubleWidth, doubleHeight);

    }
    if (BtnState.shopState && !BtnState.settingState) {
        DrawTitle("#shopTitle", "Welcome to the Shop", true);
        DrawText("#shopText", "Treat your self with some nice affordable skins!\n\nSkin level 2 has 50% more damage impact.\nSkin level 3 has 100% more damage impact.", true)
    } else {
        DrawTitle("#shopTitle", "", false);
        DrawText("#shopText", "", false)

    }
}

function PauseScreen() {
    if (!BtnState.pauseState) {
        DrawTitle("#gamePaused", "", false)
    }
    else {
        DrawTitle("#gamePaused", "GAME PAUSED", true);
    }
}


function DrawSettings() {
    if (BtnState.settingState && !BtnState.shopState) {
        DrawTitle("#settingTitle", "Settings", true);
        DrawText("#settingsBtn", "Volume controls: ", true)
        DrawText("#difficulty", "Difficulty", true)
    } else {
        DrawTitle("#settingTitle", "", false);
        DrawText("#settingsBtn", "", false)
        DrawText("#difficulty", "", false)
    }

    // looping through the settingsBtns && drawing them if settings is open
    if (BtnState.settingState) {
        for (let i of settingsBtns) { DrawButton(UIcolor, i, "white", i.text) }

        context.font = "15px Arial"
        context.fillStyle = "red"
        context.fillText(msg, 380, 300)

        context.font = "15px Arial"
        context.fillStyle = "red"
        context.fillText(modeMsg, 380, 450)
    
    }

}
function DrawBackground(img) {

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(
        img,
        0 - cameraX,
        0 - cameraY,
        canvas.width,
        canvas.height
    );
}
function DrawEntity(entity, sprites, rowMatch) {

    // row is the rowMatch ( either playerRow or enemyRow from above)
    // get its index and see where the entity is facing, default is 0 which is idle 
    let row = rowMatch[entity.facing] || 0;
    let double = 2


    let sheet = sprites[entity.state];

    // stop function here is no sheet inc ase of bugs 
    if (!sheet) return;

    context.drawImage(sheet.image,
        entity.frameX * entity.width,
        row * entity.height,
        entity.width,
        entity.height,
        entity.x - cameraX,
        entity.y - cameraY,
        entity.width * double,
        entity.height * double
    );

    // player sprite sheet had only 4 columns white the rest of the idle sprite sheet had 12. 
    // this code just fixes by limiting the frames of player.state === "idle" to only 4 when player is facing 
    if (entity === player && entity.state === "idle" && entity.facing === "up") {
        sheet.frames = 4;
    }

    if (entity.state === "dead") {
        if (entity.frameX < sheet.frames - 1) { entity.frameX++ }

    } else {
        entity.frameX = (entity.frameX + 1) % sheet.frames;
    }
}
function DrawBorder(text, variable, x, y, color) {
    let boxWidth = 170;
    let boxHeight = 35;
    let padding = 10;

    // box
    context.fillStyle = UIcolor
    context.fillRect(x - padding, y - 25, boxWidth, boxHeight)

    //text
    context.fillStyle = color
    context.textAlign = "left"
    context.font = "15px Arial"
    context.textBaseline = "middle"

    context.fillText(text + variable, x, y - 25 + boxHeight / 2)
}
// to write titles using DOM 
function DrawTitle(selector, text, show) {
    let title = document.querySelector(selector)
    if (show) {
        title.innerText = text
        title.style.display = "block";
    } else {
        title.style.display = "none"
    }
}
// to write text using DOM 
function DrawText(selector, text, show) {
    let t = document.querySelector(selector)
    if (show) {
        t.innerText = text
        t.style.display = "block";
    } else {
        t.style.display = "none"
    }
}

function ColorBackground(color) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function HealthBar(entity) {
    let offsetY = -5
    let offsetX = 20;

    if (entity.health < 25) { context.fillStyle = "#ff1100" }
    else if (entity.health < 75) { context.fillStyle = "#ff7300" }
    else { context.fillStyle = "green" }
    context.strokeStyle = "black";
    context.lineWidth = 2;

    let x = entity.x - cameraX + offsetX;
    let y = entity.y - cameraY + offsetY

    if (entity.state !== "dead") {
        context.fillRect(x, y, (entity.health / entity.maxHealth) * 70, 10)
        context.strokeRect(x, y, 70, 10)
    }
}

function DrawTimer() {
    if (LevelManager.currentTime < 10) { color = "red"; }
    else if (LevelManager.currentTime < 20) { color = "#FF4B33" }
    else { color = "white" }


    DrawBorder("Countdown: ", Math.ceil(LevelManager.currentTime), 315, 30, color)
}

function DrawButton(bgColor, btn, textColor, text) {

    if (!btn) return;

    context.fillStyle = bgColor;
    context.fillRect(btn.x, btn.y, btn.width, btn.height);

    context.font = "14px Arial"
    context.fillStyle = textColor
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
        text,
        btn.x + btn.width / 2,
        btn.y + btn.height / 2
    );
}

function DrawModel(sprite, x, y, width, height) {
    context.drawImage(
        sprite, 0, 0,
        player.width, player.height,
        x, y, width, height)
}



/***  GAME FUNCTIONS  ***/
function ResetGame() {
    context.clearRect(0, 0, canvas.width, canvas.height)

    player.frameX = 0;
    player.health = player.maxHealth;

    player.x = 0;
    player.y = 170;
    enemies = []


    LevelManager.currentTime = LevelManager.timer;
    currentBg = Background.imgLevel1.image;

    for (let i = 0; i < activeDifficulty.enemySpawn; i++) { EnemySpawn() }

    GameStats.kills = 0;
    GameStats.score = 0;
    GameStats.level = 1;
    GameControls.gameOver = false;
    GameControls.levelComplete = false;

}

function Camera() {
    cameraX = player.x - (canvas.width / 2);
    cameraY = player.y - (canvas.height / 2);
}

function BuySkin(skin) {


    // using a loop to loop through skinPrices using skin as index 
    let price = skinPrices[skin]

    if (skinState[skin].state === "unowned") {
        if (GameStats.coins >= price) {
            GameStats.coins -= price;
            skinState[skin].state = "owned"; console.log("skin bought")
            statusMsg = "Skin Bought"
            sounds.coinAudio.audio.play();
        }

        else { statusMsg = "Not enough coins ...  ☹"; sounds.broke.audio.play(); }
    }

    else if (skinState[skin].state === "owned") {
        for (let key in skinState) {
            if (skinState[key].state === "equipped") {
                skinState[key].state = "owned";
            }
        }
        statusMsg = "Skin Equipped"
        activeSkins = skins[skin]
        skinState[skin].state = "equipped"

    } else if (skinState[skin].state === "equipped") { statusMsg = "Skin already owned" }
}

// function to make the sound play only once.
// This allows the audio to only play when play's health is 0 but not officially dead yet.
// This helped me avoid the audio looping. 
function PlayerDead() {
    if (player.health <= 0 && player.state !== "dead") {
        player.state = "dead"

        sounds.playerDead.audio.currentTime = 0;
        sounds.playerDead.audio.play();
    }
}

function Movement() {
    let isMoving = keys.moveLeft || keys.moveRight || keys.moveUp || keys.moveDown;
    let running = isMoving && keys.sprint;
    let currentSpeed = speed;

    if (player.health <= 0) { player.state = "dead"; return; }
    if (player.health < 15) { player.state = "hurt"; return; }

    if (keys.attack) { player.state = "attack"; }

    else {
        if (running) { currentSpeed = speed * 2; player.state = "run"; }
        else if (isMoving) { player.state = "walk" }
        else { player.state = "idle" }
    }
    if (isMoving) {
        if (keys.moveDown) { player.facing = "down"; player.y += currentSpeed }
        if (keys.moveLeft) { player.facing = "left"; player.x -= currentSpeed }
        if (keys.moveRight) { player.facing = "right"; player.x += currentSpeed }
        if (keys.moveUp) { player.facing = "up"; player.y -= currentSpeed }
    }

    if (player.x < 0) { player.x = 0 }
    if (player.y < 0) { player.y = 0 }
    if (player.x + player.width > canvas.width) { player.x = canvas.width - player.width }
    if (player.y + player.height > canvas.height) { player.y = canvas.height - player.height }

}

// Enemy chasing enemy from by making the enemy move closer to the player. ( using vectors )
// => direction = (player - enemy) / distance 
// dividing the player - enemy gives a unit vector of length 1 
function Chasing(enemy, player) {
    if (enemy.health <= 0) { enemy.state = "dead"; return; }
    if (enemy.health < 15) { enemy.state = "hurt"; return; }
    if (player.health <= 0) { enemy.state = "idle"; return; }

    let { dx, dy, distance } = DistanceCalc(enemy, player)

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) { enemy.facing = "right" } else { enemy.facing = "left" }
    } else {
        if (dy > 0) { enemy.facing = "down" } else { enemy.facing = "up" }
    }


    if (distance > 60) {
        enemy.state = "walk"
        enemy.x += (dx / distance) * enemy.speed
        enemy.y += (dy / distance) * enemy.speed

    } else { enemy.state = "attack" }


}

// modified from lecture notes ( lecture 15 )
function Collision(entity1, entity2) {
    let colliding = false;
    if (entity1.x < entity2.x + entity2.width &&
        entity1.x + entity1.width > entity2.x &&
        entity1.y < entity2.y + entity2.height &&
        entity1.y + entity1.height > entity2.y) {
        colliding = true;
    }
    return { colliding, entity1, entity2 }
}

function EnemySpawn() {

    //making a random spawning points and then using randint to make enemies spawn at 
    // random locations 100 pixels away from player
    let spawnPoints = [
        { x: 100, y: 160 },
        { x: 200, y: 220 },
        { x: 400, y: 280 },
        { x: -200, y: 340 },
        { x: -400, y: 400 },
    ]
    let point = spawnPoints[randint(0, spawnPoints.length - 1)]
    let enemy = {
        x: point.x,
        y: point.y,
        width: 64,
        height: 64,
        frameX: 0,
        frameY: 0,
        speed: activeDifficulty.enemySpeed,
        state: "walk",
        facing: "down",
        animationTimer: 0,
        animationSpeed: 2,
        health: activeDifficulty.enemyHealth,
        maxHealth: activeDifficulty.enemyMaxHealth,
        killed: false
    }
    enemies.push(enemy)
}

// enemy distance away from each other to avoid enemies walking on-top of each other 
function EnemyDistance(enemy) {
    for (let otherEnemy of enemies) {

        //if the enemy is the other enemy than ignore the code 
        if (otherEnemy === enemy) continue

        let { dx, dy, distance } = DistanceCalc(enemy, otherEnemy)
        let { colliding } = Collision(enemy, otherEnemy)

        if (colliding) {
            if (distance < 80 && distance > 0) {

                let force = (80 - distance) / 10

                // dividing to get unit vector and using force for a controlled force push
                enemy.x -= (dx / distance) * force
                enemy.y -= (dy / distance) * force
            }
        }
    }
}


//Cool-down system to prevent continuous damage every frame.
// it is controlled t time intervals to prevent either the player or enemy from losing all health. 
function Attack(enemy, player) {

    let { colliding } = Collision(enemy, player);

    if (enemy.state === "dead") return
    if (player.state === "dead") return;

    if (colliding) {
        if (keys.attack) {
            sounds.attackSound.audio.play()

            // skin abilities 
            // each skin have more power to hit the enemy. 
            // for reference 1.5 for skin2 and 3 for skin 3 
            let power = 1
            for (let key in skinState) {
                if (skinState[key].state === "equipped") {
                    power = skinState[key].power
                }
            }

            if (GameStats.enemyDamageTimer <= 0) {
                enemy.health -= 10 * power;
                GameStats.enemyDamageTimer = GameStats.enemyDamageCoolDown;
            }
        }

        if (enemy.health <= 0) {
            sounds.enemyDead.audio.play();
            enemy.killed = true;
            enemy.state = "dead";
            if (enemy.state === "hurt") { GameStats.score += 10; }
            // stats 
            GameStats.kills += 1;
            GameStats.coins += 50;
            GameStats.score += 50;
        }
        if (enemy.state === "attack") {
            sounds.enemyAttack.audio.play()
            if (GameStats.damageTimer <= 0) {
                player.health -= 5;
                GameStats.damageTimer = GameStats.damageCoolDown;
                sounds.playerHurt.audio.play()
            }
        }

    }

    // basic cool down count down until it reaches 0 and the enemy.
    // this allows the player or enemy to take damage again
    if (!colliding && player.health < player.maxHealth) { player.health += 0.5 }
    if (GameStats.damageTimer > 0) { GameStats.damageTimer-- }
    if (GameStats.enemyDamageCoolDown > 0) { GameStats.enemyDamageTimer-- }

}

function Levels() {
    if (GameStats.score >= GameStats.targetScore) {
        GameControls.spawnInterval = Math.max(500, GameControls.spawnInterval - 200)

    }

    let allDeadEnemy = enemies.length > 0 && enemies.every(enemy => enemy.health <= 0 || enemy.state === "dead")
    if (allDeadEnemy && !GameControls.levelComplete) {
        GameControls.levelComplete = true;
    }

    if (GameControls.levelComplete || player.health <= 0) return;

    LevelManager.currentTime -= elapsed / 1000

    if (LevelManager.currentTime < 10 && LevelManager.currentTime > 0) { sounds.countdown.audio.play(); }
    else { sounds.countdown.audio.pause() }


    if (LevelManager.currentTime <= 0) { player.health = 0; LevelManager.currentTime = 0; }



}

function ProgressLevel() {
    GameStats.level++;
    GameStats.coins += 100;
    player.x = 0;
    player.y = 170;
    player.health = player.maxHealth

    if (GameStats.level) { sounds.levelUp.audio.play(); }

    // making loop so level 5+ loop back to level 1 bg image 
    // ( level - 1) % 4 --> 
    // Example worked out:   => ( level 6 - 1 ) % 4  OR (level 7 - 1) % 4
    //                       => ( 5 ) % 4               => (6) % 4
    //                       => 1 ( level 1 image )     => 2 ( level 2 image)

    let i = (GameStats.level - 1) % BgLoop.length;
    currentBg = BgLoop[i]



    GameControls.levelComplete = false;
    enemies = []


    let baseTime = LevelManager.timer;

    // Reduces each new level by 10s 
    let difficultyTimer = GameStats.level * 20

    // Makes sure the timer does not go below 30 seconds. ( maybe for super hard levels tho... )
    LevelManager.currentTime = Math.max(30, baseTime - difficultyTimer)

    for (let i = 0; i < GameStats.level + 2; i++) {
        EnemySpawn();
    }


}

// function for making objects for buttons UI 
function Objects(x, y, text, width, height) {
    return { x, y, text, width, height }
}

// function for making UI objects in the center 
function CenterObject(text, width, height) {
    return Objects(
        canvas.width / 2 - width / 2,
        canvas.height / 2 - width / 2,
        text,
        width,
        height

    )
}

function Stop() {
    window.cancelAnimationFrame(request);

}

/***  MATHEMATICAL FUNCTIONS  ***/
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Distance calculation 
function DistanceCalc(entity1, entity2) {
    let dx = entity2.x - entity1.x;
    let dy = entity2.y - entity1.y;
    let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    return { dx, dy, distance };
}

// Offset that checks if the mouse cursor is inside the rectangle 
// this checks if the mouse's coordinates are inside a rectangle ( used for making my btns UI )
function Offset(x, y, rect) {
    return (
        x > rect.x &&
        x < rect.x + rect.width &&
        y > rect.y &&
        y < rect.y + rect.height
    );
}

/***  MECHANICS FUNCTIONS  ***/
// modified from lecture notes ( lecture 15 )
function activate(event) {
    let key = event.key.toLowerCase();
    let arrowKeys = event.key;

    if (key === "a" || arrowKeys === "ArrowLeft" ||
        key === "d" || arrowKeys === "ArrowRight" ||
        key === "w" || arrowKeys === "ArrowUp" ||
        key === "s" || arrowKeys === "ArrowDown" ||
        key === "shift" || key === "q" || key === "k" || key === " ") {
        event.preventDefault();
    }


    if (key === "a" || arrowKeys === "ArrowLeft") { keys.moveLeft = true; }
    else if (key === "d" || arrowKeys === "ArrowRight") { keys.moveRight = true; }
    else if (key === "w" || arrowKeys === "ArrowUp") { keys.moveUp = true; }
    else if (key === "s" || arrowKeys === "ArrowDown") { keys.moveDown = true; }
    else if (key === "shift") { keys.sprint = true; }
    else if (key === "k" || key === " ") { keys.attack = true; }
}
function deactivate(event) {
    let key = event.key.toLowerCase();
    let arrowKeys = event.key;

    if (key === "a" || arrowKeys === "ArrowLeft") { keys.moveLeft = false }
    else if (key === "w" || arrowKeys === "ArrowUp") { keys.moveUp = false; }
    else if (key === "d" || arrowKeys === "ArrowRight") { keys.moveRight = false; }
    else if (key === "s" || arrowKeys === "ArrowDown") { keys.moveDown = false; }
    else if (key === "shift") { keys.sprint = false; }
    else if (key === "k" || key === " ") { keys.attack = false; }
}

// lecture notes 
function load_assets(assets, callback) {
    let num_assets = assets.length;
    let loaded = function () {
        console.log("loaded");
        num_assets = num_assets - 1;
        if (num_assets === 0) {
            callback();
        }
    };
    for (let asset of assets) {
        let element = asset.var;
        if (element instanceof HTMLImageElement) {
            console.log("img");
            element.addEventListener("load", loaded, false);
        }
        else if (element instanceof HTMLAudioElement) {
            console.log("audio");
            element.addEventListener("canplaythrough", loaded, false)
        }
        element.src = asset.url
    }
}

// handle clicks using Offset function 
// Offset is the function passed to be reused ( line 1046 )
// the variables passed are the buttons objects 
function handleClick(e) {

    sounds.clickSound.audio.play();
    let x = e.offsetX;
    let y = e.offsetY;

    // MENU TOGGLE ( BOOLEAN ) --> so it is like true, false, true , false depending on the condition
    // using that allows me to toggle menu, so when menu is true shop and settings show and when menu is false shop and settings are hidden

    if (Offset(x, y, UI.menu)) {
        BtnState.menuState = !BtnState.menuState;
    }
    if (Offset(x, y, UI.play)) {
        BtnState.playState = !BtnState.playState;
        sounds.soundtrack.audio.play()
    }

    // PLAY BTN 
    if (!BtnState.playState) {
        sounds.soundtrack.audio.pause();
        if (Offset(x, y, UI.settings.easy)) { activeDifficulty = difficulty.easy;   modeMsg = "Mode Easy"}
        if (Offset(x, y, UI.settings.medium)) { activeDifficulty = difficulty.medium ; modeMsg = "Mode Medium" }
        if (Offset(x, y, UI.settings.hard)) { activeDifficulty = difficulty.hard ; modeMsg = "Mode Hard"}
        if (Offset(x, y, UI.settings.impossible)) { activeDifficulty = difficulty.impossible ; modeMsg = "Mode Impossible" }
        if (Offset(x, y, UI.settings.insane)) { activeDifficulty = difficulty.insane ; modeMsg = "Mode Insane" }
    }
    // NEXT LEVEL BTN 
    if (GameControls.levelComplete && Offset(x, y, UI.nextLevel)) { ProgressLevel(); console.log("click next level") }


    // REVIVE BTN 
    if (BtnState.playState && player.health <= 0) {
        if (Offset(x, y, UI.revive)) {
            ResetGame();
            BtnState.reviveState = true;
        }
    }

    // PAUSE TOGGLE ( BOOLEAN )
    if (Offset(x, y, UI.pause)) {
        BtnState.pauseState = !BtnState.pauseState;
    }


    // making shop and settings also toggle back to home 
    if (BtnState.menuState) {
        if (Offset(x, y, UI.shop)) {
            BtnState.shopState = !BtnState.shopState;
        }
        if (Offset(x, y, UI.settings)) {
            BtnState.settingState = !BtnState.settingState;
            console.log("setting")
        }
    }


    if (BtnState.shopState) {

        // CHANGING STATES 
        // one is inside settings to avoid UI overlapping. 
        // pause is true ( game is paused ) when on is inside shop or settings 
        if (Offset(x, y, UI.settings)) {
            BtnState.shopState = false;
            BtnState.settingState = true;
            return;
        }


        // SHOP BTNS 
        if (Offset(x, y, UI.shop.defaultSkin)) { BuySkin("default", skinPrices.default) }
        if (Offset(x, y, UI.shop.buySkin2)) { BuySkin("skin2", skinPrices.skin2) }
        if (Offset(x, y, UI.shop.buySkin3)) { BuySkin("skin3", skinPrices.skin3) }
    }



    // SETTINGS 
    if (BtnState.settingState) {

        if (Offset(x, y, UI.shop)) {
            BtnState.shopState = true;
            BtnState.settingState = false;
            return;
        }

        if (Offset(x, y, UI.settings.increaseAudio)) {
            // using parseFloat to formate it by 2 decimal places 
            sounds.soundtrack.audio.volume = parseFloat((sounds.soundtrack.audio.volume += 0.1).toFixed(2))
            if (sounds.soundtrack.audio.volume === 1) {
                msg = "Volume at Max "
            } else {
                msg = `Volume increased ${sounds.soundtrack.audio.volume}`
            }
        }

        if (Offset(x, y, UI.settings.decreaseAudio)) {
            sounds.soundtrack.audio.volume = sounds.soundtrack.audio.volume = parseFloat((sounds.soundtrack.audio.volume -= 0.1).toFixed(2))
            if (sounds.soundtrack.audio.volume === 0) {
                msg = "Volume at 0"
            } else {
                msg = `Volume Decreased ${sounds.soundtrack.audio.volume}`
            }
        }

    }


    if (BtnState.shopState || BtnState.settingState) { BtnState.pauseState = true; }
}


