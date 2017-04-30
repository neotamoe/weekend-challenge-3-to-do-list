$(document).ready(onReady);

function onReady(){
  $('#addItem').on('click', addListItem);
  getListItems();
  $(document).on('click', '.completed-button', completeItem);
  $(document).on('click', '.delete-button', deleteItem);
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
        if(response[i].complete===true){
          $('#list').append('<div class="item complete" data-id='+response[i].id+'><span><img src="/checkmark.png"/></span>'+response[i].item+'<span></span><button class="delete-button">Delete Item</button></div>');
        } else{
          $('#list').append('<div class="item" data-id='+response[i].id+'><span class="button-span"><button class="completed-button">Completed!</button></span>'+response[i].item+'<span></span><button class="delete-button">Delete Item</button></div>');
        }  // end else
      }  // end for loop
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
      $('form').trigger('reset');
      getListItems();
    }  //end success
  });  //end ajax
}  //end addListItem

function deleteItem(){
  console.log('delete item button clicked');
  if (confirm('Did you really get this done?  Are you sure you want to delete this?')===true){
    var id = $(this).parent().data('id');
    console.log('id:',id);
    var idToSend = {
      listId: id,
    };
    console.log('idToSend:', idToSend);
    $.ajax({
      type: 'DELETE',
      url:'/deleteItem/',
      data: idToSend,
      success: function(response){
        console.log('response is-->',response);
        console.log('delete-button for id clicked');
        getListItems();
      }  // end success
    });  // end ajax
  } else{
    console.log('delete item cancelled');
  }  // end else
}  // end deleteItem

function completeItem(){
  console.log('completed button clicked');
  var id = $(this).closest('div').data('id');
  console.log('id:',id);
  var idToSend = {
    listId: id,
  };
  $(this).closest('div').addClass('complete');
  $(this).closest('span').replaceWith('<span><img src="/checkmark.png"/></span>');
  console.log('idToSend:', idToSend);
  $.ajax({
    type: 'POST',
    url:'/completeItem/',
    data: idToSend,
    success: function(response){
      console.log('response from server is-->',response);
    }  // end success
  });  // end ajax
}  // end completeItem

function confirmDelete(){
  if (confirm('Did you really get this done?  Are you sure you want to delete this?')===true){
    deleteItem();
  } else{
    console.log('delete item cancelled');
  }

}
