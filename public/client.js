$(document).ready(onReady);

function onReady(){
  $('#addItem').on('click', addListItem);
  getListItems();
  $(document).on('click', '#completed-button', completeItem);
  $(document).on('click', '#delete-button', deleteItem);
}

function getListItems(){
  console.log('in getListItems function');
  $.ajax({
    url: '/getListItems',
    type: 'GET',
    success: function(response){
      console.log('in getListItems: back from server-->', response);
      $('#list').empty();
      for (var i = 0; i < response.length; i++) {
        $('#list').append('<div class="item" data-id='+response[i].id+'"><button id="completed-button">Completed!</button>'+response[i].item+'<span></span><button id="delete-button">Delete Item</button></div>');
      }
    }  //end success
  });  //end ajax
}  // end getListItems


function addListItem(){
  var listItemIn = $('#listItemIn').val();
  var listItemToSend = {
    item: listItemIn
  };
  console.log('sending listItemToSend:', listItemToSend);
  $.ajax({
    url: '/addListItem',
    type: 'POST',
    data: listItemToSend,
    success: function(response){
      console.log('in addListItem: back from server with-->', response);
      $('form').reset();
      getListItems();
    }  //end success
  });  //end ajax
}  //end addListItem

function deleteItem(){
  console.log('delete item button clicked');
}

function completeItem(){
  console.log('completed button clicked');
}