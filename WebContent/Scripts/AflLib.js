//=========================================================
//JavaScript基本ファイル
//作成 Akihiko Oikawa
//========================================================
(function () {
	//名前空間の定義
	AFL = {}
	//ファイルのインポート
	AFL.importJS = function (url) {
		if (typeof (importJS.IMPORTS) == 'undefined')
			importJS.IMPORTS = new Array();
		if (importJS.IMPORTS[url] == null) {
			var scCode = getHttpText(url);
			if (scCode) {
				var sc = document.createElement('SCRIPT');
				sc.text = scCode;
				document.body.appendChild(sc);
			}
			importJS.IMPORTS[url] = true;
		}
	}
	//HTMLデータをテキストに変換
	AFL.htmlToText = function (s) {
		var dumy = document.createElement("span");
		dumy.innerHTML = s;
		return dumy.firstChild.nodeValue;
	}
	//---------------------------------------
	//書式付文字列生成
	//	引数	format,・・・
	//	戻り値	生成文字列
	AFL.sprintf = function () {
		var args = AFL.sprintf.arguments;
		return AFL.vsprintf(args);
	}
	//---------------------------------------
	//書式付文字列生成
	//	引数	args	配列[書式,引数1,,引数2・・・]
	AFL.vsprintf = function (args) {
		if (args[0] == null)
			return '';
		var format = args[0];
		var paramIndex = 1;
		var dest = "";
		for (var i = 0; format.charAt(i) ; i++) {
			if (format.charAt(i) == '%') {
				var flagZero = false;
				var num = 0;
				i++;
				if (format.charAt(i) == '0') {
					flagZero = true;
					i++
				}
				for (; format.charAt(i) >= '0' && format.charAt(i) <= '9'; i++) {
					num *= 10;
					num += parseInt(format.charAt(i));
				}
				switch (format.charAt(i)) {
					case 's':
						var work = String(args[paramIndex++]);
						var len = num - work.length;
						dest += work;
						var len = num - work.length;
						if (len > 0) {
							for (j = 0; j < len; j++)
								dest += ' ';
						}
						break;
					case 'd':
						var work = String(args[paramIndex++]);
						var len = num - work.length;
						if (len > 0) {
							var j;
							var c;
							if (flagZero)
								c = '0';
							else
								c = ' ';
							for (j = 0; j < len; j++)
								dest += c;
						}
						dest += work;
				}
			}
			else
				dest += format.charAt(i);
		}
		return dest;
	}

	//---------------------------------------
	//文字列の置換
	//	引数	src		元文字列
	//			datas	data[置換元] = 置換後
	//	戻り値	生成文字列
	function replaceText(src, datas) {
		var dest = new String();
		var i;
		var length = src.length;
		var flag;
		for (i = 0; i < length; i++) {
			flag = true;
			for (index in datas) {
				var data = datas[index];
				if (src.substr(i, index.length).indexOf(index) == 0) {
					dest += data;
					flag = false;
					i += index.length - 1;
					break;
				}
			}
			if (flag)
				dest += src.charAt(i);
		}
		return dest;
	}
	AFL.replaceText = replaceText;
	//---------------------------------------
	//アドレスの取得、パラメータの削除
	//	引数	無し
	//	戻り値	生成文字列
	function getURL() {
		var i;
		var url = '';
		var src = document.location.href;
		for (i = 0; src.charAt(i) && src.charAt(i) != '?' && src.charAt(i) != '#'; i++)
			url += src.charAt(i);
		return url;
	}

	//---------------------------------------
	//アドレスの取得、ファイル名の削除
	//	引数	無し
	//	戻り値	生成文字列
	function getPATH() {
		var i;
		var path = document.location.href;
		var index = path.lastIndexOf("/");
		if (index >= 0)
			path = path.substring(0, index + 1);
		return path;
	}
	//---------------------------------------------------------
	//Cookie設定
	//	引数	name	名前
	//			value	値
	//	戻り値	無し
	AFL.setCookie = function (name, value) {
		if (value != null) {
			var date = new Date();
			date.setDate(date.getDate() + 30);

			document.cookie =
				encodeURI(name) + "=" + encodeURI(value) + "; expires=" + date.toGMTString() + ";path=/;";
		}
		else {
			var date = new Date();
			date.setDate(date.getDate() - 1);
			document.cookie = encodeURI(name) + "= ; expires=" + date.toGMTString() + ";";
		}
	}

	//---------------------------------------------------------
	//Cookie取得
	//	引数	name	名前
	//	戻り値	値
	AFL.getCookie = function (name) {
		//クッキー分解用
		function getCookies() {
			var dest = Array();
			var cookieData = document.cookie + ";"
			var index1 = 0;
			var index2;
			while ((index2 = cookieData.indexOf("=", index1)) >= 0) {
				var name = cookieData.substring(index1, index2);
				var value = '';
				index1 = index2 + 1;
				index2 = cookieData.indexOf(";", index1);
				if (index2 == -1)
					break;
				value = cookieData.substring(index1, index2);
				if (dest[decodeURI(name)] == undefined)
					dest[decodeURI(name)] = decodeURI(value);
				index1 = index2 + 1;
				for (; cookieData.charAt(index1) == ' '; index1++);
			}
			return dest;
		}
		var cookies = getCookies();
		return cookies[name];
	}

	//---------------------------------------------------------
	//Ajax用インスタンスの作成
	//	引数	無し
	//	戻り値	Ajax用インスタンス
	AFL.getRequest = function () {
		var xmlHttp = null;
		if (window.XMLHttpRequest) {
			xmlHttp = new XMLHttpRequest();
		}
		else if (window.ActiveXObject) {
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
			if (!xmlHttp)
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		return xmlHttp;
	}
	//---------------------------------------------------------
	//Ajaxによるデータ送信
	//	引数	url			接続先アドレス
	//			getData		送信用GETパラメータ
	//			postData	送信用POSTパラメータ
	//			proc		送信完了後のコールバックファンクション(null可)
	//	戻り値	procがnullの場合は、同期通信後データを返す
	AFL.send = function (url, getData, postData, proc) {
		var xmlHttp = AFL.getRequest();
		var methodGET = "";
		if (getData) {
			var urlGET = url.indexOf('?');
			for (name in getData) {
				if (methodGET.length == 0 && urlGET == -1)
					methodGET += '?';
				else
					methodGET += '&';
				methodGET += encodeURIComponent(name) + '=' + encodeURIComponent(getData[name]);
			}
		}

		try {
			url += methodGET;
			if (proc == null)
				xmlHttp.open('POST', url, false);
			else {
				xmlHttp.onreadystatechange = function () {
					if (xmlHttp.readyState == 4) {
						proc(xmlHttp.responseText);
					}
				}
				xmlHttp.open('POST', url, true);
			}
			var data = new Uint8Array(postData);
			xmlHttp.send(data);
		}
		catch (e) {
			alert(e);
			alert("読み込みエラー");
			if (proc != null)
				proc(null);
			return null;
		}
		return xmlHttp.responseText;

	}
	AFL.readFile = function(url,proc)
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4) {
				proc(xmlHttp);
			}
		}
		xmlHttp.open('POST', url, true);
		xmlHttp.send();

	}
	//---------------------------------------------------------
	//Ajaxによるファイル送信
	//	引数	url			接続先アドレス
	//			getData		送信用GETパラメータ
	//			postData	送信ファイルデータ
	//			proc		送信完了後のコールバックファンクション(null可)
	//	戻り値	procがnullの場合は、同期通信後データを返す
	AFL.sendFile = function (url, getData, postData, proc) {
		var xmlHttp = AFL.getRequest();
		var methodGET = "";
		if (getData) {
			var urlGET = url.indexOf('?');
			for (name in getData) {
				if (methodGET.length == 0 && urlGET == -1)
					methodGET += '?';
				else
					methodGET += '&';
				methodGET += encodeURIComponent(name) + '=' + encodeURIComponent(getData[name]);
			}
		}

		function getParam() {
			var data = null;
			while ((last = xmlHttp.responseText.indexOf("\n", pt)) != -1) {
				data = xmlHttp.responseText.substr(pt, last - pt);
				pt = last + 1;
			}
			return data;
		}

		try {

			url += methodGET;
			if (proc == null)
				xmlHttp.open('POST', url, false);
			else {
				xmlHttp.onreadystatechange = function () {
					if (xmlHttp.readyState >= 2) {
						var data = getParam()
						if(data)
						{
							proc(data);
						}
					}
				}
				xmlHttp.open('POST', url, true);
			}
			var data = new Uint8Array(postData);
			var pt = 0;
			xmlHttp.setRequestHeader("Connection", "close");
			if (sessionStorage.getItem("Session"))
			    xmlHttp.setRequestHeader("X-Session", sessionStorage.getItem("Session"));
			xmlHttp.send(data);
		}
		catch (e) {
			alert(e);
			alert("読み込みエラー");
			if (proc != null)
				proc(xmlHttp, data);
			return null;
		}
		return xmlHttp.responseText;

	}
	//---------------------------------------------------------
	//AjaxにJSONデータの送信
	//	引数	url			接続先アドレス
	//			data		送信用オブジェクト
	//			proc		送信完了後のコールバックファンクション(null可)
	//	戻り値	procがnullの場合は、同期通信後データを返す
	AFL.sendJson = function (url, data, proc) {
		var xmlHttp = AFL.getRequest();
		try {
			if (proc == null) {
				xmlHttp.open('POST', url, false);
				return JSON.parse(xmlHttp.responseText);
			}
			else {
				xmlHttp.onreadystatechange = function () {
					if (xmlHttp.readyState == 4) {
						var obj = null;
						try
						{
							obj = JSON.parse(xmlHttp.responseText);
						} catch (e)
						{
							proc(null);
							return;
						}
						proc(obj);
					}
				}
			}
			if (data == null) {
				xmlHttp.open('GET', url, true);
				xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xmlHttp.send(null);
			}
			else {
				xmlHttp.open('POST', url, true);
				xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				if (sessionStorage.getItem("Session"))
					xmlHttp.setRequestHeader("X-Session", sessionStorage.getItem("Session"));
				xmlHttp.send(JSON.stringify(data));
			}
		}
		catch (e) {
			alert("読み込みエラー");
			proc(null);
			return null;
		}
		return null;
	}

	//---------------------------------------------------------
	//Googleカレンダーから祝日データの読み出し
	//	引数	s		取得開始日付
	//			e		取得終了日付
	//			func	送信完了後のコールバックファンクション
	//	戻り値	無し
	AFL.getHoliday = function (s, e, func) {
		var account = "japanese__ja@holiday.calendar.google.com";
		AFL.sendJson("https://www.google.com/calendar/feeds/" + account +
			"/public/basic?start-min=" + s + "&start-max=" + e + "&max-results=30&alt=json", null,
			function (data) {
				var holidays = {};
				var entry = data.feed.entry;
				for (var index in entry) {
					var content = entry[index];
					var name = content.title.$t;
					var d = content.summary.$t.match(/\d.*\/\d.\/\d./);
					holidays[String(d).replace(/\//g, "-")] = name;
				}
				func(holidays);
			}
		);
	}
})();

