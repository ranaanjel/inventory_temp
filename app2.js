var indexDB = indexedDB.open("vendorOrder", 1);

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
  console.log(list.elementOrder)
  
  document.body.innerHTML = list.elementOrder.join("")
}