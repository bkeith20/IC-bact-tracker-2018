// --------------------- create map object ---------------------
var map = L.map('map',{ zoomControl:false }).setView([42.4226, -76.4950], 15);
var layer = L.esri.basemapLayer('DarkGray').addTo(map);
//var layerLabels;



// --------------------- resistances present in samples ---------------------
//using an object because in js it is a hash table so O(1) to access each field
//the value of each resistance key show whether it is selected or not with a boolean
var resistances = {};




//----------------------- values for calculating date slider ---------------
var minDate = Date.now();
var maxDate = Date.now();
var currMinDate = Date.now();
var currMaxDate = Date.now();

//takes a date object and returns a date string in the format yyyy-mm-dd
function formatDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    var dstr = yyyy+'-'+mm+'-'+dd;
    return dstr;
}


// --------------------- define tree object ---------------------
//defines a new node object
function Node(name, data, rs, date) {
    this.name = name;
    this.data = [data];
    this.resistance = [rs]
    this.dates = [date]
    this.parent = null;
    this.children = [];
    var heatmap = null; // not sure this is actually being used
}
 
//defines a new tree object with one node with the entered values
function Tree(name, data, res) {
    var node = new Node(name, data, res);
    this._root = node;
}

//given a list of names categorizing a bacteria, this function moves through the existing nodes of the tree along the path defined by the list of names until it comes to a name that does not yet exist as a node,
//then it creates new nodes for each of the remaining names in the names list
//along the way down the tree, this function appands the given data(points), res(resistances), and dates to the lists of each node it passes through
Tree.prototype.addBact = function(names, data, res, date){
    //start at root
    var curr = this._root;
    //add the new data to the root's data
    curr.data.push(data);
    curr.dates.push(date)
    curr.resistance.push(res);
    
    //for each name in the list of names
    for (var i = 0, length = names.length; i < length; i++){
        var ndx = -1;
        
        //for each child node of the current node
        //locates the position of the node with the name being looked for
        for(var x = 0, cl = curr.children.length; x < cl; x++){
            if(names[i]===curr.children[x].name){
                ndx = x;
            }
        }
        // if th name is not yet a node in the list of children node, create a new node for it with the data, make that node the current node and start the next iteration of the loop
        if(ndx<0){
            //need to add this node to the parent's children list!
            var p = new Node(names[i], data, res, date);
            p.parent = curr;
            curr.children.push(p);
            curr = p;
        } 
        //if the name was found, make that node the current node, push the new data onto its data and move to the next name and next iteration of the loop
        else {
            curr = curr.children[ndx];
            curr.data.push(data);
            curr.dates.push(date);
            curr.resistance.push(res);
        }
        //make sure reistances are in resistances array to make checkboxes
        for(var r = 0, rl = res.length; r<rl; r++){
            if(resistances[res[r]]==null){
                resistances[res[r]] = res[r];
                //console.log(resistances[res[r]]);
            }
        }
        //if the date is greater than the maximum date recorded so far make it the new max date
        if(date.getTime()>maxDate){
            maxDate = date.getTime();
        }
        //if the date is less than the minimum date recorded so far make it the new min date
        else if(date.getTime()<minDate){
            minDate = date.getTime();
        }
    }
}

//start the recursive printing of the tree from the root
Tree.prototype.print = function() {
    var node = this._root
    console.log(node.name+", "+node.data.length);
    for (var i = 0, length = node.children.length; i<length; i++){
            this.printR(node.children[i]);
    }
}

//recursively print each node in the tree
Tree.prototype.printR = function(node){
    if(node!=null){
        console.log(node.name+", "+ node.parent.name+", "+node.data.length);
        for (var i = 0, length = node.children.length; i<length; i++){
            this.printR(node.children[i]);
        }
    }
}

//may want to do something in these functions to make the radio buttons be sorted alphabetically
//add cascading radio buttons to the html for each node in the tree lots of html building 
Tree.prototype.makeradio = function() {
    let node = this._root;
    let div = document.createElement("div");
    let radio = document.createElement("input");
    radio.type = "radio";
    radio.value = node.name;
    radio.id = node.name;
    radio.checked="checked";
    radio.name="level1";
    radio.onclick = function() {changeHeatmap(this.value)};
    let label = document.createElement("label");
    label.for=radio.id;
    let labelText = document.createTextNode(node.name);
    label.appendChild(labelText);
    div.appendChild(radio);
    div.appendChild(label);
    let childrenDiv = document.createElement("div");
    let sub = 1;
    childrenDiv.classList.add("sub"+sub);
    //console.log(childrenDiv.class);
    //recursively go through each node and build the radio button and any radio buttons below it for its children nodes
    for(var i = 0, length = node.children.length; i<length; i++){
        childrenDiv.appendChild(this.makeradioR(node.children[i],sub));
    }
    div.appendChild(childrenDiv);
    let wrapper = document.createElement("div");
    wrapper.appendChild(div);
    let none = document.createElement("div");
    let nRadio = document.createElement("input");
    nRadio.type = "radio";
    nRadio.value = "None";
    nRadio.id = "None";
    nRadio.name="level1";
    nRadio.onclick = function() {removeHeat()};
    let nLabel = document.createElement("label");
    nLabel.for = "None";
    let nLabelText = document.createTextNode("None");
    nLabel.appendChild(nLabelText);
    none.appendChild(nRadio);
    none.appendChild(nLabel);
    wrapper.appendChild(none);
    return wrapper;
}

