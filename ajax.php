<?php

switch($_GET['islem']){
	case "userList":
		$val = (int)$_GET['val'];
		
		$userList = array('Buddies'=>array(), 'Messages'=>array());
		
		$i = 0;
		// EACH USER LIST
		$userList['Buddies'][$i]['id'] = 'USERID';
		$userList['Buddies'][$i]['email'] = 'USERNAME';
		$userList['Buddies'][$i]['online'] = true;
		
		//  WHEN USER LOG IN, TO GET ALL NEW MESSAGES 1 TIMES
		if($val > 0){
			$i = 0;
			// EACH MESSAGES
			$userList['Messages'][$i]['id'] = 'MSGID';
			$userList['Messages'][$i]['uid'] = 'USERID';
			$userList['Messages'][$i]['name'] = 'USERNAME';
			$userList['Messages'][$i]['msg'] = 'MESSAGE';
		}
		
		$userList = json_encode($userList);
		
		header ("Content-Type:text/json;charset=utf-8");
		echo $userList;
		break;
	case "readMsg":
		$id = (int)$_REQUEST['msgid']; // MESSAGE ID
		// CAN MAKE READ HERE
		break;
	case "sendMsg":
		$kim = $TAN->userdata('uid'); // WHO SEND MESSAGE USER ID
		$kime = (int)$_POST['kime']; // WHO GET MESSAGE USER ID
		$mesaj = htmlspecialchars(trim($_POST['mesaj'])); // MESSAGE BODY
		$mesaj = nl2br($mesaj);
	
		
		$id = 'NEW MESSAGE ID';
		
		$redis = new Redis(); 
		$redis->connect('127.0.0.1', 6379);
		$redis->publish("chat", json_encode(array('channel'=>'u_'.$kime, 
		'data'=>array('id'=>$id, 'uid'=>$TAN->userdata('uid'), 
		'name'=>$TAN->userdata('email'), 'msg'=>$mesaj)) 	));
		
		echo "ok";
		break;
}

?>
