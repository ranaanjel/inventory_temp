

var indexDB = indexedDB.open("vendorOrder", 1);

var sideIcon = document.querySelector(".icon-image");
var sideBar = document.querySelector(".sidebar")
var sideList = document.querySelector(".side-list")
var icon = document.querySelector(".icon")

var clearData = document.querySelector(".clearOrderItem");

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

indexDB.onsuccess = function(event) {
  console.log("checking the indexDB for the data")
  var db = event.target.result;
  var transaction = db.transaction("vendorElements", "readonly");
  var store = transaction.objectStore("vendorElements");
  var query = store.get(1);
  console.log(store)
  query.onsuccess = function (event) {
    console.log("success")
    appendChildToBody(event.target.result)
  }
}

function appendChildToBody(list) {
  //console.log(list.elementOrder)
  var dataListingDiv = document.querySelector(".listingData");
  if(list == undefined) {
    dataListingDiv.innerHTML ="Nothing to show" 
    return ;
  }
  dataListingDiv.innerHTML = list.elementOrder.join("")

  var shareButton = dataListingDiv.querySelectorAll(".order_list_name");
  shareButton.forEach(item => {
    console.log(item.innerText)
    var shareElement = document.createElement("span");
    var imgElement = document.createElement("img")
    imgElement.src = "./assets/share.svg"
    shareElement.appendChild(imgElement);
    shareElement.addEventListener("click", shareTheData);
    item.appendChild(shareElement)
  })
  var buttonValue = dataListingDiv.querySelectorAll("button");
  buttonValue.forEach(item => {
    item.remove();
  }) 
}
function shareTheData(event) {

   var supplierName = event.target.parentNode.parentNode.innerText;
   //console.log(supplierName)
   if(!navigator.share) {
    alert("not able to share - share not possible");
    return;
   }
  let textToShare = (event.target.parentNode.parentNode.parentNode.lastElementChild.innerText).split("\n");
   var finalText = "";
   for (var i = 0 ; i < textToShare.length ; i+=2) {
        var firstText = textToShare[i].split(" ");
        firstText = firstText.slice(0, firstText.length-1).join(" ") 
        var secondText = textToShare[i+1]
        finalText += firstText + " " +secondText + "\n"

     }
     //console.log(finalText)


  // alert("clicking")
   window.navigator.share({
    title: "Item Order",
    text:finalText
  }).then(m => {
    console.log(m)
  }).catch(err => {
    console.log(err,"error")
  })
  
}

clearData.addEventListener("click", function() {
  var indexDb = indexedDB.open("vendorOrder",1);
  indexDb.onerror = function (err) {
    console.log(err)
  }
  indexDb.onsuccess = function(evOb) {
    console.log("success")
    var db = evOb.target.result;
    var transaction = db.transaction("vendorElements", "readwrite");
    var store = transaction.objectStore("vendorElements");
    var query = store.delete(1);
    
    console.log(store)

    query.onsuccess = function (event) {
      console.log("deleting the value")
      var dataListingDiv = document.querySelector(".listingData");
      dataListingDiv.innerHTML =  ""
    }
  }
})
