﻿function chatWindow(a,b){this.id=a,this.chatboxtitle=b}function restructureChatBoxes(){align=0;for(x in chatBoxes)chatboxtitle=chatBoxes[x].id,1==$("#chatbox_"+chatBoxes[x].id).length&&"none"!=$("#chatbox_"+chatboxtitle).css("display")&&(0==align?$("#chatbox_"+chatboxtitle).css("right","250px"):(width=232*align+250,$("#chatbox_"+chatboxtitle).css("right",width+"px")),align++)}function chatWith(a){createChatBox(a),$("#chatbox_"+a+" .chatboxtextarea").focus()}function createChatBox(a,b,c){if($("#chatbox_"+a).length>0)return"none"==$("#chatbox_"+a).css("display")&&($("#chatbox_"+a).css("display","block"),restructureChatBoxes()),$("#chatbox_"+a+" .chatboxcontent").css("display","block"),$("#chatbox_"+a+" .chatboxinput").css("display","block"),void $("#chatbox_"+a+" .chatboxtextarea").focus();$(" <div />").attr("id","chatbox_"+a).addClass("chatbox").html('<div class="chatboxhead" onclick="javascript:toggleChatBoxGrowth(\''+a+'\')"><div class="chatboxtitle chatboxtitle2">'+b+'</div><div class="chatboxoptions"><a href="javascript:void(0)" onclick="javascript:closeChatBox(\''+a+'\')"><img src="chat/images/close.png" width="16px"/></a></div><br clear="all"/></div><div class="chatboxcontent"></div><div class="chatboxinput"><textarea class="chatboxtextarea" onkeydown="javascript:return checkChatBoxInputKey(event,this,\''+a+"');\"></textarea></div>").appendTo($("body")),$("#chatbox_"+a).css("bottom","0px"),chatBoxeslength=0;for(x in chatBoxes)1==$("#chatbox_"+chatBoxes[x].id).length&&"none"!=$("#chatbox_"+chatBoxes[x].id).css("display")&&chatBoxeslength++;0==chatBoxeslength?$("#chatbox_"+a).css("right","250px"):(width=232*chatBoxeslength+250,$("#chatbox_"+a).css("right",width+"px"));var d=new chatWindow(a,b);if(chatBoxes.push(d),1==c){for(minimizedChatBoxes=new Array,$.cookie("chatbox_minimized")&&(minimizedChatBoxes=$.cookie("chatbox_minimized").split(/\|/)),minimize=0,j=0;j<minimizedChatBoxes.length;j++)minimizedChatBoxes[j]==a&&(minimize=1);1==minimize&&($("#chatbox_"+a+" .chatboxcontent").css("display","none"),$("#chatbox_"+a+" .chatboxinput").css("display","none"))}chatboxFocus[a]=!1,$("#chatbox_"+a+" .chatboxtextarea").blur(function(){chatboxFocus[a]=!1,$("#chatbox_"+a+" .chatboxtextarea").removeClass("chatboxtextareaselected")}).focus(function(){chatboxFocus[a]=!0,newMessages[a]=!1,$("#chatbox_"+a+" .chatboxhead").removeClass("chatboxblink"),$("#chatbox_"+a+" .chatboxtextarea").addClass("chatboxtextareaselected")}),$("#chatbox_"+a).click(function(){"none"!=$("#chatbox_"+a+" .chatboxcontent").css("display")&&$("#chatbox_"+a+" .chatboxtextarea").focus()}),$("#chatbox_"+a).show(),$("#chatbox_"+a+" .chatboxtextarea").focus()}function chatHeartbeat(a){$.post("ajax.php?islem=userList&sess_id="+sess_id+"&val="+a,{},function(a){chatHeartbeatCallBack(a)})}function onTimeout(){return!1}function chatHeartbeatCallBack(a){if(null!=a){if(null!=a.error)return void alert(a.error.Message);for(var b=a,c=0,d=0,e=0;e<b.Buddies.length;e++){var f=b.Buddies[e];1==f.online&&d++,0==$("#buddy_"+f.id).length?$("#chatbox_mainchat .chatboxbuddies").append('<div onclick="createChatBox('+f.id+",'"+f.email+'\');return false;" class="divbuddy" id="buddy_'+f.id+'"><div class="'+(1==f.online?"online":"offline")+'"></div><div class="buddyname">'+f.email+"</div></div>"):1==f.online?"offline"==$("#buddy_"+f.id+" div:first").attr("class")&&$("#buddy_"+f.id+" div:first").attr("class","online"):"online"==$("#buddy_"+f.id+" div:first").attr("class")&&$("#buddy_"+f.id+" div:first").attr("class","offline")}$("#div_Chat_count").html(d+"/"+b.Buddies.length);for(var e=0;e<b.Messages.length;e++){var g=b.Messages[e],h=g.uid;createChatBox(g.uid,g.name),"none"==$("#chatbox_"+h).css("display")&&($("#chatbox_"+h).css("display","block"),restructureChatBoxes()),newMessages[g.name]=!0,newMessagesWin[g.name]=!0,$("#chatbox_"+h+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">'+g.name+':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">'+g.msg+"</span></div>"),$("#chatbox_"+h+" .chatboxcontent").scrollTop($("#chatbox_"+h+" .chatboxcontent")[0].scrollHeight),c+=1}chatHeartbeatCount++,c>0?(chatHeartbeatTime=minChatHeartbeat,chatHeartbeatCount=1):chatHeartbeatCount>=10&&(chatHeartbeatTime*=2,chatHeartbeatCount=1,chatHeartbeatTime>maxChatHeartbeat&&(chatHeartbeatTime=maxChatHeartbeat))}}function messageReceived_callback(a){if(null!=a){if(null!=a.error)return void alert(a.error.Message);a.value}}function closeChatBox(a){$("#chatbox_"+a).css("display","none"),restructureChatBoxes()}function toggleChatBoxMain(){"none"==$("#chatbox_mainchat .chatboxbuddies").css("display")?$("#chatbox_mainchat .chatboxbuddies").css("display","block"):$("#chatbox_mainchat .chatboxbuddies").css("display","none")}function toggleChatBoxGrowth(a){if("none"==$("#chatbox_"+a+" .chatboxcontent").css("display")){var b=new Array;$.cookie("chatbox_minimized")&&(b=$.cookie("chatbox_minimized").split(/\|/));var c="";for(i=0;i<b.length;i++)b[i]!=a&&(c+=a+"|");c=c.slice(0,-1),$.cookie("chatbox_minimized",c),$("#chatbox_"+a+" .chatboxcontent").css("display","block"),$("#chatbox_"+a+" .chatboxinput").css("display","block"),$("#chatbox_"+a+" .chatboxcontent").scrollTop($("#chatbox_"+a+" .chatboxcontent")[0].scrollHeight)}else{var c=a;$.cookie("chatbox_minimized")&&(c+="|"+$.cookie("chatbox_minimized")),$.cookie("chatbox_minimized",c),$("#chatbox_"+a+" .chatboxcontent").css("display","none"),$("#chatbox_"+a+" .chatboxinput").css("display","none")}}function checkChatBoxInputKey(a,b,c){if(13==a.keyCode&&0==a.shiftKey){if(message=$(b).val(),message=message.replace(/^\s+|\s+$/g,""),to_id=$(b).parents(".chatbox").attr("id").replace("chatbox_",""),$(b).val(""),$(b).focus(),$(b).css("height","44px"),""!=message){var d=new Object;d.message=message,d.to_id=to_id,$.post("ajax.php?islem=sendMsg&sess_id="+sess_id,{kime:d.to_id,mesaj:d.message},function(a){SendMessage_callback({uid:d.to_id,name:username,msg:d.message})})}return!1}var e=b.clientHeight,f=94;f>e?(e=Math.max(b.scrollHeight,e),f&&(e=Math.min(f,e)),e>b.clientHeight&&$(b).css("height",e+8+"px")):$(b).css("overflow","auto")}function SendMessage_callback(a){a&&($("#chatbox_"+a.uid+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">'+a.name+':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">'+a.msg+"</span></div>"),$("#chatbox_"+a.uid+" .chatboxcontent").scrollTop($("#chatbox_"+a.uid+" .chatboxcontent")[0].scrollHeight),chatHeartbeatTime=minChatHeartbeat,chatHeartbeatCount=1)}function GetMessage_callback(a){createChatBox(a.uid,a.name),$("#chatbox_"+a.uid+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">'+a.name+':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">'+a.msg+"</span></div>"),$("#chatbox_"+a.uid+" .chatboxcontent").scrollTop($("#chatbox_"+a.uid+" .chatboxcontent")[0].scrollHeight),$("#chatbox_"+a.uid+" .chatboxhead").effect("highlight",{},1e3),$.post("ajax.php?islem=readMsg&sess_id="+sess_id,{msgid:a.id}),chatHeartbeatTime=minChatHeartbeat,chatHeartbeatCount=1}function gooffline(){var a=1;a&&($.cookie("offline",1),clearTimeout(chatHeartbeatCallBackTimer),$("#div_status").attr("class","div_status_offline"),toggleChatStatus())}function goonline(){var a=1;a&&($.cookie("offline",0),clearTimeout(chatHeartbeatCallBackTimer),$("#div_status").attr("class","div_status_online"),chatHeartbeatTime=minChatHeartbeat,chatHeartbeatCount=1,chatHeartbeat(1),toggleChatStatus())}function toggleChatStatus(a){if("none"==$("#div_status_change").css("display")){$("#div_goonline").css("width",$("#div_status_change").width()-27);var b=$("#div_status").offset();$("#div_status_change").css("top",b.top-$("#div_status_change").height()-6+"px"),$("#div_status_change").css("left",b.left-$("#div_status_change").width()+$("#div_status").width()+6+"px"),$("#div_status_change").show()}else $("#div_status_change").hide();a.stopPropagation?a.stopPropagation():a.cancelBubble=!0}function mouseover(a){$(a).css("background-color","Aqua")}function mouseout(a){$(a).css("background-color","White")}var windowFocus=!0,chatHeartbeatCount=0,minChatHeartbeat=3e3,maxChatHeartbeat=33e3,chatHeartbeatTime=minChatHeartbeat,originalTitle,blinkOrder=0,chatboxFocus=new Array,newMessages=new Array,newMessagesWin=new Array,chatBoxes=new Array,chatHeartbeatCallBackTimer=null,socket=io("//"+document.domain+":2052");socket.on("on_off",function(a){1==a.status?$(".chatboxbuddies #buddy_"+a.uid).find(".offline").removeClass("offline").addClass("online"):$(".chatboxbuddies #buddy_"+a.uid).find(".online").removeClass("online").addClass("offline"),$("#div_Chat_count").html($(".chatboxbuddies").find(".online").length+"/"+$(".divbuddy").length)}),socket.on("u_"+uid,function(a){1!=$.cookie("offline")&&GetMessage_callback(a)}),$(document).ready(function(){originalTitle=document.title,1==$.cookie("offline")?$("#div_status").attr("class","div_status_offline"):($("#div_status").attr("class","div_status_online"),chatHeartbeat(1)),$([window,document]).blur(function(){windowFocus=!1}).focus(function(){windowFocus=!0,document.title=originalTitle})});