//recursively build radio button for a node and its children nodes
Tree.prototype.makeradioR = function(node, sub) {
    if(node!==null){
        sub = (sub+1);
        let div = document.createElement("div");
        let radio = document.createElement("input");
        var uID = node.name;
        if(node.parent.name===node.name){
            uID = node.name.concat("1")
        }
        radio.type = "radio";
        radio.value = uID;
        radio.id = uID;
        radio.name = "level"+sub;
        radio.onclick = function() {changeHeatmap(this.value)};
        let label = document.createElement("label");
        label.for=radio.id;
        let labelText = document.createTextNode(node.name);
        label.appendChild(labelText);
        div.appendChild(radio);
        div.appendChild(label);
        let childrenDiv = document.createElement("div");
        childrenDiv.classList.add("sub"+sub);
        for(var i = 0, length = node.children.length; i<length; i++){
            childrenDiv.appendChild(this.makeradioR(node.children[i], sub));
        }
        div.appendChild(childrenDiv);
        return div;
    }
}

//search the tree for a node with a given name
Tree.prototype.bfs = function(toFind) {
    var q = [this._root];
    while(q.length>0){
        var node = q.pop();
        if(node.name===toFind){
            return node;
        } else {
            for(var i = 0, length = node.children.length; i<length; i++){
                q.unshift(node.children[i]);
            }
        }
    }
}


// --------------------- Build the tree and use it to build the radio buttons and resistance checkboxes ---------------------
var myTree = new Tree("Bacteria", [0,0,0], []);

// --------------------- Build default heatmap ---------------------
//heatmap currently being displayed
var currHeat = null;
//name of heatmap currently being displayed i.e. the key to find the current heatmap in heats{}
var currHeatName = "";

// here will read in values and add them to the tree
var data = fetch("http://ic-research.eastus.cloudapp.azure.com/~bkeith/heatmap.php", {
    method: 'post',
    mode: "cors",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    //here could specify the school -- could add a pop-up at page open that asks which school's data you wish to view for future developement
    body: JSON.stringify({uname: "name"})
  })
  .then((response) => response.json())
  .then((data) => {
      console.log(data);
      for(let i = 0, l = data.length; i<l; i++){
          //add 12 hours to make sure even if time zone is wrong will still be correct day
          myTree.addBact(data[i][0],data[i][1],data[i][2],new Date(data[i][3] + ' 12:00.00'));
      }
      
      
      currMinDate = minDate;
      currMaxDate = maxDate;
      
      
      //start building the html objects
      //get empty div for radio buttons
      var wrapper = document.getElementById("radioDiv");
        //build the radio buttons for all the bacteria names
        var myButtons = myTree.makeradio();
        //put the cascading radio buttons into the empty div
        wrapper.appendChild(myButtons);

        //get the empty div for the checkboxes
        var checkWrapper = document.getElementById("checkBoxDiv");
      
        //build the checkboxes for each resistance and add them to the empty div
        Object.keys(resistances).forEach(function(key, index){
           //make checkbox for each resistance
            //console.log(key);
            let div = document.createElement("div");
            let check = document.createElement("input");
            check.type = "checkbox";
            check.value = key;
            check.id = key;
            check.name = key;
            // need to adjust this maybe use on change and just add it to an array if checked on and remove it if checked off
            check.onclick = function() {toggleResistance(this)};
            let label = document.createElement("label");
            label.for=check.id;
            let labelText = document.createTextNode(key);
            label.appendChild(labelText);
            div.appendChild(check);
            div.appendChild(label);
            checkWrapper.appendChild(div);
            //set the value in the hashmap to false so it is not selected
            resistances[key] = false;
        });
      
      //build the starting heatmap of all bacteria
      var Bacteria = L.heatLayer(myTree._root.data, {
            radius: 12,
            blur: 25,
            maxZoom: 11
        }).addTo(map);
      //set this base heatmap as the current heatmap
      currHeat = Bacteria;
      currHeatName = "Bacteria";
      
      
      $(function() {
            $( "#slider-range" ).slider({
                range: true,
                min: new Date(minDate).getTime()/1000, //min date on slider
                max: new Date(maxDate).getTime()/1000, //max date on slider
                steps: 86400,
                values: [new Date(minDate).getTime()/1000, new Date(maxDate).getTime()/1000],
                slide: function( event, ui ){
                    $( "#amount" ).val( (new Date(ui.values[ 0 ]*1000)).toDateString() + " - " + (new Date(ui.values[ 1 ]*1000)).toDateString() );
                    //set currdates and change what is shown
                    currMaxDate = new Date($( "#slider-range" ).slider( "values", 1 )*1000);
                    console.log(currMaxDate);
                    currMinDate = new Date($( "#slider-range" ).slider( "values", 0 )*1000);
                    console.log(currMinDate);
                    changeHeatmap(currHeatName);
                }
            });
            $( "#amount" ).val( (new Date($( "#slider-range" ).slider( "values", 0 )*1000).toDateString()) + " - " + (new Date($( "#slider-range" ).slider( "values", 1 )*1000).toDateString()));
            
        });
      
      return data;
  })
  .catch(function (error) {
    console.log('Request failed', error);
  });  


    
