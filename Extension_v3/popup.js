/*
Perpose:      To Search some explorer entries from browser history Server by some key-words.
Create-Date:  2023-02-01
Author: 	  unicoder 
ToDo: 		  To seek how to access chrome.storage correctly.(2023-02-12) 
*/
console.log("--你好，我是 bookmark extension popup! -v0.0.33-" + (new Date).toLocaleString());

var home_server = 'http://127.0.0.1:2121/';
var content_init_lines = '\n <p>这里是Popup.</p>\n \
 	<form id="myForm">\n \
 	从书签中搜索如下关键词：<input type="search" name="search">\n \
 	<input type="submit" value="搜索v33">\n \
 	</form>';

// 判断当前是否是first 为first改为second。
var curr_flag = true;  // 初始化

var key = NaN;

// extension v2 implements:
// var bg = chrome.extension.getBackgroundPage();
// bg.test();  // 访问bg里面的函数
// console.log(bg.document.body.innerHTML);  // 访问bg的DOM

(async () => {
	console.log("Will call test method in background!");
	const response = await chrome.runtime.sendMessage({ Greeting : "Aloha" });
	// do something with the response here, not use it outside the function
	console.log(response);
})();
(async () => {
	console.log("Will call Flag method in background!");
	const response = await chrome.runtime.sendMessage({ Flag : "Is_first?" });
	// do something with the response here, not use it outside the function
	console.log(response);
})();
function get_flag(){
	(async () => {
		console.log("Will get flag in background!");
		const response = await chrome.runtime.sendMessage({ Flag : "Is_first?" });
		// do something with the response here, not use it outside the function
		console.log(response);
	})();
}
// function set_flag_to_false(){
// 	chrome.storage.local.set({ key : false }).then  // 10 = false
// 	(
// 		() =>
// 		{
// 			console.log("Curr_flag is 'true'; has modify it to 'false'."); 
// 		}
// 	);
// }

// var fun_get_key = function(){
// 	var tmp = NaN;
// 	chrome.storage.local.get(["key"]).then((result) => {
// 		tmp = result.key;
// 	});
// 	console.log("In 'get_key', " + tmp + " get.");
// 	return tmp;
// };

async function wait_get_first_flag(resolve=()=>{}){
	resolve("_resolve_");
	// curr_flag = await fun_get_key();
	// var tmp = get_flag();
	// console.log("curr_flag = " + curr_flag);
	// if (curr_flag === true) 
	// {
	// 	console.log("You are first(true),now let's change to second(false).")
	// 	set_flag_to_false();
	// }
	// else if	(curr_flag === false)
	// {   // Storaged 'first' is false , used already.
	// 	console.log("First is false,mean once or more useage already;");
	// }
	// else
	// {
	// 	console.log("Wht the fuck first " + curr_flag + " value is mean?");
	// 	set_flag_to_false();
	// } 
	
	// return curr_flag;
}

wait_get_first_flag().then(rsl => {
	console.log(rsl);

	var content_lines = content_init_lines;         // Initial content_lines.
	curr_flag = rsl;
	//var curr_flag_text = rsl.text;
	console.log("After wait and get, curr_flag is " + curr_flag); 
	//console.log("After wait and get, curr_flag_text is " + curr_flag_text);
	var srh_rsp = null;
	var key_search_rt = { number : 0 };
	key_search_rt.my_str = "";

	var content_lines = content_init_lines;         // Initial content_lines.
	chrome.storage.local.get(["key_search_rt"]).then
	(
		(items) => 
		{

			Object.assign(key_search_rt, items);
			srh_rsp = key_search_rt.my_str;
			console.log("Get saved tcp server respons: " + typeof(srh_rsp) + " with value: " + srh_rsp);
			if (srh_rsp.length != 0) {
 				console.log("Saved search responcesses:" + typeof(srh_rsp) + " " + eval(srh_rsp));
				content_lines += srh_rsp;}
			document.body.innerHTML = content_lines;  // This added or added not the response of search server.
			document.forms[0].addEventListener("submit", ()=>{
			    console.log("表单已提交");
			    var search_str = document.forms[0].elements['search'].value;
			    alert("U search " + search_str + " from Server..");
			    
			    fetch(home_server + '?s=' + search_str.toString()).then(r => r.text()).then(result => {
			    // Result now contains the response text, do what you want...
			    	alert(result);
			    	
			    	// content_lines += result;
			    	
			    	// //res = JSON.parse(result);
			    	// key_search_rt = { number : 0};
			    	// key_search_rt.my_str = result;
			    	// chrome.storage.local.set(key_search_rt).then(() => {});
			    	// alert(result);
				});
			});
		}
	);  // Added or not the result of last response.
});
//下面这句不行，因为是异步的，curr_flag获取成false比较晚，再下面的判断语句仍旧是true的初始值没有更新。
// chrome.storage.local.get(["key"]).then((result) => {
// 	curr_flag = result.key;
// 	console.log("Get key value is " + curr_flag + ";curr_flag type is " + typeof(curr_flag) + ";rslt.key type is " + typeof(result.key));
// });





// else alert("Search responcess is null!");

// if (window.DOMParser)
// {
//   parser=new DOMParser();
//   xmlDoc=parser.parseFromString(srh_rsp,"text/xml");
// }
/************************************
content_lines += srh_rsp;
************************************/
// if ( curr_flag || (curr_flag == null))          // Ture is first,virgin.Thus null is also.
// {
	
// 	alert("First!");
// }   
// else                              
// {//document.body.innerHTML=content_init_lines;
// document.addEventListener("DOMContentLoaded",()=>{
//  	document.body.innerHTML=content_init_lines; });
// };


// function insert_html(rslt){
// 	document.addEventListener("DOMContentLoaded",()=>{
// 	//document.body.innerHTML=content_init_lines; 
	
// 	document.body.innerHTML= rslt;
// 	});
// }
// fetch('http://10.10.5.201:9090?par=0').then(r => r.text()).then(result => {
//     // Result now contains the response text, do what you want...
//     console.log(result)
// });
// console.log("--Already fetched test url.--");

// chrome.bookmarks.onCreated.addListener(function(id, bookmark) {
// 	console.log("Call bookmark.onCreated at " + (new Date()).toString())
//   	add_bookmark(bookmark);
// });

// function add_bookmark (bookmark) {
// 	//send bookmark to server, and show return comment from server...
// 	var bk_title = bookmark.title,
// 		bk_url = bookmark.url,
// 		parameter = '?t=' + bk_title + '&u=' + bk_url;
// 	fetch(home_server+parameter).then(r => r.text()).then(result => {
// 		console.log(result)
// 	});
// }

// const tabs = await chrome.tabs.query({
//   url: [
//     //"http://www.unicoder.me:9090",
//     "http://10.10.5.201:9090/",
//     //"https://developer.chrome.com/docs/extensions/",
//   ],
// });
//console.log("--Already alloc tabs. All above.--");

console.log("--All above.--");