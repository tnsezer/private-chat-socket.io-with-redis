var windowFocus = true;
//var username;
var chatHeartbeatCount = 0;
var minChatHeartbeat = 3000;
var maxChatHeartbeat = 33000;
var chatHeartbeatTime = minChatHeartbeat;
var originalTitle;
var blinkOrder = 0;

var chatboxFocus = new Array();
var newMessages = new Array();
var newMessagesWin = new Array();
var chatBoxes = new Array();

var chatHeartbeatCallBackTimer = null;

var socket = io('//'+ document.domain +':2052');
socket.on("on_off", function(data){
	//console.log(data);
	if(data.status == 1){
		$('.chatboxbuddies #buddy_'+data.uid).find('.offline').removeClass('offline').addClass('online');
	}else{
		$('.chatboxbuddies #buddy_'+data.uid).find('.online').removeClass('online').addClass('offline');
	}
	$('#div_Chat_count').html($('.chatboxbuddies').find('.online').length+"/"+$('.divbuddy').length);
});

socket.on("u_"+uid, function(data){
	if ($.cookie('offline') == 1) {
		return;
	}
	//console.log(data);
	GetMessage_callback(data);
});

function chatWindow(id, chatboxtitle) {
    this.id = id;
    this.chatboxtitle = chatboxtitle;
}

$(document).ready(function () {
    originalTitle = document.title;
    if ($.cookie('offline') == 1) {
        $("#div_status").attr("class", "div_status_offline");
    }
    else {
        $("#div_status").attr("class", "div_status_online");
        chatHeartbeat(1);
    }
    $([window, document]).blur(function () {
        windowFocus = false;
    }).focus(function () {
        windowFocus = true;
        document.title = originalTitle;
    });
});

function restructureChatBoxes() {
	align = 0;
	for (x in chatBoxes) {
	    chatboxtitle = chatBoxes[x].id;

	    if ($("#chatbox_" + chatBoxes[x].id).length == 1 &&  $("#chatbox_" + chatboxtitle).css('display') != 'none') {
			if (align == 0) {
				$("#chatbox_"+chatboxtitle).css('right', '250px');
			} else {
				width = (align)*(225+7)+250;
				$("#chatbox_"+chatboxtitle).css('right', width+'px');
			}
			align++;
		}
	}
}

function chatWith(chatuser) {
	createChatBox(chatuser);
	$("#chatbox_"+chatuser+" .chatboxtextarea").focus();
}

function createChatBox(id,chatboxtitle,minimizeChatBox) {
	if ($("#chatbox_"+id).length > 0) {
		if ($("#chatbox_"+id).css('display') == 'none') {
		    $("#chatbox_" + id).css('display', 'block');
			restructureChatBoxes();
        }
        $('#chatbox_' + id + ' .chatboxcontent').css('display', 'block');
        $('#chatbox_' + id + ' .chatboxinput').css('display', 'block');
		$('#chatbox_' + id + ' .chatboxtextarea').focus();
		return;
	}

	$(" <div />" ).attr("id","chatbox_"+id)
	.addClass("chatbox")
	.html('<div class="chatboxhead" onclick="javascript:toggleChatBoxGrowth(\'' + id + '\')"><div class="chatboxtitle chatboxtitle2">' + chatboxtitle + '</div><div class="chatboxoptions"><a href="javascript:void(0)" onclick="javascript:closeChatBox(\'' + id + '\')"><img src="chat/images/close.png" width="16px"/></a></div><br clear="all"/></div><div class="chatboxcontent"></div><div class="chatboxinput"><textarea class="chatboxtextarea" onkeydown="javascript:return checkChatBoxInputKey(event,this,\'' + id + '\');"></textarea></div>')
	.appendTo($( "body" ));
			   
	$("#chatbox_"+id).css('bottom', '0px');
	
	chatBoxeslength = 0;

	for (x in chatBoxes) {
	    if ($("#chatbox_" + chatBoxes[x].id).length==1 && $("#chatbox_" + chatBoxes[x].id).css('display') != 'none') {
			chatBoxeslength++;
		}
	}

	if (chatBoxeslength == 0) {
		$("#chatbox_"+id).css('right', '250px');
	} else {
		width = (chatBoxeslength)*(225+7)+250;
		$("#chatbox_"+id).css('right', width+'px');
	}

    var chatBox = new chatWindow(id, chatboxtitle);
	chatBoxes.push(chatBox);

	if (minimizeChatBox == 1) {
		minimizedChatBoxes = new Array();

		if ($.cookie('chatbox_minimized')) {
			minimizedChatBoxes = $.cookie('chatbox_minimized').split(/\|/);
		}
		minimize = 0;
		for (j=0;j<minimizedChatBoxes.length;j++) {
			if (minimizedChatBoxes[j] == id) {
				minimize = 1;
			}
		}

		if (minimize == 1) {
			$('#chatbox_'+id+' .chatboxcontent').css('display','none');
			$('#chatbox_'+id+' .chatboxinput').css('display','none');
		}
	}

	chatboxFocus[id] = false;

	$("#chatbox_"+id+" .chatboxtextarea").blur(function(){
		chatboxFocus[id] = false;
		$("#chatbox_"+id+" .chatboxtextarea").removeClass('chatboxtextareaselected');
	}).focus(function(){
		chatboxFocus[id] = true;
		newMessages[id] = false;
		$('#chatbox_'+id+' .chatboxhead').removeClass('chatboxblink');
		$("#chatbox_"+id+" .chatboxtextarea").addClass('chatboxtextareaselected');
	});

	$("#chatbox_"+id).click(function() {
		if ($('#chatbox_'+id+' .chatboxcontent').css('display') != 'none') {
			$("#chatbox_"+id+" .chatboxtextarea").focus();
		}
	});
    $("#chatbox_" + id).show();
    $('#chatbox_' + id + ' .chatboxtextarea').focus();
}


