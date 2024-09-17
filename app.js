

var dailyInventoryButton = document.querySelector("input[type='button']")
var sideIcon = document.querySelector(".icon-image");
var sideBar = document.querySelector(".sidebar")
var sideList = document.querySelector(".side-list")
var icon = document.querySelector(".icon")

var templateElem = document.querySelector("template");
var dataListing = document.querySelector(".items_list_data")
var categories = document.querySelectorAll(".categories img");


var items_list = undefined;
var catgegory_showing = "";
var categoryNodeElement ={};
var currentItemOrder ={};
let VendorElementList = {};
let orderElementList = {};
let currentVendorItems = {};
let rootElementPreviewText ;

var templateVendor = document.querySelector("#preview_template")
var insertElementBefore = document.querySelector(".insertPreviewValue")
var vendorList = [];
//object of objects --> supplier : itemName:{quanity, unit, brand}


categories.forEach(item => item.addEventListener("click", function(evOb) {
    var altText = evOb.target.alt;
    // console.log(altText != catgegory_showing)
    if(!items_list ) {
      alert("wait for fetching the data")
    } else if (altText != catgegory_showing) {
    //  console.log(items_list[altText])
      renderItems(items_list[altText], altText) ;
      catgegory_showing = altText;
    }
    
}))

if(!indexedDB) {
   throw new Error("There is no support for the IndexDB") 
}

sideIcon.addEventListener("pointerdown", function(evOb) {
  var elem = evOb.target;
  var status = elem.alt;
  if (status == "close") {
    sideBar.classList.remove(["sidebar-close"])
    sideList.classList.remove(["side-list-close"])
    icon.classList.remove(["icon-close"])
  
    sideBar.classList.add(["sidebar-open"])
   
    icon.classList.add(["icon-open"])

    setTimeout(function () {
      sideList.classList.add(["side-list-open"])
    },300)

    sideIcon.src = "./assets/close.svg";
    sideIcon.alt = "open";
  }else {
        sideBar.classList.remove(["sidebar-open"])
    sideList.classList.remove(["side-list-open"])
    icon.classList.remove(["icon-open"])

     sideBar.classList.add(["sidebar-close"])
    sideList.classList.add(["side-list-close"])
    icon.classList.add(["icon-close"])
  


    sideIcon.src = "./assets/burger-menu.svg";
    sideIcon.alt = "close";

  }
})

fetch("./ingredient-list.json").then(data => {
data.json().then(d => {
    //all the list items
    items_list =d;
    localItemSep(items_list)
  })

})

function renderItems(arrayListItems, category) {

  var previousDataList = JSON.parse( lStore.getItem("itemInfo"))

  if (!(category in categoryNodeElement) ) {
    //adding the element - caching the elements
    categoryNodeElement[category] = [];

    dataListing.innerHTML = "";

    for (var x of arrayListItems) {

      //localStorage vlaue -- depending on the item name;
      var prevPrice = previousDataList[x]["price"]; 
      var prevBrand = previousDataList[x]["brand"];
      var prevQuant = previousDataList[x]["quantity"];
      var prevUnit = previousDataList[x]["unit"];
      var prevSupply =previousDataList[x]["supplierName"];

      console.log(x, prevBrand, prevPrice, prevQuant, prevUnit, prevSupply)

      var itemName = x;
      var templateContent = templateElem.content.cloneNode(true);
      var htmlCollection = (templateContent.children)
      var rootElement =  (htmlCollection[0]);
      var rootElementChild = rootElement.children;
      
      //logic for the adding and deleting the item
      var item_list_unit_value = rootElementChild[0];
      var item_list_unit_value_label = item_list_unit_value.children[0];
      item_list_unit_value_label.setAttribute("for",itemName) ;
      var item_list_unit_value_number = item_list_unit_value.children[1].firstElementChild;
      
      item_list_unit_value_number.value = prevQuant;
      //#TO DO : 
      //checking index DB for previous values and items; - pcs
      item_list_unit_value_number.id = itemName ;
      var item_list_unit_value_plus = item_list_unit_value.children[1].children[1];
      var item_list_unit_value_minus = item_list_unit_value.children[1].children[2];
      var item_list_unit_value_unit = item_list_unit_value.children[1].lastElementChild;

      item_list_unit_value_unit.value = prevUnit;
      //console.log(item_list_unit_value_unit)
      //listinening to the value changes ; 
      item_list_unit_value_minus.addEventListener("click", function (evOb){
        var number_input = (evOb.target.parentNode.querySelector("input[type=number]"));
        var currentValue = number_input.value ?? 0;
       if(currentValue > 0) {
        number_input.value = currentValue -1;
       }
      }) ;
      item_list_unit_value_plus.addEventListener("click", function (evOb){
        var number_input = (evOb.target.parentNode.querySelector("input[type=number]"));
        var currentValue = number_input.value ?? 0;
        number_input.value = Number(currentValue) + 1;
     });
      
      var data_previous = rootElementChild[1];
      data_previous.innerHTML = "---- data"

     //checking the indexDB -- update for the price, last orders and other things

      var vendor_list = rootElementChild[2].querySelector("input");
      var brand_list = rootElementChild[3].querySelector('input');
      var value_addition = rootElementChild[4]

      vendor_list.value = prevSupply;
      brand_list.value = prevBrand;
  

      var value_addition_add = value_addition.children[0];
      var value_addition_remove = value_addition.children[1]

      //console.log(value_addition_add, value_addition_remove)
   
  //listening for the data

      value_addition_add.addEventListener("click", function (evOb) {
        // if(vendor_list.value == "" || brand_list.value == "") {
        //   alert("please mention supplier name, brand name")
        //   return ;
        // }
        var currentElement = evOb.target.parentNode.parentNode;

//        console.log(currentElement)

        var supplyName = currentElement.querySelector("#vendor").value;
        var brandName = currentElement.querySelector("#brand").value;
        var quantity = currentElement.querySelector("input[type=number]").value;
        var unit = currentElement.querySelector("select").value;
        var itemValue = currentElement.querySelector("label").innerText;
        
        if(supplyName == ""  || brandName == "" || quantity == 0 ) {
            alert("please mention supplier name, brand name, unit")
            return ;
          }

        //updating the value localstorage value 
        localStorageUpdatingItems(itemValue, supplyName, brandName, quantity, unit);  
        currentItemsList(supplyName, itemValue, quantity, unit, brandName)

      })
      value_addition_remove.addEventListener("click", function(evOb) {

        var currentElement = evOb.target.parentNode.parentNode;

        //        console.log(currentElement)
        currentElement.querySelector("#vendor").value = "";
        currentElement.querySelector("#brand").value = "";
        currentElement.querySelector("input[type=number]").value = "";
        currentElement.querySelector("select").value ="";
      })
    
        item_list_unit_value_label.innerText = itemName;
      //  console.log(item_list_unit_value_label) 
        categoryNodeElement[category].push(rootElement)
        dataListing.appendChild(rootElement)
      }

    //  console.log(item_list_unit_value.children);
  } else {
    dataListing.innerHTML = ""; 
    for (var x of categoryNodeElement[category]) {
      dataListing.appendChild(x)
    }
  }
  
}


