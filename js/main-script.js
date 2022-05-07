//Global Variable's
let color = {       // store all HexCode color type pokemon
    "bug": "#3B9950",
    "dark": "#5A5979",
    "dragon": "#61CAD9",
    "electric": "#F5F45C",
    "fairy": "#EA1369",
    "fighting": "#EE6239",
    "fire": "#FB4D5A",
    "flying": "#92B3C8",
    "ghost": "#906790",
    "grass": "#2AC951",
    "ground": "#A9702C",
    "ice": "#86D2F5",
    "normal": "#CA98A7",
    "poison": "#9A69D9",
    "psychic": "#F81C91",
    "rock": "#8B3D22",
    "steel": "#42BD94",
    "water": "#86A8FC"
};



//Initial State
$(document).ready(function(){
    
    //Get Pokemon Data From API With Randome ID
    for(let i=1; i <= 8; i++){
        getPokemon(Math.floor(Math.random() * 898) + 1, 0,0);
    }
    
    //Get All Pokemon Store In Local Storage
    getAllStorePokemon();
});



/*
    Use PokAPI To Get 8 Pokemon
    With Random ID Then Call createCard()
*/
function getPokemon(index, flagPopUp,flagCaptured){
    let myRequest = new XMLHttpRequest();
    let jsObject;

    myRequest.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            //Convert Response Json to Js Object
            jsObject = JSON.parse(this.responseText);

            /*
                determine if want to get data of pokemon
                or want to create card
            */
            if(flagPopUp === 0){
                createCard(jsObject.id,jsObject.name,jsObject.types,jsObject.types.length,flagCaptured);
            }else{
                createPopUp(jsObject.id,jsObject.name,jsObject.types,jsObject.types.length,jsObject.moves,jsObject.moves.length,jsObject.sprites,jsObject.stats);
            }
        }
    };    
    
    myRequest.open(
        'GET',
        'https://pokeapi.co/api/v2/pokemon/'+ index +'',
        true);    
    myRequest.send();
}

/*
    Manuplate Reciving Data To Create Card
    And Added To Page In Pokemon Section
*/
function createCard(id,name,types,numTypes,flagCaptured){
    let typePokemon = "";
    let namePokemon = "";
    let isThisChecked = "";

    typePokemon = extractTypes(types,numTypes);

    namePokemon = removeCarret(name);

    isThisChecked = determinIfChecked(id);

    let myCard = document.createElement("div");
    myCard.className = "card";
    
    const INNER_TEXT_CARD = `
            <div onclick="showPopup(this)">
                <span class="num">
                    ${id}
                </span>
                <img  class="responsive-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" alt="${namePokemon}">
                <span class="name">
                    ${namePokemon}
                </span>
                <span class="type">
                    ${typePokemon}
                </span>
            </div>

            <div class="switch">
                <label>
                    <input type="checkbox" onClick="capturedByIndex(this,${id})" ${isThisChecked} ${(flagCaptured ===0)?"":"checked"}>
                    <span class="lever"></span>
                    Captured
                </label>
            </div>
    `;

    if(flagCaptured === 0){
        let myRow = document.querySelector(".row-data");
        let myItem = document.createElement("div");
        myItem.className = "col s12 m6 l3";
        
        myCard.innerHTML = INNER_TEXT_CARD;
        myItem.appendChild(myCard);
        myRow.appendChild(myItem);
    }
    else{
        let myList = document.querySelector(".list-captured");
        myList.style.display = "block";
        let myCurve = document.querySelector(".temp-curve");
        myCurve.style.display = "none";
        localStorage.setItem("ID "+id, id);
        
        let myRow = document.querySelector(".row-captured");
        let myItem = document.createElement("div");
        myItem.className = "col s12 m6 l3";

        myCard.style.zIndex = 10;   
        myCard.innerHTML = INNER_TEXT_CARD;
        myItem.appendChild(myCard);
        myRow.appendChild(myItem);
        
    }
}