(function () {
	var doc = document;

	function remove(ar, value) {
		for (var index in ar) {
			if (ar[index] == value) {
				ar.splice(index, 1);
				break;
			}
		}
	}

	WM = {};
	WM.getMouseX = function () {
		return mMouseX;
	}
	WM.getMouseY = function () {
		return mMouseY;
	}
	WM.getAbsX = function (node) {
		var value = parseInt(node.offsetLeft);
		while (node = node.parentNode) {
			if (typeof (node.offsetLeft) != 'undefined')
				value += parseInt(node.offsetLeft);
			if (typeof (node.scrollLeft) != 'undefined')
				value -= parseInt(node.scrollLeft);
		}
		return value;
	}
	WM.getAbsY = function (node) {
		var value = parseInt(node.offsetTop);
		while (node = node.parentNode) {
			if (typeof (node.offsetTop) != 'undefined')
				value += parseInt(node.offsetTop);
			if (typeof (node.scrollTop) != 'undefined')
				value -= parseInt(node.scrollTop);
		}
		return value;
	}
	var mLayout = false;
	WM.layout = function () {
		if (mLayout)
			return;
		mLayout = true;
		setTimeout(
			function () {
				if (WM.window) {
					if (window.innerWidth)
						WM.window.setSize(window.innerWidth, window.innerHeight);
					else
						WM.window.setSize(document.body.clientWidth, document.body.clientHeight);
					mLayout = false;
				}
			}
			, 0);

	}
	WM.getARGB = function (color) {
		var a = (color >>> 24) / 255;
		var r = (color >> 16) & 0xff;
		var g = (color >> 8) & 0xff;
		var b = color & 0xff;
		return "rgba(" + r + "," + g + "," + b + "," + a + ")";
	}
	WM.getRGB = function (color) {
		var r = (color >> 16) & 0xff;
		var g = (color >> 8) & 0xff;
		var b = color & 0xff;
		return "rgb(" + r + "," + g + "," + b + ")";
	}
	WM.blend = function (color1, color2) {
		var alpha = (color2 >> 24) / 256;
		var r1 = (color1 >> 16) & 0xff;
		var g1 = (color1 >> 8) & 0xff;
		var b1 = (color1) & 0xff;
		var r2 = (color2 >> 16) & 0xff;
		var g2 = (color2 >> 8) & 0xff;
		var b2 = (color2) & 0xff;
		r1 = r1 + (r2 - r1) * alpha;
		g1 = g1 + (g2 - g1) * alpha;
		b1 = b1 + (b2 - b1) * alpha;
		return (color1 & 0xff000000) + (r1 << 16) + (g1 << 8) + b1;

	}
	var cnt = 0;
	WM.WINDOW_NONE = cnt++;
	WM.WINDOW_CLIENT = cnt++;
	WM.WINDOW_TITLE = cnt++;
	WM.WINDOW_FRAME_N = cnt++;
	WM.WINDOW_FRAME_E = cnt++;
	WM.WINDOW_FRAME_S = cnt++;
	WM.WINDOW_FRAME_W = cnt++;
	WM.WINDOW_FRAME_NW = cnt++;
	WM.WINDOW_FRAME_NE = cnt++;
	WM.WINDOW_FRAME_SW = cnt++;
	WM.WINDOW_FRAME_SE = cnt++;
	WM.WINDOW_CLOSE = cnt++;
	WM.STYLE_NONE = cnt++;
	WM.STYLE_LEFT = cnt++;
	WM.STYLE_RIGHT = cnt++;
	WM.STYLE_TOP = cnt++;
	WM.STYLE_BOTTOM = cnt++;
	WM.STYLE_CLIENT = cnt++;
	WM.BAR_NS = cnt++;
	WM.BAR_WE = cnt++;
	WM.MSG_MOVE = cnt++;
	WM.MSG_SIZE = cnt++;
	WM.MSG_MOUSE_MOVE = cnt++;


	WM.setMoveWindow = function (win) {
		mWindowDrag = {};
		mWindowDrag.hit = WM.WINDOW_TITLE;
		mWindowDrag.win = win;
		mWindowDrag.mx = mouseX;
		mWindowDrag.my = mouseY;
		mWindowDrag.x = win.getPosX();
		mWindowDrag.y = win.getPosY();
		mWindowDrag.width = win.getWidth();
		mWindowDrag.height = win.getHeight();
	}

	var mMouseDown = false;
	var mWindowDrag = null;
	var mMouseX = 0;
	var mMouseY = 0;

	WM.setMoveWindow = function (win, hit) {
		mWindowDrag = {};
		mWindowDrag.hit = hit == null || win.getMoveFlag() ? WM.WINDOW_TITLE : hit;
		mWindowDrag.win = win;
		mWindowDrag.mx = mMouseX;
		mWindowDrag.my = mMouseY;
		mWindowDrag.x = win.getPosX();
		mWindowDrag.y = win.getPosY();
		mWindowDrag.width = win.getWidth();
		mWindowDrag.height = win.getHeight();
	}
	var mTarget = null;
	WM.getTarget = function () {
		return mTarget;
	}
	function onMouseDblClick(e) {
		var win = WM.window.getWindow(mMouseX, mMouseY);
		if (win) {
			var param = {};
			param = win.screenToClient(mMouseX, mMouseY);
			param.next = true;
			win.call("onMouseDblClick", param);
		}
		return false;
	}
	function onMouseDown(e) {
		mMouseDown = true;

		var win = WM.window.getWindow(mMouseX, mMouseY);
		if (win && win != WM.window) {
			var x = mMouseX - win.getAbsX();
			var y = mMouseY - win.getAbsY();
			win.setForeground();

			if (win != mTarget) {
				if (win.isTargetMode()) {
					var old = mTarget;
					mTarget = win;
					if (old)
						old.call("onTarget", false);
					win.call("onTarget", true);
				}
			}

			var hit = win.getHit(x, y);
			if (hit == WM.WINDOW_CLOSE)
				win.close();
			else {
				WM.setMoveWindow(win, hit);

				var param = {};
				param = win.screenToClient(mMouseX, mMouseY);
				if (param.x < win.getClientWidth() && param.y < win.getClientHeight())
				{
					param.next = true;
					win.call("onMouseClick", param);
				}
			}
			if (hit != WM.WINDOW_CLIENT)
				e.preventDefault();
		}
	}
	function onMouseUp(e) {
		if (mWindowDrag) {
			var win = mWindowDrag.win;
			var param = {};
			param = win.screenToClient(mMouseX, mMouseY);
			if (param.x < win.getClientWidth() && param.y < win.getClientHeight())
			{
				param.next = true;
				win.call("onMoved", param);
			}
		}

		mMouseDown = false;
		mWindowDrag = null;
	}

	function onMouseMove(e) {

		mMouseX = parseInt(e.clientX);
		mMouseY = parseInt(e.clientY);

		var win = WM.window.getWindow(mMouseX, mMouseY);
		if (win && win != WM.window) {
			var hit = win.getHit(x, y);
			if (hit == WM.WINDOW_CLIENT) {
				var param = {};
				param = win.screenToClient(mMouseX, mMouseY);
				if (param.x < win.getClientWidth() && param.y < win.getClientHeight())
				{
					param.next = true;
					win.call("onMouseMove", param);
				}
			}
		}
		if (mWindowDrag) {
			var moveX = mMouseX - mWindowDrag.mx;
			var moveY = mMouseY - mWindowDrag.my;
			var x = mWindowDrag.x + moveX;
			var y = mWindowDrag.y + moveY;

			var win = mWindowDrag.win;
			var flag = true;
			switch (mWindowDrag.hit) {
				case WM.WINDOW_TITLE:
					win.setPos(x, y);
					break;
				case WM.WINDOW_FRAME_W:
					win.setPos(x, mWindowDrag.y);
					win.setWidth(mWindowDrag.width - moveX);
					break;
				case WM.WINDOW_FRAME_N:
					win.setPos(mWindowDrag.x, y);
					win.setHeight(mWindowDrag.height - moveY);
					break;
				case WM.WINDOW_FRAME_S:
					win.setHeight(mWindowDrag.height + moveY);
					break;
				case WM.WINDOW_FRAME_E:
					win.setWidth(mWindowDrag.width + moveX);
					break;
				case WM.WINDOW_FRAME_NW:
					win.setPos(x, y);
					win.setSize(mWindowDrag.width - moveX, mWindowDrag.height - moveY);
					break;
				case WM.WINDOW_FRAME_NE:
					win.setPos(mWindowDrag.x, y);
					win.setSize(mWindowDrag.width + moveX, mWindowDrag.height - moveY);
					break;
				case WM.WINDOW_FRAME_SW:
					win.setPos(x, mWindowDrag.y);
					win.setSize(mWindowDrag.width - moveX, mWindowDrag.height + moveY);
					break;
				case WM.WINDOW_FRAME_SE:
					win.setSize(mWindowDrag.width + moveX, mWindowDrag.height + moveY);
					break;
				default:
					flag = false;

			}
			if(flag)
				e.preventDefault();

		}
	}

	function onResize(e) {
		if (WM.window) {
			if (window.innerWidth)
				WM.window.setSize(window.innerWidth, window.innerHeight);
			else
				WM.window.setSize(document.body.clientWidth, document.body.clientHeight);
		}
	}
	WM.getWidth = function () {
		if (window.innerWidth)
			return window.innerWidth;
		return document.body.clientWidth;
	}
	WM.getHeight = function () {
		if (window.innerHeight)
			return window.innerHeight;
		return document.body.clientHeight;
	}
	WM.isKey = function (index) {
		return
	}
	WM.isShift = function () {
		return mShiftKey;
	}
	WM.isCtrl = function () {
		return mCtrlKey;
	}

	var mKeymap = new Array();
	var mShiftKey = false;
	var mCtrlKey = false;

	//キーボード操作の記憶
	function onKeyup(e) {
		var code;
		if (e) {
			code = e.keyCode;
			mCtrlKey = typeof (e.modifiers) == 'undefined' ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK;
			mShiftKey = typeof (e.modifiers) == 'undefined' ? e.shiftKey : e.modifiers & Event.SHIFT_MASK;
		}
		else {
			code = event.keyCode;
			mCtrlKey = event.ctrlKey;
			mShiftKey = event.shiftKey;
		}
		mKeymap[code] = false;
	}
	function onKeydown(e) {
		var code;
		if (e) {
			code = e.keyCode;
			mCtrlKey = typeof (e.modifiers) == 'undefined' ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK;
			mShiftKey = typeof (e.modifiers) == 'undefined' ? e.shiftKey : e.modifiers & Event.SHIFT_MASK;
		}
		else {
			code = event.keyCode;
			mCtrlKey = event.ctrlKey;
			mShiftKey = event.shiftKey;
		}
		mKeymap[code] = true;
	}
	WM.isKeymap = function (code) {
		return mKeymap[code];
	}



	if (document.addEventListener) {
		document.addEventListener('mousedown', onMouseDown, false);
		document.addEventListener('dblclick', onMouseDblClick, false);
		document.addEventListener('mouseup', onMouseUp, false);
		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('keyup', onKeyup, false);
		document.addEventListener('keydown', onKeydown, false);
		window.addEventListener('resize', onResize, false);
	}
	var mForgroundWindow = {};
	//ウインドウの生成
	WM.createWindow = function (elem, tagName) {
		WM.layout();

		var mTitle = "";
		var mPriority = 1;
		var mClientStyle = WM.STYLE_NONE;
		var mChildList = [];
		var mTopMost = false;
		var mMoveFlag = false;
		var win;
		var mZ = 0;
		var mW = 0;
		var mTargetMode = false;

		win = elem == null ? document.createElement(tagName ? tagName : "div") : elem;
		win.setTargetMode = function (flag) {
			mTargetMode = flag;
		}
		win.isTargetMode = function () {
			return mTargetMode;
		}
		win.isTarget = function () {
			return WM.getTarget() == this;
		}
		win.setScroll = function (flag) {
			if (flag)
				this.style.overflow = "auto";
			else
				this.style.overflow = "hidden";
		}

		win.getZ = function () {
			return mZ;
		}
		win.setZ = function (value) {
			mZ = value;
		}
		win.getW = function () {
			return mW;
		}
		win.setW = function (value) {
			mW = value;
		}
		win.setAlpha = function (alpha) {
			this.style.filter = 'alpha(opacity=' + alpha + ')';
			this.style.MozOpacity = alpha / 100;
			this.style.opacity = alpha / 100;
		}
		win.parent = null;
		//---------------------------------------
		//背景色の設定
		//	[引数]   v 0xAARRGGBB
		//	[戻り値] 無し
		win.setBackgroundColor = function (v) {
			win.style.backgroundColor = WM.getARGB(v);
		}
		win.callback = function () {
			win._callback = arguments[0];
			win._callback(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
		}
		win.screenToClient = function (x, y) {
			var p = {};
			p.x = x - this.getAbsX() - this.getClientX();
			p.y = y - this.getAbsY() - this.getClientY();
			return p;
		}
		var clientX1 = 0;
		var clientY1 = 0;
		var clientX2 = 0;
		var clientY2 = 0;
		win.setClientMargin = function (x1, y1, x2, y2) {
			clientX1 = x1;
			clientY1 = y1;
			clientX2 = x2;
			clientY2 = y2;
		}
		var mVisible = true;
		win.setVisible = function (flag) {
			mVisible = flag;
			this.style.display = flag ? 'block' : 'none';
			WM.layout();
		}
		win.setHtml = function (v) {
			if (v.nodeType)
				this.appendChild(v);
			else
				this.innerHTML = v;
		}
		win.addHtml = function (v) {
			if (v.nodeType)
				this.appendChild(v);
			else
				this.innerHTML += v;
		}
		win.getHtml = function (v) {
			return this.innerHTML;
		}

		win.close = function () {
			win.parent.delChild(this);
			mFunction = [];
		}
		win.isVisible = function () {
			if (!mVisible)
				return false;
			if (parent.getParent)
				return parent.getParent().isVisible();
			return true;
		}
		win.isTopMost = function () {
			if (mTopMost)
				return mTopMost;
			else
				return mTopMost;

		}
		win.setMoveFlag = function (flag) {
			mMoveFlag = flag;
		}
		win.getMoveFlag = function () {
			return mMoveFlag;
		}
		win.setTopMost = function (flag) {
			mTopMost = flag;
		}
		win.getTitle = function () {
			return mTitle;
		}
		win.setTitle = function (title) {
			mTitle = title;
		}
		win.getPriority = function () {
			return mPriority;
		}
		win.setPriority = function (value) {
			mPriority = value;
		}
		win.setForeground = function () {
			var foreground = [this];
			var parent = this;
			parent.call("onForeground", { "foreground": true });
			while (parent = parent.getParent()) {
				foreground.push(parent);
				var list = [].concat(parent.getChilds());
				list.sort(sortZ);
				for (var i in list) {
					var node = list[i];
					if (node == this)
						node.setZ(1000);
					else
						node.setZ(list.length - i);
				}
				parent.call("onForeground", { "foreground": true });
				WM.layout();
			}
			for (var index in mForgroundWindow) {
				var w = mForgroundWindow[index];
				if (foreground.indexOf(w) == -1) {
					w.call("onForeground", { "forground": false });
				}
			}
			mForgroundWindow = foreground;
		}
		win.getChilds = function () {
			return mChildList;
		}
		win.getClientX = function () {
			return clientX1;
		}
		win.getClientY = function () {
			return clientY1;
		}
		function sortZ(a, b) {
			var valueA = a.getZ() + a.getW() + (a.isTopMost() ? 10000 : 0) +
				(a.getClientStyle() == WM.STYLE_NONE ? 2000 : 0) +
				(a.style.position != "relative" ? 1000 : 0);
			var valueB = b.getZ() + b.getW() + (b.isTopMost() ? 10000 : 0) +
				(b.getClientStyle() == WM.STYLE_NONE ? 2000 : 0) +
				(b.style.position != "relative" ? 1000 : 0);
			return valueB - valueA;
		}
		win.getWindow = function (x, y) {


			var hit = this.isHit(x, y);
			if (WM.window != this)
				if (!hit)
					return null;
			if (this.getHit(x - win.getAbsX(), y - win.getAbsY()) == WM.WINDOW_CLIENT) {
				var list = [].concat(mChildList);

				list.sort(sortZ);
				for (var index in list) {
					var w = list[index].getWindow(x - this.getPosX() - this.getClientX(), y - this.getPosY() - this.getClientY());
					if (w)
						return w;

				}
			}
			return hit ? this : null;
		}
		var mFunction = {};
		win.addEvent = function (name, func) {
			if (!mFunction[name])
				mFunction[name] = [];
			mFunction[name].push(func);
		}
		win.getProc = function (name) {
			return mFunction[name];
		}
		win.call = function (name, param) {
			if (param == null)
				param = {};
			var proc = mFunction[name];
			for (var index in proc) {
				this.callback(proc[index], param);
				if (param.stop)
					break;
			}
		}
		win.getChildCount = function () {
			return mChildList.length;
		}
		win.addChild = function (w) {
			if (w.parent)
				w.parent.delChild(w);
			w.parent = this;
			mChildList.push(w);
			if (w.style.position == "absolute")
				this.appendChild(w);
			w.setForeground();
			//this.layout();
		}
		win.delChild = function (w) {

			if (w.parentNode)
				w.parentNode.removeChild(w)
			//try { this.removeChild(w); } catch (e) {alert(e); }
			remove(mChildList, w);
			w.parent = null;
		}
		win.getPosX = function () {
			if (this.style.position == "relative")
				return this.offsetLeft;
			return parseInt(this.style.left);
		}
		win.getPosY = function () {
			if (this.style.position == "relative")
				return this.offsetTop;
			return parseInt(this.style.top);
		}
		win.setPosX = function (value) {
			if (this.style.position == "relative")
				this.style.left = value + parseInt(this.style.left) - this.offsetLeft + "px";
			else
				this.style.left = value + "px";
		}
		win.setPosY = function (value) {
			if (this.style.position == "relative")
				this.style.top = value + parseInt(this.style.top) - this.offsetTop + "px";
			else
				this.style.top = value + "px";
		}
		win.getParent = function () {
			return this.parent;
		}
		win.getAbsX = function () {
			var v = this.getPosX();
			var node = this;
			while (node = node.parentNode) {
				if (node.style && node.style.left)
					v += parseInt(node.style.left);
			}
			return v;
		}
		win.getAbsY = function () {
			var v = this.getPosY();
			var node = this;
			while (node = node.parentNode) {
				if (node.style && node.style.top)
					v += parseInt(node.style.top);
			}
			return v;
		}
		//---------------------------------------
		//位置の設定
		//	[引数]
		//  x X座標(省略時センタリング)
		//  y Y座標(省略時センタリング)
		//	[戻り値] 無し
		win.setPos = function (x, y) {
			if (x == null && y == null) {
				var parent = this.getParent();
				if (parent) {
					var px = (parent.getClientWidth() - this.getWidth()) / 2;
					var py = (parent.getClientHeight() - this.getHeight()) / 2;
					if(px < 0) px = 0;
					if(py < 0) py = 0;
					this.setPos(px,py);
				}
			}
			else {
				this.setPosX(x);
				this.setPosY(y);
			}
		}
		win.getWidth = function () {
			if (WM.window == this)
				return WM.getWidth();
			return parseInt(this.style.width);
		}
		win.getHeight = function () {
			if (WM.window == this)
				return WM.getHeight();
			return parseInt(this.style.height);
		}
		win.getClientWidth = function () {
			if (WM.window == this)
				return WM.getWidth();
			return this.clientWidth;
		}
		win.getClientHeight = function () {
			if (WM.window == this)
				return WM.getHeight();
			return this.clientHeight;
		}
		win.setSize = function (width, height) {

			var param = {};
			param.width = width;
			param.height = height;
			param.next = true;
			win.call("onSize", param);
			if (param.next && WM.window != this) {
				this.style.width = param.width + "px";
				this.style.height = param.height + "px";
			}
			win.call("onSized", param);
			this.layout();
		}
		win.setClientSize = function (width, height) {
			this.setSize(this.getWidth() - this.getClientWidth() + width, this.getHeight() - this.getClientHeight() + height);
		}
		win.setWidth = function (width) {
			this.setSize(width, this.getHeight());
		}
		win.setHeight = function (height) {
			this.setSize(this.getWidth(), height);
		}
		win.isHit = function (x, y) {
			var winX = this.getPosX();
			var winY = this.getPosY();
			if (x >= winX && x <= winX + this.getWidth() && y >= winY && y <= winY + this.getHeight())
				return true;
			return false;
		}
		win.getHit = function (x, y) {
			return WM.WINDOW_CLIENT;
		}
		//---------------------------------------
		//子ウインドウ時の配置設定を返す
		//[引数]
		//[戻り値] 配置設定
		win.getClientStyle = function () {
			return mClientStyle;
		}
		//---------------------------------------
		//子ウインドウ時の配置設定
		//[引数]
		//style
		// WM.STYLE_NONE 自動配置無し
		// WM.STYLE_LEFT 左
		// WM.STYLE_RIGHT 右
		// WM.STYLE_TOP 上
		// WM.STYLE_BOTTOM 下
		// WM.STYLE_CLIENT 他のビュー配置後の残り全て
		//[戻り値] 無し
		win.setClientStyle = function (style) {
			mClientStyle = style;
		}
		var mLayoutFlag = true;
		win.layout = function (flag) {
			if (flag == false)
				this._layout();
			else {
				if (mLayoutFlag) {
					mLayoutFlag = false;
					setTimeout(function () { win._layout(); }, 1);
				}
			}
		}
		win._layout = function () {
			mLayoutFlag = true;
			function sortPriority(a, b) {
				if (a.getClientStyle() == WM.STYLE_CLIENT)
					return 1;
				if (b.getClientStyle() == WM.STYLE_CLIENT)
					return -1;
				return a.getPriority() - b.getPriority();
			}
			var x1 = 0;
			var y1 = 0;
			var x2 = x1 + this.getClientWidth();
			var y2 = this.getClientHeight();

			var list = [].concat(mChildList);
			list.sort(sortZ);
			for (var index in list) {
				var w = list[index];
				w.style.zIndex = 100 + list.length - index + 1;

			}
			var list = [].concat(mChildList);
			list.sort(sortPriority);
			for (var index in list) {
				var w = list[index];
				if (w.isVisible()) {
					switch (w.getClientStyle()) {
						case WM.STYLE_TOP:
							w.setPos(x1, y1);
							w.setWidth(x2 - x1);
							y1 += w.getHeight();
							break;
						case WM.STYLE_LEFT:
							w.setPos(x1, y1);
							w.setHeight(y2 - y1);
							x1 += w.getWidth();
							break;
						case WM.STYLE_RIGHT:
							w.setPos(x2 - w.getWidth(), y1);
							w.setHeight(y2 - y1);
							x2 -= w.getWidth();
							break;
							break;
						case WM.STYLE_BOTTOM:
							w.setPos(x1, y2 - w.getHeight());
							w.setWidth(x2 - x1);
							y2 -= w.getHeight();
							break;
						case WM.STYLE_CLIENT:
							w.setPos(x1, y1);
							w.setSize(x2 - x1, y2 - y1);
							break;
						default:
							w.setSize(w.getWidth(), w.getHeight());
							break;
					}
				}

			}
		}
		if (win.style)
			win.style.overflow = "hidden";
		//win.style.backgroundColor = "#ffffff";

		win.setSize(640, 480);
		win.setPos(0, 0);
		if (WM.window) {
			if (elem == null || elem.style.position != "relative")
				win.style.position = "absolute";
			WM.window.addChild(win);
			WM.window.layout();
		}
		return win;
	}
	//---------------------------------------
	//ウインドウ分割バーの作成
	//[引数] 無し
	//[戻り値] 分割用ウインドウのインスタンス
	WM.createSplit = function () {
		var mBarSize = 8;
		var split = this.createWindow();
		split.style.overflow = "hidden";
		var mChilds = [];
		for (var i = 0; i < 2; i++) {
			mChilds[i] = this.createWindow();
			mChilds[i].setZ(1);
			split.addChild(mChilds[i]);
		}

		var mBar = this.createWindow();
		mBar.style.overflow = "hidden";
		var mBarStyle = WM.BAR_NS;

		var mBarPos = 100;
		var mBarBorder = document.createElement("canvas");
		mBarBorder.style.zIndex = 10;
		mBar.__setSize = mBar.setSize;
		mBar.setSize = function (width, height) {
			mBarBorder.width = width;
			mBarBorder.height = height;
			this.__setSize(width, height);
			var ctx = mBarBorder.getContext('2d');
			ctx.fillStyle = "#AAAAAA";
			ctx.fillRect(0, 0, width, 1);
			ctx.fillRect(0, 0, 1, height);
			ctx.fillStyle = "#444444";
			ctx.fillRect(0, height - 1, width, 1);
			ctx.fillRect(width - 1, 0, 1, height);
			ctx.fillStyle = "#DDDDDD";
			ctx.fillRect(1, 1, width - 2, height - 2);

		}
		mBar.appendChild(mBarBorder);
		split.setClientStyle(WM.STYLE_CLIENT);
		split.__setSize = split.setSize;
		split.setSize = function (width, height) {
			var barWidth = width;
			var barHeight = height;
			if (mBarStyle == WM.BAR_NS)
				barWidth = mBarSize;
			else
				barHeight = mBarSize;
			mBar.setSize(barWidth, barHeight);
			this.__setSize(width, height);
		}
		mBar.__setPos = mBar.setPos;
		mBar.setPos = function (x, y) {
			if (mBarStyle == WM.BAR_NS) {
				mBar.__setPos(x, 0);
			}
			else {
				mBar.__setPos(0, y);
			}
			split.layout();
		}
		mBar.getHit = function () {
			return WM.WINDOW_TITLE;
		}
		//---------------------------------------
		//分割バーの位置設定
		//	[引数]   位置
		//	[戻り値] 無し
		split.setBarPos = function (pos) {
			mBarPos = pos;
			mBar.setPos(pos, pos);
		}
		split.__layout = split.layout;
		split.layout = function () {
			this.__layout();
			var width = this.getClientWidth();
			var height = this.getClientHeight();
			if (mBarStyle == WM.BAR_NS) {
				mBarBorder.style.cursor = 'w-resize';
				mChilds[0].setSize(mBar.getPosX(), height);
				mChilds[1].setSize(width - mBar.getPosX() - mBarSize, height);
				mChilds[1].setPos(mBar.getPosX() + mBarSize, 0);
			}
			else {
				mBarBorder.style.cursor = 's-resize';
				mChilds[0].setSize(width, mBar.getPosY());
				mChilds[1].setSize(width, height - mBar.getPosX() - mBarSize, height);
				mChilds[1].setPos(0, mBar.getPosY() + mBarSize);
			}
		}
		split.setBarPos(100);
		split.addChild(mBar);
		split.addChild = function (w, index) {
			if (index != null)
				mChilds[index].addChild(w);
			else {
				for (var i = 0; i < 2; i++)
					if (mChilds[i].getChildCount() == 0) {
						mChilds[i].addChild(w);
						break;
					}
			}
		}
		//---------------------------------------
		//バーの方向設定
		//	[引数]
		//	style
		//  WM.BAR_NS 縦バー
		//  WM.BAR_WE 横バー
		//	[戻り値] HTMLデータ
		split.setBarStyle = function (style) {
			mBarStyle = style;
			this.setBarPos(mBarPos);
		}
		return split;

	}
	//---------------------------------------
	//フレームウインドウの生成
	//	[引数]   elem  作成に利用するタグ(省略可能)
	//	[戻り値] ウインドウ
	WM.createFrameWindow = function (elem) {
		function setTitle() {
			var width = frame.getWidth();
			mTitle.style.left = mBorderSize + "px";
			mTitle.style.top = mBorderSize + "px";
			mTitle.width = width - mBorderSize * 2;
			mTitle.height = mTitleSize;
			var ctx = mTitle.getContext('2d');
			var grad = ctx.createLinearGradient(0, 0, width, 0);
			grad.addColorStop(0, "#5555FF");
			grad.addColorStop(1, "#3333FF");
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, mTitle.width, mTitle.height - 1);
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, mTitle.height - 1, mTitle.width, 1);

			var height = mTitleSize - 5;
			var ctx = mTitle.getContext('2d');
			ctx.font = "800 " + height + "px 'sans-serif'";
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText(frame.getTitle(), 4, height + 1);

			mButtonClose.style.left = width - mBorderSize * 3 + "px";
			mButtonClose.style.top = 1 + mBorderSize + "px";
		}
		function setBorder() {
			var width = frame.getWidth();
			var height = frame.getHeight();

			mClient.style.width = width - mBorderSize * 2 + "px";
			mClient.style.height = height - mTitleSize - mBorderSize * 2 + "px";
			mClient.style.left = mBorderSize + "px";
			mClient.style.top = mTitleSize + mBorderSize + "px";
			var borderPos =
				[
					[mBorderSize, 0, width - mBorderSize * 2, mBorderSize],
					[0, mBorderSize, mBorderSize, height - mBorderSize * 2],
					[mBorderSize, height - mBorderSize, width - mBorderSize * 2, mBorderSize],
					[width - mBorderSize, mBorderSize, mBorderSize, height - mBorderSize * 2],
					[0, 0, mBorderSize, mBorderSize],
					[0, height - mBorderSize, mBorderSize, mBorderSize],
					[width - mBorderSize, 0, mBorderSize, mBorderSize],
					[width - mBorderSize, height - mBorderSize, mBorderSize, mBorderSize],
				];
			for (var i = 0; i < mBorders.length; i++) {
				var pos = borderPos[i];
				var b = mBorders[i]
				b.style.marginLeft = pos[0] + "px";
				b.style.marginTop = pos[1] + "px";
				b.width = pos[2];
				b.height = pos[3];

				var ctx = b.getContext('2d');
				switch (i) {
					case 0:
					case 2:
						ctx.fillStyle = "#AAAAAA";
						ctx.fillRect(0, 0, pos[2], 1);
						ctx.fillStyle = "#444444";
						ctx.fillRect(0, pos[3] - 1, pos[2], 1);
						ctx.fillStyle = "#DDDDDD";
						ctx.fillRect(0, 1, pos[2], pos[3] - 2);
						b.style.cursor = 's-resize';
						break;
					case 1:
					case 3:
						ctx.fillStyle = "#AAAAAA";
						ctx.fillRect(0, 0, 1, pos[3]);
						ctx.fillStyle = "#444444";
						ctx.fillRect(pos[2] - 1, 0, 1, pos[3]);
						ctx.fillStyle = "#DDDDDD";
						ctx.fillRect(1, 0, pos[2] - 2, pos[3]);
						b.style.cursor = 'w-resize';
						break;
					case 4:
						ctx.fillStyle = "#DDDDDD";
						ctx.fillRect(0, 0, pos[2], pos[3]);
						ctx.fillStyle = "#AAAAAA";
						ctx.fillRect(0, 0, 1, pos[3]);
						ctx.fillRect(0, 0, pos[2], 1);
						b.style.cursor = 'se-resize';
						break;
					case 5:
						ctx.fillStyle = "#DDDDDD";
						ctx.fillRect(0, 0, pos[2], pos[3]);
						ctx.fillStyle = "#AAAAAA";
						ctx.fillRect(0, 0, 1, pos[3]);
						ctx.fillStyle = "#444444";
						ctx.fillRect(0, pos[3] - 1, pos[2], 1);
						b.style.cursor = 'sw-resize';
						break;
					case 6:
						ctx.fillStyle = "#DDDDDD";
						ctx.fillRect(0, 0, pos[2], pos[3]);
						ctx.fillStyle = "#444444";
						ctx.fillRect(pos[2] - 1, 0, 1, pos[3]);
						ctx.fillStyle = "#AAAAAA";
						ctx.fillRect(0, 0, pos[3], 1);
						b.style.cursor = 'sw-resize';
						break;
					case 7:
						ctx.fillStyle = "#DDDDDD";
						ctx.fillRect(0, 0, pos[2], pos[3]);
						ctx.fillStyle = "#444444";
						ctx.fillRect(pos[2] - 1, 0, 1, pos[3]);
						ctx.fillRect(0, pos[3] - 1, pos[2], 1);
						b.style.cursor = 'se-resize';
						break;
				}
			}

		}
		var boxColor = ["#aaaaaa", "#cccccc", "#333333", "#222222"];
		var boxColor2 = ["#bbbbbb", "#dddddd", "#555555", "#333333"];
		function createBox(width, height) {

			function draw(color) {
				canvas.width = width;
				canvas.height = height;
				var ctx = canvas.getContext("2d");
				ctx.fillStyle = color[1];
				ctx.fillRect(0, 0, width, height);

				ctx.strokeStyle = color[0];
				ctx.beginPath();
				ctx.moveTo(width, 0);
				ctx.lineTo(0, 0);
				ctx.lineTo(0, height);
				ctx.stroke();
				ctx.beginPath();

				var margin = 4;
				ctx.beginPath();
				ctx.strokeStyle = color[2];
				ctx.lineWidth = 2;
				ctx.moveTo(margin, margin);
				ctx.lineTo(width - margin, height - margin);
				ctx.moveTo(width - margin, margin);
				ctx.lineTo(margin, height - margin);
				ctx.stroke();


				//マーク
				ctx.strokeStyle = color[3];
				ctx.moveTo(width, 0);
				ctx.lineTo(width, height);
				ctx.lineTo(0, height);
				ctx.stroke();
			}
			var canvas = document.createElement("canvas");
			draw(boxColor);
			canvas.onmouseover = function () {
				draw(boxColor2);
			}
			canvas.onmouseout = function () {
				draw(boxColor);
			}

			return canvas;
		}


		var frame = this.createWindow(elem);
		//frame.setW(1000);
		var mTitleSize = 16;
		var mTitle = document.createElement("canvas");
		frame.appendChild(mTitle);
		mTitle.style.position = "absolute";
		mTitle.style.overflow = "hidden";

		var mButtonClose = createBox(mTitleSize - 3, mTitleSize - 3);
		mButtonClose.style.position = "absolute";
		mButtonClose.style.cursor = "pointer";
		frame.appendChild(mButtonClose);



		var mBorderSize = 8;
		var mBorders = [];
		var mClient = document.createElement('div');
		frame.appendChild(mClient);
		mClient.style.position = "absolute";
		mClient.style.overflow = "hidden";
		for (var i = 0; i < 8; i++) {
			var b = document.createElement("canvas");
			b.style.position = "absolute";
			frame.appendChild(b);
			mBorders.push(b);
		}
		setBorder();
		frame.__setTitle = frame.setTitle;
		//---------------------------------------
		//タイトル設定
		//	[引数]   title タイトル文字列
		//	[戻り値] 無し
		frame.setTitle = function (title) {
			frame.__setTitle(title);
			setTitle();
		}
		frame.addEvent("onSized", onSized);
		function onSized(e) {
			setTitle();
			setBorder();
		}
		frame.__htmlWindow = null;
		frame.getHtmlClient = function () {
			if (!frame.__htmlWindow) {
				var w = WM.createWindow();
				this.addChild(w);
				frame.__htmlWindow = w;
			}
			return frame.__htmlWindow;
		}
		//---------------------------------------
		//HTMLの設定
		//	[引数]   v HTMLデータ
		//	[戻り値] 無し
		frame.setHtml = function (v) {

			frame.getHtmlClient().setHtml(v);
		}
		frame.addHtml = function (v) {
			frame.getHtmlClient().addHtml(v);
		}
		//---------------------------------------
		//HTMLの取得
		//	[引数]   無し
		//	[戻り値] HTMLデータ
		frame.getHtml = function (v) {
			return frame.getHtmlClient().innerHTML;
		}
		frame.getClientX = function () {
			return mBorderSize;
		}
		frame.getClientY = function () {
			return mBorderSize + mTitleSize;
		}
		frame.__addChild = frame.addChild;

		//---------------------------------------
		//HTMLの取得
		//	[引数]   子ウインドウ
		//	[戻り値] 無し
		frame.addChild = function (w) {
			this.__addChild(w);
			mClient.appendChild(w);
		}
		frame.getClientWidth = function () {
			return mClient.clientWidth == 0 ? parseInt(mClient.style.width) : mClient.clientWidth;
		}
		frame.getClientHeight = function () {
			return mClient.clientHeight == 0 ? parseInt(mClient.style.height) : mClient.clientHeight;
		}
		frame.getHit = function (x, y) {
			var width = this.getWidth();
			var height = this.getHeight();
			if (x < mBorderSize) {
				if (y < mBorderSize)
					return WM.WINDOW_FRAME_NW;
				if (y >= height - mBorderSize)
					return WM.WINDOW_FRAME_SW;
				return WM.WINDOW_FRAME_W;
			}
			if (x >= width - mBorderSize) {
				if (y < mBorderSize)
					return WM.WINDOW_FRAME_NE;
				if (y >= height - mBorderSize)
					return WM.WINDOW_FRAME_SE;
				return WM.WINDOW_FRAME_E;
			}
			if (y < mBorderSize)
				return WM.WINDOW_FRAME_N;
			if (y >= height - mBorderSize)
				return WM.WINDOW_FRAME_S;

			function isHit(node) {
				if (x > node.offsetLeft && y > node.offsetTop &&
					x < node.offsetLeft + node.offsetWidth &&
					y < node.offsetTop + node.offsetHeight)
					return true;
				return false;
			}


			if (isHit(mButtonClose))
				return WM.WINDOW_CLOSE;

			if (y < mBorderSize + mTitleSize)
				return WM.WINDOW_TITLE;

			return WM.WINDOW_CLIENT;
		}
		return frame;

	}

	WM.createScrollView = function (elem) {
		var view = this.createWindow(elem);
		var mClient = document.createElement("div");
		mClient.style.position = "absolute";
		mClient.style.overflow = "hidden";
		mClient.style.left = "0px";
		mClient.style.top = "0px";
		view.appendChild(mClient);
		var mArea = document.createElement("div");
		view.appendChild(mArea);
		mArea.style.overflow = "scroll";
		mArea.style.position = "absolute";

		var mScroll = document.createElement("div");
		mArea.appendChild(mScroll);
		mScroll.style.position = "absolute";

		var view_setSize = view.setSize;
		//---------------------------------------
		//ウインドウサイズの設定
		//[引数]
		//width  幅
		//height 高さ
		//[戻り値]無し
		view.setSize = function (width, height) {
			this._callbak = view_setSize;
			this._callbak(width, height);
			mArea.style.width = this.getWidth() + "px";
			mArea.style.height = this.getHeight() + "px";
			mClient.style.width = mArea.clientWidth + "px";
			mClient.style.height = mArea.clientHeight + "px";
		}
		view.setScrollSize = function (width, height) {
			mScroll.style.width = width + "px";
			mScroll.style.height = height + "px";
		}
		view.getClientWidth = function () {
			return mArea.clientWidth;
		}
		view.getClientHeight = function () {
			return mArea.clientHeight;
		}
		view.__addChild = view.addChild;
		view.addChild = function (w) {
			this.__addChild(w);
			mClient.appendChild(w);
		}
		mArea.onscroll = function (e) {
			if (view.onScroll)
				view.onScroll(mArea.scrollLeft, mArea.scrollTop);
		}
		view.getClientNode = function () {
			return mClient;
		}
		view.getScrollX = function () {
			return mArea.scrollLeft;
		}
		view.getScrollY = function () {
			return mArea.scrollTop;
		}
		return view;
	}
	WM.createCanvas = function () {
		var view = this.createWindow();
		var mCanvas = document.createElement("canvas");
		view.appendChild(mCanvas);
		var mSetSize = view.setSize;
		view.setSize = function (width, height) {
			view.callback(mSetSize, width, height)
			mCanvas.width = view.getClientWidth();
			mCanvas.height = view.getClientHeight();
		}
	}
	//パネルの作成
	WM.createPanel = function () {
		var win = this.createWindow();
		win.setClientStyle(WM.STYLE_TOP);
		win.setSize(0, 24);
		//クライアント領域のサイズを返す
		win.setClientMargin(2, 2, 4, 4);

		var panel = document.createElement('DIV');
		win.appendChild(panel);
		win.addEvent("onSized", onSized);

		function onSized() {
			var width = this.getWidth() - 2;
			var height = this.getHeight() - 2;
			if (width < 0)
				witdh = 0;
			if (height < 0)
				height = 0;
			try {
				panel.style.width = width + 'px';
				panel.style.height = height + 'px';
			} catch (e) { }
		}

		panel.style.borderWidth = '1px';
		panel.style.borderStyle = 'solid';
		panel.style.borderColor = 'white black black white';
		panel.style.backgroundColor = "silver";
		return win;
	}

	WM.createTab = function () {
		var mTabItems = [];
		var mTabNodes = [];
		var mSelect = -1;

		var tabNode = this.createWindow();
		tabNode.setClientStyle(WM.STYLE_CLIENT);
		var header = this.createPanel();
		tabNode.addChild(header);

		tabNode._nodes = new Array();
		tabNode.onChange = null;

		tabNode.enableItem = function (index, flag) {
			var item = mTabItems[index];
			item.setEnable(flag);
			if (item) {
				if (!flag) {
					item.style.backgroundColor = "#808080";
				}
				if (mSelect == index) {
					this.selectItem(-1);
				}
			}
		}
		tabNode.getSelectItem = function () {
			return mSelect;
		}
		tabNode.selectItem = function (index) {
			mSelect = index;
			for (var i in mTabItems) {
				var item = mTabItems[i];
				var node = mTabNodes[i];
				if (i == index) {
					item.style.backgroundColor = "#e0e0e0";
					item.style.marginTop = "3px";
					item.style.color = "#000000";
					item.style.fontWeight = "800";
				}
				else {
					item.style.backgroundColor = "#d0d0d0";
					item.style.marginTop = "1px";
					item.style.color = "#888888";
					item.style.fontWeight = "400";
				}
				if (node)
					node.setVisible(i == mSelect);
			}
			this.layout();
			if (this.onChange)
				this.onChange(mSelect);
		}
		tabNode.addItem = function (name, node) {
			var mEnable = true;
			var width = 64;
			var item = WM.createWindow();
			item.__enable = true;
			header.addChild(item);
			item.setSize(width, 0);
			item.setClientStyle(WM.STYLE_LEFT);
			item.style.backgroundColor = "#d0d0d0";
			item.style.borderWidth = '1px';
			item.style.borderStyle = 'solid';
			item.style.borderColor = 'white black black white';
			item.style.margin = "1px";
			item.style.cursor = "pointer";
			item.style.textAlign = "center";
			item.innerHTML = name;
			item.style.backgroundColor = "#d0d0d0";

			var mIndex = mTabItems.length;
			mTabItems.push(item);
			mTabNodes[mIndex] = node;
			if (node) {
				node.setClientStyle(WM.STYLE_CLIENT);
				this.addChild(node);
				node.setVisible(false);
			}
			item.onmousedown = function () {
				tabNode.selectItem(mIndex);
				return false;
			}
			item.isEnable = function () {
				return mEnable;
			}
			item.setEnable = function (flag) {
				mEnable = flag;
			}

			if (mSelect == -1)
				mSelect = 0;
			this.selectItem(mSelect);

			return item._index;
		}

		return tabNode;

	}
	//ボタンの作成
	WM.createButton = function (type) {
		var node = WM.createWindow();
		var button = document.createElement('input');
		if (type == null)
			button.type = 'button';
		else
			button.type = type;
		node.style.backgroundColor = 'transparent';
		node.appendChild(button);
		node.addEvent("onSized", onSized);

		//ボタンスタイル

		button.style.fontFamily = 'monospace';
		button.style.width = '100%';
		button.style.height = '100%';
		button.style.position = "absolute";
		button.style.fontSize = '12px';
		button.style.textAlign = 'center';
		button.style.margin = 0;
		button.style.padding = 0;
		button.style.fontWeight = '500';
		button.style.borderWidth = '1px';
		button.style.borderStyle = 'solid';
		button.style.borderColor = 'white gray gray white';
		button.style.backgroundColor = "silver";
		//マウスによるスタイル変更
		button.onmouseover = function () {
			this.style.backgroundColor = "#dddddd";
		}
		button.onmouseout = function () {
			this.style.borderColor = "white black black white";
			this.style.backgroundColor = "silver";
		}
		button.onmousedown = function () {
			this.style.borderColor = "black white white black";
			return false;
		}
		button.onmouseup = function () {
			this.style.borderColor = "white black black white";
		}
		//ボタンテキストの設定
		var resize = false;
		node.setText = function (text, flag) {
			button.value = text;
			if (flag) {
				resize = true;
				button.style.width = 'auto';
				if (button.offsetWidth == 0) {
					var size = AFL.getFontSize(text, node);
					this.setWidth(size.width * 1.1);
				}
				else
					this.setWidth(button.offsetWidth * 1.1);
				button.style.width = '100%';
			}
			else
				resize = false;
		}
		node.getText = function () {
			return button.value;
		}
		node.setCheck = function (flag) {
			button.checked = flag;
		}
		node.isCheck = function () {
			return button.checked;
		}
		//ボタンテキストの取得
		node.getText = function () {
			return button.value;
		}
		node.setTextColor = function (color) {
			return button.style.color = WM.getARGB(color);
		}
		//ボタンの高さによってフォントサイズの調整
		function onSized() {
			var width = this.getWidth() - 1;
			var height = this.getHeight() - 1;
			if (width < 1)
				width = 1;
			if (height < 1)
				height = 1;
			button.style.width = width + "px";
			button.style.height = height + "px";
			height -= 6;//(height*0.7);
			if (height < 0)
				height = 0;
			button.style.fontSize = height + 'px';

			if (resize) {
				button.style.width = 'auto';
				if (button.offsetWidth == 0) {
					var size = AFL.getFontSize(button.value, node);
					this.setWidth(parseInt(size.width * 1.1));
				}
				else
					this.setWidth(button.offsetWidth * 1.1);
				button.style.width = width + 'px';
			}
		}
		//デフォルトサイズの設定
		node.setSize(64, 24);
		return node;
	}
	//テキストボックスの作成
	WM.createTextBox = function () {
		var mNode = WM.createWindow(null, 'input');
		mNode.style.margin = 0;
		mNode.style.padding = 2;
		mNode.style.borderWidth = 0;
		mNode.style.opacity = 0.9;
		mNode.setText = function (value) {
			this.value = value;
		}
		mNode.getText = function () {
			return this.value;
		}
		mNode.setValue = function (value) {
			this.value = value;
		}
		mNode.getValue = function () {
			return this.value;
		}
		mNode.onkeypress = function (e) {
			if (WM.isKeymap(13) && this.onEnter)
				this.onEnter();
		}
		mNode.setReadOnly = function (flag) {
			this.readOnly = flag;
		}
		mNode.setFocus = function () {
			this.focus();
		}
		mNode.setSize(64, 24);
		return mNode;
	}

	WM.createInputBox = function () {
		var w = WM.createFrameWindow();
		w.setTitle('Input');
		w.setSize(320, 50);
		var text = WM.createTextBox();
		text.setClientStyle(WM.STYLE_CLIENT);
		w.addChild(text);
		var button = WM.createButton();
		button.setClientStyle(WM.STYLE_RIGHT);
		button.setText("設定");
		w.addChild(button);

		w.setButtonText = function (text) {
			button.setText(text);
		}
		text.onkeypress = function (e) {
			if (WM.isKeymap(13))
				w.onEnter();
		}
		button.onclick = function () {
			w.onEnter();
		}
		w.setText = function (value) {
			text.setText(value);
		}
		w.getText = function () {
			return text.getText();
		}
		w.onEnter = function () { }
		w.setFocus = function () {
			text.focus();
		}
		return w;
	}
	WM.createColorPicker = function (param) {
		var mP = [0, 0, 0];
		var mFlag = false;
		var mC = [0, 0, 0];
		var mL = [255, 255, 255];

		var frame = document.createElement("div");
		frame.style.backgroundColor = "#ffffff";

		frame.onColor = null;

		function setTarget() {
			var ctx = canvasTarget.getContext('2d');
			ctx.fillStyle = "rgb(" + (255 - mL[0]) + "," + (255 - mL[1]) + "," + (255 - mL[2]) + ")";
			ctx.fillRect(0, 0, canvasTarget.width, canvasTarget.height);
			ctx.fillStyle = "rgb(" + mL[0] + "," + mL[1] + "," + mL[2] + ")";
			ctx.fillRect(2, 2, canvasTarget.width - 4, canvasTarget.height - 4);

			if (frame.onColor)
				frame.onColor(mL[0], mL[1], mL[2]);
		}
		function getColor(px, py, cx, cy) {
			var value = parseInt((1 - Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2)) / height) * 255 * 1.1);
			if (value < 0)
				value = 0;
			else if (value > 255)
				value = 255;
			return value;
		}
		function setLevel(r, g, b) {
			mC[0] = r;
			mC[1] = g;
			mC[2] = b;
			mL[0] = r;
			mL[1] = g;
			mL[2] = b;

			var grad = ctxLevel.createLinearGradient(0, canvasLevel.height, 0, 0);
			grad.addColorStop(0 + (1 - 1 / 1.1), "rgb(0,0,0)");
			grad.addColorStop(0.5, "rgb(" + r + "," + g + "," + b + ")");
			grad.addColorStop(1 - (1 - 1 / 1.1), "rgb(255,255,255)");
			ctxLevel.fillStyle = grad;
			ctxLevel.fillRect(0, 0, canvasLevel.width, canvasLevel.height);

			setTarget();
		}
		function getColorLevel(py, color) {
			var length = canvasLevel.height / 2;
			var level = (py - length) / length * 1.1;
			if (level < 0) {
				value = parseInt(255 * (-level) + color * (1 + level));
			}
			else {
				value = parseInt(color * (1 - level));
			}
			if (value < 0)
				value = 0;
			else if (value > 255)
				value = 255;
			return value;
		}
		if (param == null)
			param = {};
		var width = param.width ? param.width : 300;
		var height = param.height ? param.height : 300;

		var canvasTarget = document.createElement("canvas");
		frame.appendChild(canvasTarget);
		canvasTarget.width = 32;
		canvasTarget.height = 32;
		canvasTarget.style.position = "absolute";

		var canvasLevel = document.createElement("canvas");
		canvasLevel.style.cursor = "crosshair";
		canvasLevel.width = 32;
		canvasLevel.height = height - 32;
		canvasLevel.style.marginRight = "2px";
		frame.appendChild(canvasLevel);
		var ctxLevel = canvasLevel.getContext('2d');
		ctxLevel.fillStyle = "rgb(0, 0, 0)";
		ctxLevel.fillRect(0, 0, canvasLevel.width, canvasLevel.height);

		var canvas = document.createElement("canvas");
		canvas.style.cursor = "crosshair";
		canvas.width = width - 34;
		canvas.height = height;
		frame.appendChild(canvas);

		var ctx = canvas.getContext('2d');
		width = canvas.width * 0.9;
		height = width / 2 * Math.sqrt(3);

		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		var x = (canvas.width - width) / 2;
		var y = (canvas.height - height) / 2;
		var point = [[x + width / 2, y], [x, y + height], [x + width, y + height]];
		var color = [
			['RGBA(255,0,0,255)', 'RGBA(0,0,0,255)'],
			['RGBA(0,255,0,255)', 'RGBA(0,0,0,255)'],
			['RGBA(0,0,255,255)', 'RGBA(0,0,0,255)']
		];
		ctx.globalCompositeOperation = "lighter";
		for (var i = 0; i < 3; i++) {
			var i0 = i % 3;
			var i1 = (i + 1) % 3;
			var i2 = (i + 2) % 3;
			/* 三角形を描く */
			var grad = ctx.createLinearGradient(point[i0][0], point[i0][1], (point[i1][0] + point[i2][0]) / 2, (point[i1][1] + point[i2][1]) / 2);
			grad.addColorStop(0, color[i][0]);
			grad.addColorStop(1 / 1.1, color[i][1]);
			ctx.fillStyle = grad;

			ctx.beginPath();
			ctx.moveTo(point[i0][0], point[i0][1]);
			ctx.lineTo(point[i1][0], point[i1][1]);
			ctx.lineTo(point[i2][0], point[i2][1]);
			ctx.closePath();
			/* 三角形を塗りつぶす */
			ctx.fill();
		}


		canvas.addEventListener("mousemove", function (e) {
			var rect = e.target.getBoundingClientRect();
			mouseX = e.clientX - rect.left;
			mouseY = e.clientY - rect.top;
			mP[0] = getColor(mouseX, mouseY, point[0][0], point[0][1]);
			mP[1] = getColor(mouseX, mouseY, point[1][0], point[1][1]);
			mP[2] = getColor(mouseX, mouseY, point[2][0], point[2][1]);
			if (mFlag)
				setLevel(mP[0], mP[1], mP[2]);
		}, false);
		canvas.addEventListener("mousedown", function (e) {
			mFlag = true;
			setLevel(mP[0], mP[1], mP[2]);
			e.preventDefault();
		}, false);
		canvas.addEventListener("mouseup", function (e) {
			mFlag = false;
		}, false);
		canvas.addEventListener("mouseout", function (e) {
			mFlag = false;
		}, false);
		canvasLevel.addEventListener("mousemove", function (e) {

			var rect = e.target.getBoundingClientRect();
			mouseX = e.clientX - rect.left;
			mouseY = e.clientY - rect.top;
			mL[0] = getColorLevel(mouseY, mC[0]);
			mL[1] = getColorLevel(mouseY, mC[1]);
			mL[2] = getColorLevel(mouseY, mC[2]);

			if (mFlagLevel)
				setTarget();
		}, false);
		var mFlagLevel = false;
		canvasLevel.addEventListener("mousedown", function (e) {
			mFlagLevel = true;
			setTarget();
		});
		canvasLevel.addEventListener("mouseup", function (e) {
			mFlagLevel = false;
			setTarget();
		});
		setTarget();
		return frame;
	}
	WM.createCalendarView = function () {
		function strDate(date) {
			return AFL.sprintf("%d-%02d-%02d", date.getFullYear(), date.getMonth() + 1, date.getDate());
		}
		function createColumn() {
			var col = document.createElement("span");
			var label = document.createElement("span");
			col.appendChild(label);
			col.label = label;
			col.label.style.display = "inline-block";
			col.label.style.padding = "0.2em";

			col.style.textAlign = "right";
			col.style.display = "inline-block";
			col.style.fontWeight = "500";
			col.style.width = "2.6em";
			col.style.margin = "0.1em";
			col.style.padding = "0.1em";
			return col;
		}
		function createButton() {
			var button = document.createElement("button");
			button.style.height = "28px";
			button.style.cssFloat = "right";
			button.style.background = "#e0e0e0";
			button.style.fontSize = "12px";
			return button;
		}

		var cal = WM.createWindow();
		cal.style.fontSize = "13px";
		cal.style.lineHeight = "17px";
		cal.style.fontFamily = "monospace";
		cal.setSize(275, 220);
		var calendar = document.createElement("div");
		calendar.style.width = "275px";
		calendar.style.height = "220px";
		calendar.style.background = "#cccccc";
		calendar.style.textAlign = "center";
		var month = document.createElement("div");
		month.style.margin = "0.1em";
		month.style.background = "#f0f0f0";
		month.style.fontWeight = "800";
		month.style.textAlign = "center";
		month.style.verticalAlign = "middle";
		month.style.height = "2.3em";
		calendar.appendChild(month);

		var mMonthLabel = document.createElement("span");
		month.appendChild(mMonthLabel);
		mMonthLabel.style.display = "inline-block";
		mMonthLabel.style.width = "80px";
		mMonthLabel.style.marginTop = "0.5em";
		mMonthLabel.style.fontWeight = "800";


		var yearBefore = createButton();
		yearBefore.style.cssFloat = "left";
		yearBefore.textContent = "前年";
		month.appendChild(yearBefore);

		var monthBefore = createButton();
		monthBefore.style.cssFloat = "left";
		monthBefore.textContent = "前月";
		month.appendChild(monthBefore);

		var yearNext = createButton();
		yearNext.style.cssFloat = "right";
		yearNext.textContent = "次年";
		month.appendChild(yearNext);
		var monthNext = createButton();
		monthNext.style.cssFloat = "right";
		monthNext.textContent = "次月";
		month.appendChild(monthNext);

		yearBefore.onclick = function () {
			cal.beforeYear();
		}
		yearNext.onclick = function () {
			cal.nextYear();
		}
		monthBefore.onclick = function () {
			cal.beforeMonth();
		}
		monthNext.onclick = function () {
			cal.nextMonth();
		}

		var header = document.createElement("div");
		header.style.clear = "both";
		for (var i = 0; i < 7; i++) {
			var col = createColumn();
			col.innerHTML = ["日", "月", "火", "水", "木", "金", "土"][i];
			col.style.textAlign = "center";
			col.style.fontWeight = "800";
			col.style.color = "#ffffff";
			col.style.background = i == 0 ? "#aa5555" : i == 6 ? "#5555aa" : "#808080";
			header.appendChild(col);
		}
		calendar.appendChild(header);
		var mCols = [];
		for (var j = 0; j < 6; j++) {
			var week = document.createElement("div");
			for (var i = 0; i < 7; i++) {
				var col = createColumn();
				col.style.cursor = "pointer";
				week.appendChild(col);
				mCols[j * 7 + i] = col;
			}
			calendar.appendChild(week);
		}
		cal.setHtml(calendar);

		var mColSelect = {};
		cal.clearDateColor = function () {
			mColSelect = [];
			this.update();
		}
		cal.setDateColor = function (date, color) {
			mColSelect[strDate(date)] = WM.getARGB(color);
			this.update();
		}
		var mDate;
		cal.getDate = function () {
			return mDate;
		}
		cal.getDateStart = function () {
			var date = new Date(mDate);
			date.setDate(1);
			var dayStart = date.getDay();
			dayStart = dayStart == 0 ? 6 : dayStart - 1;
			return new Date(date.getFullYear(), date.getMonth(), -dayStart);
		}
		cal.getDateEnd = function () {
			var date = new Date(mDate);
			date.setDate(1);
			var dayStart = date.getDay();
			dayStart = dayStart == 0 ? 6 : dayStart - 1;
			return new Date(date.getFullYear(), date.getMonth(), -dayStart + 42);
		}
		cal.changeDate = function (date) {
			var param = { "date": new Date(date) };
			this.call("onChange", param);
			this.setDate(date);
		}
		var mHoliday = [];
		cal.setDate = function (date) {
			mDate = new Date(date);
			function onHoliday(data) {
				if (data) {
					for (var index in data)
						mHoliday[index] = data[index];
					cal.update();
				}
			}
			var dateStart = this.getDateStart();
			var dateEnd = this.getDateEnd();
			AFL.getHoliday(strDate(dateStart), strDate(dateEnd), onHoliday);
			this.update();

			var param = {};
			this.call("onDate", param);

		}
		var mFlagUpdate = false;
		cal.update = function () {
			if (mFlagUpdate)
				return;
			mFlagUpdate = true;
			setTimeout(function () { cal._update(); }, 1);
		}
		cal._update = function () {
			var date = mDate;
			mFlagUpdate = false;
			var m = date.getMonth();
			var dateStart = this.getDateStart();
			var dateEnd = this.getDateEnd();

			var dateNow = strDate(new Date());

			var d = new Date(dateStart);
			mMonthLabel.innerHTML = AFL.sprintf("%d年%d月", date.getFullYear(), m + 1);
			for (var j = 0; j < 6; j++) {
				var week = document.createElement("div");
				for (var i = 0; i < 7; i++) {
					var col = mCols[j * 7 + i];
					col.date = strDate(d);
					col.date2 = new Date(d);
					col.label.textContent = d.getDate();
					col.style.background = i == 0 ? "#ffbbbb" : i == 6 ? "#bbbbff" : "#f0f0f0";
					if (dateNow == col.date)
						col.label.style.textDecoration = "underline";
					else
						col.label.style.textDecoration = "none";
					if (mColSelect[col.date] != null)
						col.label.style.backgroundColor = mColSelect[col.date];
					else
						col.label.style.backgroundColor = 'transparent';
					col.onclick = function () {
						var date = new Date(this.date2);
						if (mDate.getFullYear() != date.getFullYear() || mDate.getMonth() != date.getMonth())
							cal.changeDate(date);
						var params = { "date": date };
						cal.call("onDay", params);
					}
					d.setDate(d.getDate() + 1);
				}
				calendar.appendChild(week);
			}
			if (mHoliday) {
				for (var i = 0; i < 42; i++) {
					if (mHoliday[mCols[i].date] != null)
						mCols[i].style.backgroundColor = "#ffaaaa";
				}
			}
		}
		cal.nextYear = function () {
			this.changeDate(new Date(mDate.getFullYear() + 1, mDate.getMonth(), 1));
		}
		cal.beforeYear = function () {
			this.changeDate(new Date(mDate.getFullYear() - 1, mDate.getMonth(), 1));
		}
		cal.nextMonth = function () {
			this.changeDate(new Date(mDate.getFullYear(), mDate.getMonth() + 1, 1));
		}
		cal.beforeMonth = function () {
			this.changeDate(new Date(mDate.getFullYear(), mDate.getMonth() - 1, 1));
		}
		//var date = new Date();
		//cal.setDate(date);


		return cal;
	}
	WM.createMessageView = function (msg) {
		var win = WM.createFrameWindow();
		win.setSize(200, 100);
		win.setBackgroundColor(0xaaffffff);

		var mMsgParent = document.createElement("div");
		mMsgParent.style.width = win.getClientWidth() + "px";
		mMsgParent.style.height = win.getClientHeight() + "px";
		mMsgParent.style.textAlign = "center";
		mMsgParent.style.marginTop = "2em";
		mMsgParent.style.marginBottom = "2em";
		win.setHtml(mMsgParent);

		var mMsg = document.createElement("span");
		mMsgParent.appendChild(mMsg);
		mMsg.textContent = msg;


		win.setText = function (msg) {
			mMsg.textContent = msg;
		}
		win.setPos();
		win.setTopMost(true);


		return win;
	}
	WM.createSelectView = function () {
		var node = WM.createWindow();
		node.setTopMost(true);
		node.setSize(128, 80);
		node.setScroll(true);
		node.style.borderStyle = 'solid';
		node.style.borderWidth = '1px';
		node.style.backgroundColor = 'white';
		node.style.cursor = 'default';

		node.addEvent("onForeground", function (params) {
			if (!params.foreground)
				node.close();
		});
		node.addItem = function (text, value) {
			var item = document.createElement('DIV');
			item.innerHTML = text;
			item.__value = value;
			this.appendChild(item);
			item.onmouseover = function () {
				this.style.color = 'white';
				this.style.backgroundColor = 'blue';
			}
			item.onmouseout = function () {
				this.style.color = 'black';
				this.style.backgroundColor = 'white';
			}
			item.onclick = function () {
				var params = { value: this.__value };
				node.call("onSelect", params);
				node.close();
			}
		}
		node.setForeground();
		return node;
	}


	var top = WM.createWindow();
	WM.window = top;
	top.style.zIndex = 2000;
	top.style.overflow = "visible";
	top.style.position = "fixed";
	top.style.width = "0px";
	top.style.height = "0px";
	top.setSize(0, 0);

	window.addEventListener('load', function () { document.body.appendChild(top); WM.layout(); }, false);
})();