function chatHeartbeat(val){
	var itemsfound = 0;
//	if (windowFocus == false) {
//		var blinkNumber = 0;
//		var titleChanged = 0;
//		for (x in newMessagesWin) {
//			if (newMessagesWin[x] == true) {
//				++blinkNumber;
//				if (blinkNumber >= blinkOrder) {
//					document.title = x+' says...';
//					titleChanged = 1;
//					break;	
//				}
//			}
//		}
//		if (titleChanged == 0) {
//			document.title = originalTitle;
//			blinkOrder = 0;
//		} else {
//			++blinkOrder;
//		}

//	} else {
//		for (x in newMessagesWin) {
//			newMessagesWin[x] = false;
//		}
//	}
//    for (x in newMessages) {
//		if (newMessages[x] == true) {
//			if (chatboxFocus[x] == false) {
//				//FIXME: add toggle all or none policy, otherwise it looks funny
//				$('#chatbox_'+x+' .chatboxhead').toggleClass('chatboxblink');
//			}
//		}
//	}
    //AjaxMethods.ChatMethods.chatHeartbeat(chatHeartbeatCallBack, null, null, null, onTimeout);
	$.post('ajax.php?islem=userList&sess_id='+sess_id+'&val='+val, { }, function(data){ chatHeartbeatCallBack(data); });
}
function onTimeout() {
    //alert("Time_Out");
    return false;
}
function chatHeartbeatCallBack(r) {
    if (r == null) return;
    if (r.error != null) {
        //chatHeartbeatCallBackTimer=setTimeout('chatHeartbeat();', chatHeartbeatTime);
        alert(r.error.Message);
        return;
    }
	
	var res = r;
    var itemsfound = 0;
	var online = 0;
    for (var i = 0; i < res.Buddies.length; i++) {
        var buddy = res.Buddies[i];
		if(buddy.online == 1){
			online++;
		}
        if ($('#buddy_' + buddy.id).length == 0) {
            $('#chatbox_mainchat .chatboxbuddies').append('<div onclick="createChatBox(' + buddy.id + ',\'' + buddy.email + '\');return false;" class="divbuddy" id="buddy_' + buddy.id + '"><div class="' + ((buddy.online == 1) ? 'online' : 'offline') + '"></div><div class="buddyname">' + buddy.email + '</div></div>');
        }
        else {
            if (buddy.online == 1) {
                if ($('#buddy_' + buddy.id + ' div:first').attr('class')=='offline'){
                    $('#buddy_' + buddy.id + ' div:first').attr('class', 'online');
                }
            }
            else {
                if ($('#buddy_' + buddy.id + ' div:first').attr('class') == 'online') {
                    $('#buddy_' + buddy.id + ' div:first').attr('class', 'offline');
                }
            }
        }
    }

    $("#div_Chat_count").html(online+"/"+res.Buddies.length);

    for (var i = 0; i < res.Messages.length; i++) {
        var message = res.Messages[i];
        var chatboxtitle = message.uid;
        //if ($("#chatbox_" + chatboxtitle).length <= 0) {
            createChatBox(message.uid, message.name);
        /*}
        else {
            toggleChatBoxGrowth(message.From_ID);
        }*/
        if ($("#chatbox_" + chatboxtitle).css('display') == 'none') {
            $("#chatbox_" + chatboxtitle).css('display', 'block');
            restructureChatBoxes();
        }
        newMessages[message.name] = true;
        newMessagesWin[message.name] = true;
        $("#chatbox_" + chatboxtitle + " .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">' + message.name + ':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">' + message.msg + '</span></div>');
        $("#chatbox_" + chatboxtitle + " .chatboxcontent").scrollTop($("#chatbox_" + chatboxtitle + " .chatboxcontent")[0].scrollHeight);
        itemsfound += 1;
        //AjaxMethods.ChatMethods.messageReceived(message.ID, messageReceived_callback, null, null, null, onTimeout, null);
    }
    chatHeartbeatCount++;
    if (itemsfound > 0) {
        chatHeartbeatTime = minChatHeartbeat;
        chatHeartbeatCount = 1;
    } else if (chatHeartbeatCount >= 10) {
        chatHeartbeatTime *= 2;
        chatHeartbeatCount = 1;
        if (chatHeartbeatTime > maxChatHeartbeat) {
            chatHeartbeatTime = maxChatHeartbeat;
        }
    }
    //chatHeartbeatCallBackTimer=setTimeout('chatHeartbeat();', chatHeartbeatTime);
}
function messageReceived_callback(r) {
    if (r == null) return;
    if (r.error != null) {
        //setTimeout('chatHeartbeat();', chatHeartbeatTime);
        alert(r.error.Message);
        return;
    }
    var res = r.value;
}
function closeChatBox(chatboxtitle) {
	$('#chatbox_'+chatboxtitle).css('display','none');
	restructureChatBoxes();

	//$.post("chat.php?action=closechat", { chatbox: chatboxtitle} , function(data){ });

}

function toggleChatBoxMain() {
    if ($("#chatbox_mainchat .chatboxbuddies").css('display') == 'none') {
        $('#chatbox_mainchat .chatboxbuddies').css('display', 'block');
    }
    else {
        $('#chatbox_mainchat .chatboxbuddies').css('display', 'none');
    }
}

function toggleChatBoxGrowth(chatboxtitle) {
	if ($('#chatbox_'+chatboxtitle+' .chatboxcontent').css('display') == 'none') {  
		
		var minimizedChatBoxes = new Array();
		
		if ($.cookie('chatbox_minimized')) {
			minimizedChatBoxes = $.cookie('chatbox_minimized').split(/\|/);
		}

		var newCookie = '';

		for (i=0;i<minimizedChatBoxes.length;i++) {
			if (minimizedChatBoxes[i] != chatboxtitle) {
				newCookie += chatboxtitle+'|';
			}
		}

		newCookie = newCookie.slice(0, -1)


		$.cookie('chatbox_minimized', newCookie);
		$('#chatbox_'+chatboxtitle+' .chatboxcontent').css('display','block');
		$('#chatbox_'+chatboxtitle+' .chatboxinput').css('display','block');
		$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent")[0].scrollHeight);
	} else {
		
		var newCookie = chatboxtitle;

		if ($.cookie('chatbox_minimized')) {
			newCookie += '|'+$.cookie('chatbox_minimized');
		}
		$.cookie('chatbox_minimized',newCookie);
		$('#chatbox_'+chatboxtitle+' .chatboxcontent').css('display','none');
		$('#chatbox_'+chatboxtitle+' .chatboxinput').css('display','none');
	}
}

function checkChatBoxInputKey(event,chatboxtextarea,chatboxtitle) {
	if(event.keyCode == 13 && event.shiftKey == 0)  {
		message = $(chatboxtextarea).val();
		message = message.replace(/^\s+|\s+$/g,"");
		to_id = $(chatboxtextarea).parents(".chatbox").attr("id").replace("chatbox_","");

		$(chatboxtextarea).val('');
		$(chatboxtextarea).focus();
		$(chatboxtextarea).css('height','44px');
		if (message != '') {
		    var m = new Object;
		    m.message = message;
		    m.to_id = to_id;
			$.post('ajax.php?islem=sendMsg&sess_id=' + sess_id, {kime:m.to_id, mesaj:m.message}, function(data){ SendMessage_callback({uid:m.to_id,name:username,msg:m.message}) });
		}
		return false;
	}

	var adjustedHeight = chatboxtextarea.clientHeight;
	var maxHeight = 94;

	if (maxHeight > adjustedHeight) {
		adjustedHeight = Math.max(chatboxtextarea.scrollHeight, adjustedHeight);
		if (maxHeight)
			adjustedHeight = Math.min(maxHeight, adjustedHeight);
		if (adjustedHeight > chatboxtextarea.clientHeight)
			$(chatboxtextarea).css('height',adjustedHeight+8 +'px');
	} else {
		$(chatboxtextarea).css('overflow','auto');
	}
}
function SendMessage_callback(data) {
	
	
    if (data) {
        $("#chatbox_" + data.uid + " .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">' + data.name + ':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">' + data.msg + '</span></div>');
        $("#chatbox_" + data.uid + " .chatboxcontent").scrollTop($("#chatbox_" + data.uid + " .chatboxcontent")[0].scrollHeight);
        chatHeartbeatTime = minChatHeartbeat;
		chatHeartbeatCount = 1;
    }
}
function GetMessage_callback(data){
	createChatBox(data.uid, data.name);
	$("#chatbox_" + data.uid + " .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">' + data.name + ':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">' + data.msg + '</span></div>');
	$("#chatbox_" + data.uid + " .chatboxcontent").scrollTop($("#chatbox_" + data.uid + " .chatboxcontent")[0].scrollHeight);
	$("#chatbox_" + data.uid + " .chatboxhead").effect("highlight", {}, 1000);
	$.post('ajax.php?islem=readMsg&sess_id='+sess_id, { msgid: data.id });
	chatHeartbeatTime = minChatHeartbeat;
	chatHeartbeatCount = 1;
}
function gooffline() {
    var res = 1;//r.value;
    if (res) {
        $.cookie('offline', 1);
        clearTimeout(chatHeartbeatCallBackTimer);
        $("#div_status").attr("class", "div_status_offline");
        toggleChatStatus();
    }
}
function goonline() {
    var res = 1;//r.value;
    if (res) {
        $.cookie('offline', 0);
        clearTimeout(chatHeartbeatCallBackTimer);
        $("#div_status").attr("class", "div_status_online");
        chatHeartbeatTime = minChatHeartbeat;
        chatHeartbeatCount = 1;
        chatHeartbeat(1);
        toggleChatStatus();
    }
}


function toggleChatStatus(event) {
    if ($('#div_status_change').css('display') == 'none') {
//        $('#div_status_change').fadeIn(3000, function() {
//            $('#div_status_change').show();
//            }
        //            );
        $("#div_goonline").css("width", $("#div_status_change").width() - 27);
        //$("#div_gooffline").css("width", $("#div_status_change").width() - 24);
        var position = $('#div_status').offset();
        $('#div_status_change').css("top", (position.top - $('#div_status_change').height()-6) + "px");
        $('#div_status_change').css("left", (position.left - $('#div_status_change').width() + $('#div_status').width()+6) + "px");
        $('#div_status_change').show();
    } else {
        $('#div_status_change').hide();
    }
    if (event.stopPropagation) {           
        event.stopPropagation();   // W3C model       
        } 
        else {
            event.cancelBubble = true; // IE model       
        }
    }
    function mouseover(div) {
        $(div).css("background-color", "Aqua");
    }
    function mouseout(div) {
        $(div).css("background-color", "White");
    }