function currentItemsList(supply, itemname, quant, unit, brand) {
  //adding to the current
  //currentItemOrder
  //first requires to copy the dom element - order_list_data;
  var templateValue = templateVendor.content.cloneNode(true).children[0];
  var orderListData = templateValue.querySelector(".order_list_data")
  var orderListDataBrandItem = templateValue.querySelector(".order_list_data-value--name-brand");
  orderListDataBrandItem.innerHTML = itemname+" "+brand
  var orderListDataQuantity = templateValue.querySelector(".order_list_data-value--quantity-unit")
  orderListDataQuantity.innerHTML = quant + " "+unit;
  
  console.log(orderListData)
  
  var removeButton = orderListData.querySelector("button");
  removeButton.addEventListener("click", removeItemData)
  // append the value to the particular vendor - order_list_items

  //adding id for easier deletion;
  //currentElement
  let currentElements = orderElementList[itemname]?.length ?? 0;
  orderListData.id = "a"+(currentElements+1);

  if(!VendorElementList[supply]) {
    singleVendorListing(supply)
  }

  var elementToInsertIn = (VendorElementList[supply]).querySelector(".order_list_items");
  elementToInsertIn.appendChild(orderListData);
  if(!orderElementList[itemname]) {
    orderElementList[itemname] = [orderListData]
  }else {
    orderElementList[itemname].push(orderListData)
  }
  //console.log(orderElementList)

  //var itemText = itemname+" " + quant +" " +unit;

  // if(!currentVendorItems[supply]) {
  //   currentVendorItems[supply] = [itemText];
  // }
  //using the item name to remove the item;
  //console.log(orderElementList)

  // supplier listing data
  // var eachItemChanges = JSON.stringify(VendorElementList);
  console.log(supply, itemname, quant, unit, brand)
  saveToIndexDB(VendorElementList);

}

function removeItemData(evOb) {
  var target = evOb.target.parentNode;
  var supplyName = (target.parentNode.parentNode.firstElementChild.innerText)
  var idName = "#"+target.id;
  //console.log(target.id, VendorElementList, supplyName)
 
 var updatingVendorELement = VendorElementList[supplyName].querySelector(idName).parentNode.parentNode;
  console.log(updatingVendorELement)
 target.remove();
 VendorElementList[supplyName] = updatingVendorELement;
  saveToIndexDB(VendorElementList);
}

//preview list items

let previewElem = document.querySelector(".preview_list");
let imageIcon = document.querySelector('.up-icon')
let imageValue = document.querySelector(".up-icon img")

imageIcon.addEventListener("click", function(evOb) {
  var target = previewElem;
 // console.log(target)
    
  var dataList = document.querySelector(".preview_list--data");
  dataList.classList.toggle("preview-hide");
 // console.log(dataList);
 
  if(target.className.includes("close")) {
    previewElem.classList.remove(["preview_list__close"]);
    previewElem.classList.add(["preview_list__open"]);
    imageValue.src ="./assets/d-arrow.png";
  }else {
       previewElem.classList.add(["preview_list__close"]);
    previewElem.classList.remove(["preview_list__open"]);
    imageValue.src ="./assets/u-arrow.png";
  }
})

