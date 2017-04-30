$(document).ready(onReady);

// items to run when document loads
function onReady(){
  $('#addItem').on('click', addListItem);
  getListItems();
  $(document).on('click', '.completed-button', completeItem);
  $(document).on('click', '.delete-button', deleteItem);
}
// gets all items from database and displays on DOM
function getListItems(){
  $.ajax({
    url: '/getListItems',
    type: 'GET',
    success: function(response){
      $('#list').empty();
      $('#completed-items').empty();
      // displays items on DOM based on whether items is completed or not
      for (var i = 0; i < response.length; i++) {
        if(response[i].complete===true){
          // if item is completed, adds class 'complete', visual indicator (checkmark image) and delete button
          $('#completed-items').append('<div class="item complete" data-id='+response[i].id+'><span class="checkmark"><img id="checkmark-image" src="/checkmark.png"/></span><span class="response">'+response[i].item+'</span><button class="delete-button">Delete</button></div>');
        } else{
          // if item not complete, appends list item with complete and delete button
          $('#list').append('<div class="item" data-id='+response[i].id+'><span class="button-span"><button class="completed-button">Completed!</button></span><span class="response">'+response[i].item+'</span><button class="delete-button">Delete</button></div>');
        }  // end else
      }  // end for loop
    }  //end success
  });  //end ajax GET
}  // end getListItems

// adds new to do item (input) from DOM, sends to server and database, updates DOM
function addListItem(){
  var listItemIn = $('#listItemIn').val();
  var listItemToSend = {
    item: listItemIn
  };
  // send new list item to server and database in ajax call
  $.ajax({
    url: '/addListItem',
    type: 'POST',
    data: listItemToSend,
    // reset input/form field and refresh DOM list upon success
    success: function(response){
      $('form').trigger('reset');
      getListItems();
    }  // end success
  });  // end ajax POST
}  // end addListItem

// deletes item from DOM and database
function deleteItem(){
  // asks for confirmation before deleting item
  if (confirm('Did you really get this done?  Are you sure you want to delete this?')===true){
    var id = $(this).parent().data('id');
    console.log('id:',id);
    var idToSend = {
      listId: id,
    };
    // send id of item to delete and refresh DOM list upon success
    $.ajax({
      type: 'DELETE',
      url:'/deleteItem/',
      data: idToSend,
      success: function(response){
        getListItems();
      }  // end success
    });  // end ajax DELETE
  } else{
    console.log('delete item cancelled');
  }  // end else
}  // end deleteItem

// changes class to 'complete' (adding strikethrough), replaces complete button with checkmark image
function completeItem(){
  var id = $(this).closest('div').data('id');
  var idToSend = {
    listId: id,
  };
  // change class to complete
  $(this).closest('div').addClass('complete');
  // send id of completed item and refresh DOM list upon success
  $.ajax({
    type: 'POST',
    url:'/completeItem/',
    data: idToSend,
    success: function(response){
      getListItems();
    }  // end success
  });  // end ajax POST
}  // end completeItem