(function () {
	var COLOR_DRAG = 0xffffff44;
	var doc = document;

	//---------------------------------------
	//ListViewの生成
	//	[引数]   elem  作成に利用するタグ(省略可能)
	//	[戻り値] ListView
	WM.createListView = function (elem) {
		var mOverColor = 0x334444bb;
		var mSelectColor = 0xffaaccff;
		var mSelectColor2 = 0xffddeeff;
		var mItemColor = [0xaaffffaa, 0xaaeeffcc];
		var mRedrawing = false;
		var mRedraw = false;



		var mWidths = [];
		var view = this.createScrollView(elem);
		view.style.userSelect = "none";

		var mClient = document.createElement("div");
		view.getClientNode().appendChild(mClient);

		//サイズ計算用隠し領域
		var mHView = document.createElement("div");
		document.body.appendChild(mHView);
		mHView.style.visibility = "hidden";
		mHView.style.position = "fixed";

		var mHeaderNode = document.createElement("div");
		mHView.appendChild(mHeaderNode);

		var mHeader = mHeaderNode.childNodes;

		var mItemNode = document.createElement("div");
		mHView.appendChild(mItemNode);


		var mDownFlag = false;
		var mDownX = 0;
		var mDownY = 0;
		view.onmouseleave = function (e) {
			mDownFlag = false;
		}
		view.onmousedown = function (e) {
			mDownX = WM.getMouseX();
			mDownY = WM.getMouseY();

			var param = this.screenToClient(mDownX, mDownY);
			if (param.x < this.getClientWidth() && param.y >= this.getHeaderHeight() && param.y < this.getClientHeight())
			{
				mDownFlag = true;
				e.preventDefault();
			}
		}
		view.onmouseup = function () {
			mDownFlag = false;
		}
		view.onmousemove = function (e) {
			if (mDownFlag) {
				var index = view.getSelectIndex();
				if (index > -1) {
					var x = WM.getMouseX() - mDownX;
					var y = WM.getMouseY() - mDownY;
					if (x * x + y * y > 3) {
						mDownFlag = false;
						var w = WM.createWindow();
						var itemDiv = document.createElement("span");
						var node;
						for (var i = 0; node = view.getItem(index, i) ; i++) {
							node = node.cloneNode(true);
							node.style.marginRight = "5px";
							itemDiv.appendChild(node);
						}
						w.setHtml(itemDiv);
						w.setPos(WM.getMouseX() - itemDiv.offsetWidth / 2, WM.getMouseY() + 4);
						w.setSize(itemDiv.offsetWidth, itemDiv.offsetHeight + 10);

						w.style.backgroundColor = WM.getARGB(COLOR_DRAG);
						w.setTopMost(true);
						w.setAlpha(30);
						w.addEvent("onMoved", function () { this.close(); view.call("onItemDrop", index); });

						WM.setMoveWindow(w);
						e.preventDefault();
					}

				}
			}
		}



		var mOverHeaderIndex = -1;
		var mOverItemIndex = -1;
		var mOverSubItemIndex = -1;
		function onMouseMove(e) {
			var index = this.getItemIndex(e.y);
			mOverSubItemIndex = this.getSubItemIndex(e.x);
			if (index == -2) {
				mOverItemIndex = -1;
				mOverHeaderIndex = mOverSubItemIndex;
			}
			else {
				mOverHeaderIndex = -1;
				if (mOverItemIndex != index) {
					mOverItemIndex = index;
				}
			}
			this.redraw();
		}
		view.addEvent("onMouseMove", onMouseMove);

		function onTarget(flag) {
			this.redraw();
		}
		view.addEvent("onTarget", onTarget);

		view.getHoverIndex = function () {
			return mOverItemIndex;
		}

		var mSelectIndex = [];
		var mLastIndex = 0;
		var mSortFlag = [];
		view.getSelectIndex = function () {
			if (mSelectIndex.length == 0)
				return -1;
			else
				return mSelectIndex[0];
		}
		view.getSelectIndexes = function () {
			return mSelectIndex;
		}
		function onMouseClick(e) {
			var index = this.getItemIndex(e.y);
			var subIndex = this.getSubItemIndex(e.x);
			if (index == -2) {
				this._sort(subIndex);
				return;
			}
			if (index < 0)
				return;

			if (WM.isCtrl()) {
				var point = mSelectIndex.indexOf(index);
				if (point == -1) {
					mLastIndex = index;
					mSelectIndex.push(index);
				}
				else {
					index = -1;
					mSelectIndex.splice(point, 1);
				}
			}
			else if (WM.isShift()) {
				var start;
				var end;
				if (index > mLastIndex) {
					start = mLastIndex;
					end = index;
				}
				else {
					start = index;
					end = mLastIndex;
				}

				for (var i = start; i <= end; i++) {
					var point = mSelectIndex.indexOf(i);
					if (point == -1) {
						mSelectIndex.push(i);
					}
				}
			}
			else {
				mSelectIndex = [index];
				mLastIndex = index;
			}
			this.redraw();

			var param = {};
			param.index = index;
			param.next = true;
			view.call("onItemClick", param);
		}

		view.addEvent("onMouseClick", onMouseClick);
		view.addEvent("onMouseDblClick", onMouseDblClick);
		function onMouseDblClick(e) {
			e.itemIndex = this.getItemIndex(e.y);
			e.itemSubIndex = this.getSubItemIndex(e.x);
			if (e.itemIndex >= 0)
				view.call("onItemDblClick", e);
		}

		view.getSubItemIndex = function (x) {
			for (var index = 0; index < mHeader.length; index++) {
				var node = mNodes[index];
				if (node && node.offsetLeft + node.offsetWidth > x)
					return index;
			}
			return -1;
		}
		view.getItemIndex = function (y) {
			for (var index = 0; index < mNodes.length; index++) {
				var node = mNodes[index];

				if (node.offsetTop + node.offsetHeight > y)
					return node.itemIndex;
			}
			return -1;
		}
		var mNodes = [];
		var mItemPadding = 3;
		function createSel(index) {
			if (mNodes[index]) {
				return mNodes[index];
			}
			var node = document.createElement("div");

			node.style.backgroundColor = "#aaaaaa";
			node.style.boxSizing = "border-box";
			node.style.MozBoxSizing = "border-box";
			node.style.position = "absolute";
			node.style.overflow = "hidden";
			node.style.whiteSpace = "nowrap";
			node.style.padding = mItemPadding + "px";
			node.style.margin = 0;
			node.setSize = function (width, height) {
				node.style.width = width + "px";
				node.style.height = height + "px";
				node2.style.width = width - mItemPadding * 2 + "px";
				node2.style.height = height - mItemPadding * 2 + "px";

			}
			node2 = document.createElement("div");
			node2.style.display = "table-cell";
			node2.style.verticalAlign = "middle";
			node2.style.overflow = "hidden";
			node.appendChild(node2);
			node.setPos = function (x, y) {
				node.style.left = x + "px";
				node.style.top = y + "px";

			}
			node.addChild = function (n) {
				node2.innerHTML = "";
				node2.appendChild(n);
			}
			mNodes.push(node);
			return node;
		}

		view.redraw = function () {
			if (!mRedraw)
			{
				mRedraw = true;
				window.setTimeout(function () { view._redraw(); }, 1);
			}
		}

		view._redraw = function () {
			if (!mRedraw || mRedrawing)
				return;
			if (!this.isVisible())
				return;
			mRedrawing = true;

			var x = this.getScrollX();
			var y = this.getScrollY();

			var splitX = 0;
			for (var i = 0; mWidths[i]; i++) {
				splitX += mWidths[i] + 1;
				var split = mHeaderNode.childNodes[i].split;
				split.__setPos(splitX - split.getWidth() / 2 + 1 - x, 0);
			}

			var parent = document.createElement("div");
			var headerHeight = this.getHeaderHeight() + mItemPadding * 2;
			var clientWidth = this.getClientWidth();
			var clientHeight = this.getClientHeight();
			var posX = 0;
			var posY = 0;
			mNodes = [];
			var nodeIndex = 0;
			for (var i = 0; i < mHeader.length; i++) {
				var item = mHeader[i];
				var node = createSel(nodeIndex++);
				node.itemIndex = -2;
				node.style.zIndex = 1;
				node.style.borderStyle = 'solid';
				node.style.borderWidth = '1px';
				node.style.borderColor = "#AAAAAA black black #AAAAAA";

				var color = 0xffaaaaaa;
				if (mOverHeaderIndex == i) {
					color = WM.blend(color, mOverColor);
				}
				node.style.backgroundColor = WM.getARGB(color);


				node.addChild(item.cloneNode(true));
				parent.appendChild(node);
				var width = mWidths[i];
				node.setPos(posX - x, 0);
				node.setSize(width, headerHeight);
				posX += width + 1;

			}

			posY += headerHeight + 1;
			for (var index = 0 ; index < mItemNode.childNodes.length; index++) {
				var itemLineNode = mItemNode.childNodes[index];
				var itemLine = itemLineNode.childNodes;
				var lineHeight = this.getLineHeight(index) + mItemPadding * 2;
				if (posY < y - lineHeight) {
					posY += lineHeight + 1;
					continue;
				}
				if (posY - y >= clientHeight)
					break;
				posX = 0;
				for (var i = 0; i < mHeader.length; i++) {
					var item = itemLine[i];
					if (!item)
						continue;
					var node = createSel(nodeIndex++);
					node.itemIndex = index;
					var color = mItemColor[index % 2];
					if (itemLineNode._color)
						color = itemLineNode._color;

					if (item._color)
						color = item._color;

					if (mSelectIndex.indexOf(index) != -1) {
						color = this.isTarget() ? mSelectColor : mSelectColor2;
					}


					if (mOverItemIndex == index) {
						color = WM.blend(color, mOverColor);
					}

					node.style.backgroundColor = WM.getARGB(color);
					if (item)
						node.addChild(item.cloneNode(true));
					parent.appendChild(node);

					node.setPos(posX - x, posY - y);
					node.setSize(mWidths[i], lineHeight);

					posX += mWidths[i] + 1;
				}
				posY += lineHeight + 1;

			}
			if (mNodes.length > nodeIndex)
				mNodes.splice(nodeIndex, mNodes.length - nodeIndex);

			view.getClientNode().removeChild(mClient);
			view.getClientNode().appendChild(parent);
			mClient = parent;

			this.setScrollSize(this.getHeaderWidths(), this.getItemHeight() + headerHeight + 1);

			mRedrawing = false;
			mRedraw = false;

		}
		function onSized(e) {
			this.redraw();

		}
		view.addEvent("onSized", onSized);
		view.onScroll = function (x, y) {
			this.redraw();
		}
		//---------------------------------------
		//ヘッダの追加
		//	[引数]   value  ヘッダ文字列
		//	[戻り値] インデックス番号
		view.addHeader = function (value) {
			var node = createNode(value);
			node.style.cursor = "pointer";
			mHeaderNode.appendChild(node);

			node.onclick = function () {
				this._sort(index);
			}


			var index = mHeaderNode.childNodes.length - 1;

			var split = createSplit();
			split.index = index;
			node.split = split;

			var width = node.offsetWidth + mItemPadding * 2;
			this.setHeaderWidth(index, width);
			return index;
		}

		//---------------------------------------
		//幅の自動設定
		//	[引数]   無し
		//	[戻り値] 無し
		view.autoWidth = function () {
			function call() {
				var width = view.getClientWidth() - 2;
				var widthAll = 0;
				var widths = [];
				var nodes = mHeaderNode.childNodes;
				for (var index = 0; nodes[index]; index++) {
					widths[index] = view.getContentWidth(index) + mItemPadding * 2;
					widthAll += widths[index];
				}
				var r = width / widthAll;
				for (var index = 0; nodes[index]; index++) {
					view.setHeaderWidth(index, parseInt(widths[index] * r));

				}
				view.redraw();
			}
			setTimeout(call, 0);
		}
		view.getContentWidth = function (index) {
			var width = 0;
			var node = mHeaderNode.childNodes[index];
			width = node.offsetWidth;

			for (var i = 0; i < mItemNode.childNodes.length; i++) {
				var items = mItemNode.childNodes[i];
				var node = items.childNodes[index];
				if (node != null) {
					var w = items.childNodes[index].offsetWidth;
					width = width > w ? width : w;
				}
			}
			return width;
		}
		view._sort = function (index) {
			if (index < 0)
				return;
			view.sort(index, !mSortFlag[index]);
		}
		var mSortFunc = [];
		var mSortIndex = 0;
		view.setSortFunc = function (index, func) {
			mSortFunc[index] = func;
		}
		view.isSortFlag = function (index) {
			return mSortFlag[index];
		}
		view.sort = function (index, flag) {
			if (index == null) {
				index = mSortIndex;
				flag = mSortFlag[index];
			}

			function sort(a, b) {
				var valueA = view.getItemText(a, index);
				var valueB = view.getItemText(b, index);
				if (valueA < valueB)
					return -1 * sortFlag;
				if (valueA == valueB)
					return 0;
				return sortFlag;
			}
			mSortIndex = index;
			mSortFlag[index] = flag;
			var sortFlag = flag ? 1 : -1;

			var list = [];
			var listNode = [];
			for (var i = 0; i < mItemNode.childNodes.length; i++) {
				list.push(i);
				listNode.push(mItemNode.childNodes[i]);
			}
			if (mSortFunc[index])
				list.sort(mSortFunc[index]);
			else
				list.sort(sort);

			var nodes = document.createElement("div");
			for (var i = 0; i < list.length; i++) {
				nodes.appendChild(listNode[list[i]]);
			}


			mHView.appendChild(nodes);
			mHView.removeChild(mItemNode);
			mItemNode = nodes;

			this.redraw();
		}

		function createNode(value) {
			if (typeof (value) == "object")
				return value;
			var node = document.createElement("span");
			node.style.whiteSpace = "pre";
			if (node.innerText)
				node.innerText = value;
			else
				node.textContent = value;
			return node;
		}
		//---------------------------------------
		//アイテムの追加
		//	[引数]   value  アイテム文字列/タグ
		//	[戻り値] アイテム番号
		view.addItem = function (value) {
			var item = document.createElement("div");
			item.value = -1;
			item.style.top = "0px";
			item.style.left = "0px";
			item.appendChild(createNode(value));


			//空データの追加
			var count = this.getHeaderCount();
			while (item.childNodes.length <= count)
				item.appendChild(createNode(""));

			mItemNode.appendChild(item);

			this.redraw();
			return mItemNode.childNodes.length - 1;
		}
		//---------------------------------------
		//アイテムのクリア
		//	[引数]   無し
		//	[戻り値] 無し
		view.clear = function () {
			mSelectIndex = [];
			mOverItemIndex = -1;
			while (mItemNode.childNodes.length)
				mItemNode.removeChild(mItemNode.childNodes[0]);
			this.redraw();
		}
		//---------------------------------------
		//アイテムの設定
		//[引数]
		//index1 列番号
		//index2 行番号
		//value  表示内容(テキスト/エレメント)
		//[戻り値] 無し
		view.setItem = function (index1, index2, value) {
			var item = mItemNode.childNodes[index1];
			//空データの追加
			while (item.childNodes.length <= index2)
				item.appendChild(createNode(""));
			item.replaceChild(createNode(value), item.childNodes[index2]);
			this.redraw();
		}
		view.getItem = function (index1, index2) {
			var item = mItemNode.childNodes[index1];
			if (item) {
				var node = item.childNodes[index2];
				if (node) {
					return node;
				}
			}
			return null;
		}
		view.getItemText = function (index1, index2) {
			var item = mItemNode.childNodes[index1];
			if (item) {
				var node = item.childNodes[index2];
				if (node) {
					if (node.innerText)
						return node.innerText;
					else
						return node.textContent;
				}
			}
			return null;
		}
		view.setItemValue = function () {
			var index1 = arguments[0];
			var index2 = 0;
			var value;
			if (arguments.length > 2) {
				index2 = arguments[1];
				value = arguments[2];
			}
			else
				value = arguments[1];

			var item = mItemNode.childNodes[index1];
			//空データの追加
			while (item.childNodes.length <= index2)
				item.appendChild(createNode(""));
			item.childNodes[index2].value = value;
		}
		view.getItemValue = function () {
			var index1 = arguments[0];
			var index2 = 0;
			if (arguments.length > 1) {
				index2 = arguments[1];
			}

			var item = mItemNode.childNodes[index1];
			if (item) {
				var node = item.childNodes[index2];
				if (node)
					return node.value;
			}
			return null;
		}
		view.setLineColor = function (index1, value) {
			var item = mItemNode.childNodes[index1];
			item._color = value;
		}

		view.setItemColor = function (index1, index2, value) {
			var item = mItemNode.childNodes[index1];
			item.childNodes[index2]._color = value;
		}
		view.setHeaderWidth = function (index, width) {
			mWidths[index] = width;
			this.redraw();
		}
		view.getHeaderWidths = function () {
			var x = 0;
			for (var i = 0; mWidths[i]; i++) {
				x += mWidths[i] + 1;
			}
			return x - (i ? 1 : 0);
		}
		view.getHeaderHeight = function () {
			var size = 0
			for (var index in mHeader) {
				var value = mHeader[index];
				if (value.offsetHeight) {
					size = value.offsetHeight > size ? value.offsetHeight : size;
				}
			}
			return size;
		}
		view.getItemHeight = function () {
			var height = 0;
			for (var index = 0; index < mItemNode.childNodes.length; index++) {
				height += this.getLineHeight(index) + 1;
			}
			height += index * mItemPadding * 2;
			return height;
		}
		view.getLineHeight = function (index) {
			var items = mItemNode.childNodes[index];
			var height = 0;
			for (var i = 0; items.childNodes[i]; i++) {
				height = height > items.childNodes[i].offsetHeight ? height : items.childNodes[i].offsetHeight;
			}
			return height;
		}
		view.getItemCount = function () {
			return mItemNode.length;
		}
		view.getHeaderCount = function () {
			return mHeader.length;
		}
		function createSplit() {
			var fl = WM.createWindow();
			fl.style.zIndex = 100;
			fl.setTopMost(true);
			fl.setMoveFlag(true);
			fl.setSize(10, 32);
			fl.style.backgroundColor = "";
			fl.style.cursor = "w-resize";
			var mSetPos = fl.setPos;
			fl.__setPos = fl.setPos;
			fl.setPos = function (x, y) {
				this._callback = mSetPos;
				this._callback(x, 0);

				var posX = 0;
				var index = this.index;
				for (var i = 0; i < index; i++)
					posX += mWidths[i] + 1;
				width = x - posX + fl.getWidth() / 2 + view.getScrollX();
				view.setHeaderWidth(index, width);
			}

			view.addChild(fl);
			return fl;
		}


		view.redraw();
		return view;
	}
})();