function extractTypes(types,numTypes){
    let arrtypePokemon = [];

    for(let i=0; i < numTypes; i++){
        const cap = capitalizeFirstChar(types[i].type.name);
        arrtypePokemon.push(" " + cap);        
    }
    //set type
    arrtypePokemon.join();
    
    return arrtypePokemon;
}

function capitalizeFirstChar(name){
    let str = name;
    let cap = str.substring(0, 1).toUpperCase() + str.substring(1);
    return cap;
}

function removeCarret(name){
    let namePokemon = "";

    let indexcarret = name.indexOf("-");
    if(indexcarret === -1){
        let temp = name;
        namePokemon = capitalizeFirstChar(temp);
    }
    else {
        let temp = name.slice(0, indexcarret);
        namePokemon = capitalizeFirstChar(temp);
    }
    return namePokemon;
}

function determinIfChecked(id){

    let isThisChecked = "";

    if(localStorage.getItem("ID "+ id) != null){
        isThisChecked = "checked";
    }
    else {
        isThisChecked = "";
    }

    return isThisChecked;
}

/*
    Show POPUP Menu To display
    Data Of Pokemon When Click On It
*/
function showPopup(id){
    getPokemon(id.children[0].innerHTML.trim(), 1);
}

function createPopUp(id,name,types,numTypes,moves,numMoves,sprites,stats){

    let typeSpan = "";
    let moveUl = "";
    
    typeSpan = createTypeSpan(types,numTypes);

    moveUl = createUlMoves(moves,numMoves);

    const innerTextPopup = `
        <div class="inner">
            <i class="material-icons close">close</i>
            <img src="${sprites.front_default}"/>
            <h3>
                ${name}
            </h3>
            <hr/>
            <h5>
                Type(s)
            </h5>
            <div class="types">
                ${typeSpan}
            </div>
            <hr/>
            <h5>
                Stats
            </h5>
            <div class="box-stats">
                <label>hp:</label>
                <div class="progress-bar">
                    <span style="width: ${stats[0].base_stat}%">
                        ${stats[0].base_stat}%
                    </span>
                </div>
            </div>
            <div class="box-stats">
                <label>attack:</label>
                <div class="progress-bar">
                    <span style="width: ${stats[1].base_stat}%">
                        ${stats[1].base_stat}%
                    </span>
                </div>
            </div>
            <div class="box-stats">
                <label>defense:</label>
                <div class="progress-bar">
                    <span style="width: ${stats[2].base_stat}%">
                        ${stats[2].base_stat}%
                    </span>
                </div>
            </div>
            <div class="box-stats">
                <label>special-attack:</label>
                <div class="progress-bar">
                    <span style="width: ${stats[3].base_stat}%">
                        ${stats[3].base_stat}%
                    </span>
                </div>
            </div>
            <div class="box-stats">
                <label>special-defense:</label>
                <div class="progress-bar">
                    <span style="width: ${stats[4].base_stat}%">
                        ${stats[4].base_stat}%
                    </span>
                </div>
            </div>
            <div class="box-stats">
                <label>speed:</label>
                <div class="progress-bar">
                    <span style="width: ${stats[5].base_stat}%">
                        ${stats[5].base_stat}%
                    </span>
                </div>
            </div>
            <hr/>
            <h5>
                Moves
            </h5>
            ${moveUl}
        </div>
    `;
    
    let createPopup = document.createElement("div");
    createPopup.className = "popup";
    createPopup.innerHTML = innerTextPopup; 
    document.body.appendChild(createPopup);
    $(".popup").fadeIn();
    hidePopup();
}

function createTypeSpan(types,numTypes){
    let typeStr = "";
    
    for(let i=0; i < numTypes; i++){
        typeStr += `
            <span style="color: ${color[types[i].type.name]};border-color: ${color[types[i].type.name]}">
                ${types[i].type.name}
            </span>
        `;
    }

    return typeStr;
}

