// --------------------- create map object ---------------------
var map = L.map('map').setView([42.4226, -76.4950], 15);
var layer = L.esri.basemapLayer('DarkGray').addTo(map);


// --------------------- resistances present in samples ---------------------
//using an object because in js it is a hash table so O(1) to access each field
var resistances = {};


//----------------------- values for calculating date pickers ---------------
var minDate = Date.now();
var maxDate = Date.now();
var currMinDate = Date.now();
var currMaxDate = Date.now();

//format date into yyyy-mm-dd
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
function Node(name, data, rs, date) {
    this.name = name;
    this.data = [data];
    this.resistance = [rs]
    this.dates = [date]
    this.parent = null;
    this.children = [];
    var heatmap = null; // not sure this is actually being used
}
 
function Tree(name, data, res) {
    var node = new Node(name, data, res);
    this._root = node;
}

Tree.prototype.addBact = function(names, data, res, date){
    var curr = this._root;
    curr.data.push(data);
    curr.dates.push(date)
    curr.resistance.push(res);
    
    for (var i = 0, length = names.length; i < length; i++){
        var ndx = -1;
        for(var x = 0, cl = curr.children.length; x < cl; x++){
            if(names[i]===curr.children[x].name){
                ndx = x;
            }
        }
        if(ndx<0){
            //need to add this node to the parent's children list!
            var p = new Node(names[i], data, res, date);
            p.parent = curr;
            curr.children.push(p);
            curr = p;
        } else {
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
        if(date>maxDate){
            maxDate = date;
        }
        else if(date<minDate){
            minDate = date;
        }
    }
}

Tree.prototype.print = function() {
    var node = this._root
    console.log(node.name+", "+node.data.length);
    for (var i = 0, length = node.children.length; i<length; i++){
            this.printR(node.children[i]);
    }
}

Tree.prototype.printR = function(node){
    if(node!=null){
        console.log(node.name+", "+ node.parent.name+", "+node.data.length);
        for (var i = 0, length = node.children.length; i<length; i++){
            this.printR(node.children[i]);
        }
    }
}

//may want to do something in these functions to make the radio buttons be sorted alphabetically
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


// --------------------- Build the empty tree ---------------------
var myTree = new Tree("Bacteria", [0,0,0], []);


// --------------------- Build default heatmap and the object to hold the heatmaps ---------------------
var currHeat = null;
var currHeatName = "";


// here will read in values and add them to the tree

var data = fetch("http://ic-research.eastus.cloudapp.azure.com/~bkeith/heatmap.php", {
    method: 'post',
    mode: "cors",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    //here could specify the school -- could add a pop-up at page open that asks which school's data you wish to view
    body: JSON.stringify({uname: "name"})
  })
  .then((response) => response.json())
  .then((data) => {
      console.log(data);
      for(let i = 0, l = data.length; i<l; i++){
          //myTree.addBact(data[i][0],data[i][1],data[i][2],new Date(data[i][3]+"Z"));
          myTree.addBact(data[i][0],data[i][1],data[i][2],new Date(data[i][3] + ' 12:00.00'));
      }
      
      console.log(minDate);
      console.log(maxDate);
      currMinDate = minDate;
      currMaxDate = maxDate;
      var minpicker = document.getElementById("myMin");
      minpicker.min = formatDate(minDate);
      minpicker.max = formatDate(maxDate);
      var maxpicker = document.getElementById("myMax");
      maxpicker.min = formatDate(minDate);
      maxpicker.max = formatDate(maxDate);
      
      var wrapper = document.getElementById("radioDiv");

        var myButtons = myTree.makeradio();

        wrapper.appendChild(myButtons);

        var checkWrapper = document.getElementById("checkBoxDiv");

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
            resistances[key] = false;
        });
      
      var Bacteria = L.heatLayer(myTree._root.data, {
            radius: 12,
            blur: 25,
            maxZoom: 11
        }).addTo(map);
      currHeat = Bacteria;
      currHeatName = "Bacteria";
      heats["Bacteria"] = Bacteria;
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