//button functionality
var buttonSelect = document.querySelector(".drag") ;
var ctaButton = document.querySelector(".cta_button")

buttonSelect.addEventListener("pointerdown", checkForAcceptance);

function checkForAcceptance() {
  console.log(orderElementList)
  if(Object.keys(orderElementList).length== 0) {
    alert("add some orders first")
    return;
  }

    buttonSelect.style.width = (250) + "px";
    
    setTimeout(function() {
      window.location.replace("./vendor_share.html")
    },1000)
}


//addiing the value to the list : 
fetch("./vendor_list.json").then(data=> data.json()).then(value => {
  vendorList = value["list"];
  vendorListing()
})

function vendorListing() {

  for (var item of vendorList) {
    var template = templateVendor.content.cloneNode(true).children[0];
    rootElementPreviewText = template;
    var supplyName = template.firstElementChild;
    supplyName.innerHTML = item;
    
    var orderListing = template.querySelector(".order_list_items")
    orderListing.innerHTML = "";
    
    VendorElementList[item]=(template)
    insertElementBefore.appendChild(template)
    //console.log(item, "value")
  }
  //not required here;

}

function singleVendorListing(item) {
  var template = templateVendor.content.cloneNode(true).children[0];
  rootElementPreviewText = template;
  var supplyName = template.firstElementChild;
  supplyName.innerHTML = item;
  
  var orderListing = template.querySelector(".order_list_items")
  orderListing.innerHTML = "";
  
  VendorElementList[item]=(template) 
  insertElementBefore.appendChild(template)
}




///index DB 
var indexDB = window.indexedDB.open("vendorOrder",1);

indexDB.onerror = function (err) {
  console.log(err, "current error")
}

indexDB.onupgradeneeded = function (event) {
  //console.log("upgradeneeded")
  let db = event.target.result;

  let store = db.createObjectStore("vendorElements", {
    keyPath:"id",
    autoIncrement:true
  })

  let index = store.createIndex("elementItems", "elementOrder");
  //console.log(db, store)
}
indexDB.onsuccess = function (event) {
  var db = event.target.result;
  console.log(db.version, "success indexedDB")
  db.close();
}

function saveToIndexDB(listValue) {
  console.log(listValue , "----")
  var localDB = indexedDB.open("vendorOrder",1);
  localDB.onerror = function (err) {
    console.log(err)
  }
  localDB.onsuccess = function (event) {
    var db = event.target.result;
    console.log("calling the db successfull")
    addingVendorlist(db, listValue)

  }
}

function addingVendorlist(db, list) {
  var tnx = db.transaction("vendorElements", "readwrite");
  var store = tnx.objectStore("vendorElements");
  var dataValue = [];
  
  for(var vendor in list){
    var text= list[vendor].outerHTML;
    //console.log(text, String(text));
    dataValue.push(String(text));
  }

  var query = store.put({elementOrder:dataValue, id:1});

  query.onerror = function (err) {
    console.log(err.status.code, err)
  }
  query.onsuccess = function (eve) {
   // console.log("success")
   // console.log(eve.target.result)
  }
  tnx.oncomplete = function () {
    db.close();
  }
}

//indexedDB.deleteDatabase("vendorOrder")

var lStore = localStorage;
//setting the key
 //storing the json stringify version only.

if(!lStore.getItem('itemInfo') ) {
   lStore.setItem("itemInfo","");
 }

 var itemDescription = {}
 //creating object for each items : 
 //key : itemName 
   //value : an object of -> price, amount, brand, supplierName, quantity, unit

   //initializing the values.
function localItemSep(categoriesValue) {
  console.log("hello")
  console.log(lStore.getItem("itemInfo"))


 // console.log(Object.keys().length)
  if(lStore.getItem("itemInfo").length == 0   ){
    //console.log("first time")
  for (var category in categoriesValue) {
    for (var items of categoriesValue[category] ){
      var nameItem = items;
      var price = "N/A"
      var brand = "N/A";
      var supplierName = "N/A";
      var quantity = "N/A";
      var unit = "pcs" ;
      itemDescription[nameItem] = {
        price, brand, supplierName, quantity, unit
      } 
    }
  }

  var string = JSON.stringify(itemDescription);
  lStore.setItem('itemInfo', string);
 //console.log(Object.keys(itemDescription))
  // updating the data wehn 
 
  }
}

function localStorageUpdatingItems(item, supplier, brandName, quantity, unit) {
  var data = JSON.parse(lStore.getItem("itemInfo"));
  data[item]["supplierName"] = supplier;
  data[item]["brand"] =brandName;
  data[item]["quantity"] =quantity ;
  data[item]["unit"] = unit ;
  lStore.setItem("itemInfo", JSON.stringify(data));
  console.log(data[item], lStore.getItem('itemInfo'))
}