function createUlMoves(moves,numMoves){
    let moveLi = "";
    let moveUl = "";
    
    for(let i=0; i < numMoves && i < 70 ; i++){
        moveLi += `
            <li>
                ${moves[i].move.name}
            </li>
        `;
    }
    if(moves.length === 0){
        moveLi += `
            <li>
                It Doesn't Have Any Move.
            </li>
        `;
    }

    moveUl += `
                <ul>
                    ${moveLi}
                </ul>
            `;

    return moveUl;
}

function hidePopup(){
    //Close popup
    $(".popup").click(function(){
        $(".popup").fadeOut();
        $(".popup").remove();
    });

    $(".popup .close").click(function(){
        $(".popup").fadeOut();
        $(".popup").remove();
    });

    $(".popup .inner").click(function(e){
        e.stopPropagation();
    });

    $(document).keydown(function(e){
        if(e.keyCode == 27){
            $(".popup").fadeOut();
            $(".popup").remove();
        }
    });
}

/*
    Captured Pokemon By Index
    When Click On CheckBox
*/
function capturedByIndex(x,index){
    if(x.checked){
        if(localStorage.getItem("ID "+index) != index){
            getPokemon(index,0,1);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your Pokemon has been Captured',
                showConfirmButton: false,
                timer: 1000
            });
        }
    }
    else{
        let myRow = document.querySelector(".row-data");
        let children = myRow.children;
        for (let i = 0; i < children.length; i++) {
            if(children[i].firstElementChild.firstElementChild.firstElementChild.textContent.trim() == index){
                children[i].firstElementChild.lastElementChild.firstElementChild.firstElementChild.checked = false;
            }        
        }
        localStorage.removeItem("ID "+index);
        getAllStorePokemon();
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Delete Captured Pokemon',
            showConfirmButton: false,
            timer: 1000
        });
    }
}

/*
    get All Pokemon Has Been Captured
    From Local Storage
*/
function getAllStorePokemon(){
    let myRow = document.querySelector(".row-captured");
    let myCurve = document.querySelector(".temp-curve");
    myRow.innerHTML = "";
    let myList = document.querySelector(".list-captured");

    if(localStorage.length > 0){
        myList.style.display = "block";
        myCurve.style.display = "none";

        for(let i = 0; i < localStorage.length; i++){
            getPokemon(localStorage.getItem(localStorage.key(i)),0,1);
        }
    }else{
        myList.style.display = "none";
        myCurve.style.display = "block";
    }
}

/*
    Search For Pokemon by Name Or Num
*/
let myInputSearch = document.querySelector("#search");

myInputSearch.oninput = (e)=>{
    if(myInputSearch.value.trim() !== "")
    {
        searchPokemon(myInputSearch.value.trim().toLowerCase());
    }
    else{
        let myRow = document.querySelector(".row-data");
        myRow.innerHTML = '';
        //Get Pokemon Data From API With Randome ID
        for(let i=1; i <= 8; i++){
            getPokemon(Math.floor(Math.random() * 898) + 1, 0,0);
        }
    }
};

function searchPokemon(name){
    let myRow = document.querySelector(".row-data");
    myRow.innerHTML = '';

    let jsObjectSearch; // stor data recive when using search
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            //Convert Response to Js Object
            jsObjectSearch = JSON.parse(this.responseText);
            checkedStartWithLetters(jsObjectSearch.results,name);
        }
    };    
    
    myRequest.open(
        'GET',
        'https://pokeapi.co/api/v2/pokemon/?limit=898&offset=0',
        true);    
    myRequest.send();
}

function checkedStartWithLetters(results,name){

    let count = 0;
    for(let i=0 ; i < results.length; i++){
        if(results[i].name.startsWith(name)){
            getPokemon(i+1,0,0);
            count++;
        }
    }
    if(count === 0){
        let warning = document.querySelector(".error-box");
        $(warning).fadeIn();
    }
    else{
        let warning = document.querySelector(".error-box");
        $(warning).fadeOut();
    }
}