// --------------------- define functions used by html elements(buttons) ---------------------

//toggles whether the full menu is shown or hidden
function toggleMenu() {
    var menu = document.getElementById("menu");
    var button = document.getElementById("menuButton");
    if (menu.style.display === "none") {
        menu.style.display = "block";
        button.value = "Hide Menu";
    } else {
        menu.style.display = "none";
        button.value = "Show Menu";
    }
}

//changes the heatmap that is shown on the map
function changeHeatmap(value) {
    //value is always just the name of the bacteria being shown, it does not show the resistances or time
    if (currHeat != null) {
        map.removeLayer(currHeat);
    }
    //build the correct label using bacteria and the resistances and the dates
    var label = value;
    var currRes = [];
    Object.keys(resistances).forEach(function(key, index){
        if(resistances[key]){
            label = label.concat(key);
            currRes.push(key);
        }
    });
    label = label.concat(currMinDate);
    label = label.concat(currMaxDate);
    
    
        var currNode = myTree.bfs(value);
        //console.log(currNode);
        var info = currNode.data;
        var infoFiltered = [];
        for(var q = 0, length = info.length; q<length; q++){
            let notIn = 0;
            //look through the list of resistances listed with the current sample and if any of the resistances selected are not within the samples list, then it is not added to the heatmap 
            for(var r = 0, l = currRes.length; r<l; r++){
                if(!currNode.resistance[q].includes(currRes[r])){
                    notIn++;
                }
            }
            if(notIn<1 && (new Date(currNode.dates[q])>=currMinDate) && (new Date(currNode.dates[q])<=currMaxDate)){
                infoFiltered.push(info[q]);
            }
        }
        var newHeat = L.heatLayer(infoFiltered,{
            radius: 12,
            blur: 25,
            maxZoom: 11
        });
    //close any buttons of a lower level and uncheck them
    var currNode = document.getElementById(value);
    switch(currNode.parentNode.parentNode.className){
        case "sub1":
            var n = 1;
            break;
        case "sub2":
            var n = 2;
            break;
        case "sub3":
            var n = 3;
            break;
        case "sub4":
            var n = 4;
            break;
        case "sub5":
            var n = 5;
            break;
        case "sub6":
            var n = 6;
            break;
        case "sub7":
            var n = 7;
            break; 
        case "sub8":
            var n = 8;
            break;
        case "sub9":
            var n = 9;
            break;
        case "sub10":
            var n = 10;
            break;
        default:
            var n = 0;
            break;
    }
    n = n+2;
    for(n; n<10; n++){
        var radios = document.getElementsByName("level"+n);
        for(var i = 0, l = radios.length; i<l; i++){
            radios[i].checked=false;
        }
    }
    map.addLayer(newHeat);
    currHeat = newHeat;
    currHeatName = value;
}

//triggered by the none radio button, removes the currently displayed heatmap layer from the map
function removeHeat() {
    map.removeLayer(currHeat);
    currHeat = null;
}

//toggles whether a resistance is used as a filter
function toggleResistance(res){
    if(resistances[res.value]){
        resistances[res.value] = false;
    } else {
        resistances[res.value] = true;
    }
    if(currHeat!=null){
       changeHeatmap(currHeatName); 
    }
    
}

window.alert("The shown data was randomly generated to demonstrate the map's function.")