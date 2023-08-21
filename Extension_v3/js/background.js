/* Copyright Unicoder's workstation
   Auther: Unicoder
   CreateDate: 2023-01-21
*/
//虽然这种方法适用于持久化后台页面，但由于存储 API的异步特性，它不能保证适用于服务工作者。
//当一个 service worker 被终止时，与之关联的事件监听器也会被终止。由于事件是在服务工作者启动时分派的，异步注册事件会导致事件被删除，
//因为在第一次启动时没有注册监听器。
//要解决此问题，请将事件侦听器注册移至脚本的顶层。
//以下为注册程序：
//var tcp_server = 'http://127.0.0.1:2121/';
var tcp_server = 'http://10.10.5.109:2121/';
chrome.bookmarks.onCreated.addListener(function(id, bookmark) {
	console.log("Call bookmark.onCreated at " + (new Date()).toString())
  	add_bookmark(bookmark, 1);
});
chrome.bookmarks.onChanged.addListener(function(id, changeInfo) {
	console.log("Call bookmark.onChanged at " + (new Date()).toString())
  	add_bookmark(changeInfo, 2);
});

function add_bookmark(obj, type_i)
{
	var par = '?';
	if (obj.title){
		par +=  ('t=' + obj.title)
	}
	if (obj.url){
		par += ('&u=' + obj.url)
	}
	par += ('&tp=' + type_i.toString())
	fetch(tcp_server + par).then(r => r.text()).then(result => {
    // Result now contains the response text, do what you want...
    	console.log(result);
    	//console.log(document.domain);
	});
	// fetch('http://self.request.host',{mode: 'no-cors',}).then(r => r.text()).then(rslt => {
 	// console.log(rslt);  // bad fetch cause of no-cors request's mode
    // });
 //    const myInit = {mode: 'no-cors',
	// 	method: 'GET',};
	// //const myRequest = new Request('http://self.request.host', myInit);
	// const myRequest = new Request('http://10.10.5.176', myInit);
	// //const myMode = myRequest.mode; // returns "cors" by default
	// //console.log(myRequest.host);

	// fetch(myRequest)
	// 	.then(response => response.text())
	// 	.then(result => {
	// 		console.log(result);
	// 	});
	
	//return;
}

// function test()
// {
// 	alert('我是Background！');
// }
var curr_flag = "curr_flag_init_v";
var fun_get_key = async function(){
	try{
		// if (!key){
		// 	console.error("session key can't null.");
		// 	reject();
		// 	return false;
		// };
		chrome.storage.local.get(["key"]), function(res){
			if (res.key) {
				console.log("In BG 'get_key', " + res.key + " get.");
				resolve(res.key);		
			} else {
				resolve('default_value');
			}
		};
	}
	catch (e){
		reject(e)
	}

};


// const run_f_get_key = fun_get_key();
// console.log("Test run_f_get_key:", run_f_get_key);
// run_f_get_key.then((rsl) => {
// 	console.log(rsl);
// };

var fun_set_key = function(){
	var key = NaN;
	chrome.storage.local.set({ key : "abc" }).then((result) => {
		console.log("In BG 'set_key', " + result + " get.");
	});
	
};

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		console.log(sender.tab ?
			"Messaging from a content script:" + sender.tab.url :
			"Messaging from extension.");
		if (request.Greeting === "Aloha")
		{
			console.log("I'm in runtime onMessage. The Greeting is:");
			//test();
			sendResponse({ Answer : "Konoxiwa"});
		}
		if (request.Flag === "Is_first?")
		{
			console.log("I'm in runtime onMessage. The Flag is:");
			var set_rsl = fun_set_key();
			console.log("BG's set key rsl is: " + set_rsl);

			var fun_curr_flag = fun_get_key().then((r) =>{
				curr_flag = r;
				console.log("BG's get key rsl is: " + curr_flag);
			});
			console.log("BG's fun_curr_flag is: " + fun_curr_flag);
			fun_curr_flag.then(r=>{
				console.log(r)
			});
			// fun_get_key().then( x => {
			// 	console.log("BG's fun_get_key result is: " + x.data + ",type is:" + typeof(x.data));
			// })
			//.catch(error => error);
			sendResponse({ Answer : curr_flag });
		}
	}
);

/* Copyright 2014 Google for v2*/ 
// (function(){
// console.log("--background.js is run.--")
	

// var address = "10.10.5.151";
// var port = 9090;
// //var data = new ArrayBuffer("some random bytes");

// var data = str2ab("fdfdfd");

// function str2ab(str) {
//   var buf = new Int8Array(str.length); 

//   for (var i=0, strLen=str.length; i < strLen; i++) {
//     buf[i] = str.charCodeAt(i);
//   }

//   return buf.buffer;
// };

// })();