(function () {
	var doc = document;
	eval('var document = doc');

	var COLOR_SELECT = 0xffaaccff;
	var COLOR_SELECT2 = 0xffddeeff;
	var COLOR_DRAG = 0xffffff44;

	//---------------------------------------
	//ツリービューの作成
	//[引数]
	//[戻り値] ツリービュー
	WM.createTreeView = function () {
		function createNode(value) {
			if (typeof (value) == "object")
				return value;
			var node = document.createElement("span");
			node.style.whiteSpace = "pre";
			if (node.innerText)
				node.innerText = value;
			else
				node.textContent = value;
			return node;
		}

		function createItem(text, parent) {
			var mItemBackColor = 0xffffffff;
			var mBoxAutoFlag = true;
			var mExpand = false;
			var item = document.createElement('div');
			var mItemTitle = document.createElement('div');
			var mItemParent = parent;
			item.appendChild(mItemTitle);
			mItemTitle.style.whiteSpace = "nowrap";
			mItemTitle.style.boxSizing = "border-box";
			var backColor = '';
			var textColor = 'black';

			mItemTitle.onmouseover = function () {
				mHoverItem = item;
				this.style.borderStyle = 'solid';
				this.style.borderWidth = '0px 0px 1px 0px';
			}
			mItemTitle.onmouseout = function () {
				if (mHoverItem == item)
					mHoverItem = null;
				this.style.borderStyle = 'none';

			}



			var mBox = document.createElement('span');
			mItemTitle.appendChild(mBox);
			mBox.style.cursor = "pointer";
			mBox.style.marginLeft = "2px";
			mBox.style.marginRight = "2px";
			mBox.style.position = "relative";
			mBox.style.width = "16px";
			mBox.style.fontFamily = "monospace";
			mBox.innerHTML = "･";

			var mText = text;
			var mLabel = createNode(text);
			mItemTitle.appendChild(mLabel);
			mLabel.style.cursor = 'default';

			var mDownFlag = false;
			var mDownX = 0;
			var mDownY = 0;
			mLabel.onmouseleave = function (e) {
				mDownFlag = false;
			}
			mLabel.onmousedown = function (e) {
				mDownX = WM.getMouseX();
				mDownY = WM.getMouseY();
				mDownFlag = true;
				e.preventDefault();
			}
			mLabel.onmouseup = function () {
				mDownFlag = false;
			}
			mLabel.onmousemove = function (e) {
				if (mDownFlag) {
					var x = WM.getMouseX() - mDownX;
					var y = WM.getMouseY() - mDownY;
					if (x * x + y * y > 3) {
						mDownFlag = false;
						var w = WM.createWindow();
						var width = this.offsetWidth;
						var height = this.offsetHeight;
						w.setSize(width, height);
						w.setPos(WM.getMouseX() - width / 2, WM.getMouseY() + 4);
						w.innerHTML = this.innerHTML;
						w.style.backgroundColor = WM.getARGB(COLOR_DRAG);
						w.setTopMost(true);
						w.setAlpha(50);
						w.addEvent("onMoved", function () { this.close(); view.call("onItemDrop", item); });

						WM.setMoveWindow(w);
						e.preventDefault();
					}
				}
			}

			var mChild = document.createElement('div');
			item.appendChild(mChild);
			mChild.style.marginLeft = "10px";

			item.getParent = function () {
				return mItemParent;
			}
			//---------------------------------------
			//アイテムの設定
			//[引数]
			//value  アイテム内容
			//opened ツリー開閉 true:開く false:閉じる
			//[戻り値] アイテムインスタンス
			item.addItem = function (value, opened) {
				var item2 = createItem(value, this);
				mChild.appendChild(item2);
				item2.expand(opened);
				this.expand();
				return item2;
			}
			item.setTextColor = function (value) {
				mItemTitle.style.color = WM.getARGB(value);
			}
			item.setLineThrough = function (flag) {
				if (flag)
					mItemTitle.style.textDecoration = "line-through";
				else
					mItemTitle.style.textDecoration = "";
			}
			item.findItem = function (value) {
				if (mValue == value)
					return this;
				for (var i = 0; mChild.childNodes[i]; i++) {
					var it = mChild.childNodes[i].findItem(value);
					if (it)
						return it;
				}
				return null;
			}
			item.getItemText = function () {
				return mText;
			}
			var mValue = 0;
			item.getItemValue = function () {
				return mValue;
			}
			item.setItemValue = function (value) {
				mValue = value;
			}
			item.expand = function (flag) {
				if (flag != null)
					mExpand = flag;
				if (mChild.childNodes.length == 0) {
					mBox.innerHTML = "･";
					return;
				}
				if (mExpand) {
					mBox.innerHTML = "-";
					mChild.style.display = "block";
				}
				else {
					mBox.innerHTML = "+";
					mChild.style.display = "none";

				}
			}
			item.getStatus = function (status) {
				if (mExpand)
					status[this.getItemValue()] = true;
				for (var index = 0; mChild.childNodes[index]; index++) {
					var item = mChild.childNodes[index];
					item.getStatus(status);
				}
			}
			item.setStatus = function (status) {
				var flag = status[this.getItemValue()];
				this.expand(flag);
				for (var index = 0; mChild.childNodes[index]; index++) {
					var item = mChild.childNodes[index];
					item.setStatus(status);
				}
			}
			mBox.onclick = function (e) {
				if (window.event)
					e = window.event;
				item.expand(!mExpand);
				e.cancelBubble = true;
				return false;
			}
			mItemTitle.onclick = function () {
				view.selectItem(item);
			}
			mItemTitle.ondblclick = function () {
				view.call("onItemDblClick", item);
			}
			item.setBackColor = function (color) {
				mItemTitle.style.background = WM.getARGB(color);
			}
			return item;
		}
		var mHoverItem = null;
		var mSelectItem = null;
		var view = WM.createWindow();
		var mChilds = [];
		view.style.overflow = "auto";
		view.onSelectItem = null;
		view.getHoverItem = function () {
			return mHoverItem;
		}
		view.saveExpand = function () {
			var expand = {};
			for (var index in mChilds) {
				var item = mChilds[index];
				item.getStatus(expand);
			}
			return expand;
		}
		view.loadExpand = function (expand) {
			for (var index in mChilds) {
				var item = mChilds[index];
				item.setStatus(expand);
			}
		}
		//---------------------------------------
		//アイテムの設定
		//[引数]
		//value  アイテム内容
		//opened ツリー開閉 true:開く false:閉じる
		//[戻り値] アイテムインスタンス
		view.addItem = function (text, opened) {
			var item = createItem(text);
			mChilds.push(item);
			view.appendChild(item);
			item.expand(opened);
			return item;
		}
		view.getRootItem = function () {
			return mChilds[0];
		}
		view.findItem = function (value) {
			if (mChilds[0])
				return mChilds[0].findItem(value);
			return null;
		}
		view.getSelectItem = function () {
			return mSelectItem;
		}
		view.getSelectValue = function () {
			if (!mSelectItem)
				return null;
			return mSelectItem.getItemValue();
		}
		view.selectItem = function (item) {

			var parent = item;
			do {
				parent.expand(true);
			} while (parent = parent.getParent())

			if (mSelectItem) {
				mSelectItem.setBackColor(0);
			}
			item.setBackColor(view.isTarget() ? COLOR_SELECT : COLOR_SELECT2);

			mSelectItem = item;

			if (this.onSelectItem)
				this.onSelectItem(item);

			this.call("onItemSelect", item);
		}
		view.clear = function () {
			mChilds = [];
			while (this.childNodes.length)
				this.removeChild(this.childNodes[0]);
		}

		function onTarget(flag) {
			var item = this.getSelectItem();
			if (item) item.setBackColor(view.isTarget() ? COLOR_SELECT : COLOR_SELECT2);
		}
		view.addEvent("onTarget", onTarget);

		return view;
	}
})();



