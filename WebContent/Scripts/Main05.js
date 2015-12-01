//ページ読み込みイベントに登録
document.addEventListener("DOMContentLoaded", Main, false);

// ファイル読み込み機能(url:アドレス proc:データ読み込み時のコールバックファンクション)
function readFile(url, proc) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4) {
			proc(xmlHttp);
		}
	}
	xmlHttp.open('POST', url, true);
	xmlHttp.send();
}
function Main() {
	var output = document.querySelector("div#main");

	readFile("index.html", Func);

	function Func(req) {
		output.innerHTML = req.responseText;
	}
	output.innerHTML = carenda;

	AFL.sendJson("Test01", {}, onJson);
	function onJson(data) {
		var jikanwari = document.querySelector("div#j");
		jikanwari.innerHTML = data.Name;
		var yotei = document.querySelector("div#sc");
		yotei.innerHTML = data.Value;

		// テキストエリア変換

		for (a = 1; a < 4; a++) {
			var input = jikanwari.querySelector("span#ID" + a);
			input.num = a;
			Text(input);
		}

		function Text(input) {
			input.addEventListener("click", onClick);
			// クリックイベント処理中かどうか判断するためのフラグ
			var flag = false;
			// クリックイベントの処理
			function onClick() {
				// 多重処理していないか判定
				if (flag)
					return;
				flag = true;
				// 元のデータを保存
				var text = input.innerHTML;
				// タグや改行をテキストに変換
				var rep = {
					"&nbsp;" : " ",
					"&lt;" : "<",
					"&gt;" : ">",
					"&amp;" : "&",
					"<br>" : "\n"
				};
				text = AFL.replaceText(text, rep);

				// 内部をTextAreaに置き換え
				input.innerHTML = "<input>";
				input.value = text;
				// TextAreaのインスタンスを取得
				var textArea = input.querySelector("input");
				var num = input.num;
				// TextAreaの初期値に元のテキストを設定
				textArea.value = text;
				// フォーカスを与える
				textArea.focus();
				// フォーカスを失った場合のイベント
				textArea.addEventListener("blur", onBlur);
				function onBlur() {
					var value = textArea.value;
					var data2 = {}
					data2.value = value;
					data2.a = num;
					AFL.sendJson("Test01", data2, function() {
					});

					// タグや改行をHTMLに変換
					var rep = {
						" " : "&nbsp;",
						"&" : "&amp;",
						"<" : "&lt;",
						">" : "&gt;",
						"\r\n" : "<BR>",
						"\n" : "<BR>"
					};
					value = AFL.replaceText(value, rep);
					// 元に戻す
					input.innerHTML = value;
					flag = false;

				}
			}
		}
	}

}

function carenda(num) {
	var now = new Date();
	var year;
	var month;
	var date;
	var dValue = document.getElementById("dValue");

	switch (parseInt(num)) {
	case 0:// 今月
		year = now.getFullYear();
		month = now.getMonth() + 1;
		date = now.getDate();
		break;
	case 1:// 一か月戻る
		var backMDate = new Date(parseInt(dValue.innerHTML) - 24 * 60 * 60
				* 1000 * 1);
		if (backMDate.getMonth() == now.getMonth()
				&& backMDate.getFullYear() == now.getFullYear()) {
			year = now.getFullYear();
			month = now.getMonth() + 1;
			date = now.getDate();
		} else {
			year = backMDate.getFullYear();
			month = backMDate.getMonth() + 1;
			date = -1;
		}
		break;
	case 2:// 進む
		var nextMDate = new Date(parseInt(dValue.innerHTML) + 24 * 60 * 60
				* 1000 * 31);
		if (nextMDate.getMonth() == now.getMonth()
				&& nextMDate.getFullYear() == now.getFullYear()) {
			year = now.getFullYear();
			month = now.getMonth() + 1;
			date = now.getDate();
		} else {
			year = nextMDate.getFullYear();
			month = nextMDate.getMonth() + 1;
			date = -1;
		}
		break;
	}

	dValue.innerHTML = (new Date(year, month - 1, 1)).getTime();

	var last_date = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	var editMsg;
	if (month == 2) {
		if (year % 4 == 0) {
			if ((year % 100 == 0) && (year % 400 != 0)) {
			} else {
				last_date[1] = 29;
			}
		}
	}
	editMsg = "";
	editMsg += "<TABLE cellspacing=3><TR><TD colspan='7' align='center'><B><U><FONT size='2'>"
			+ year + "年" + month + "月</FONT></B></U></TD></TR>\n";
	editMsg += "<TR id = 'week'>" + defTD("日", "red") + defTD("月", "black")
			+ defTD("火", "black") + defTD("水", "black") + defTD("木", "black")
			+ defTD("金", "black") + defTD("土", "blue") + "</TR>\n";
	editMsg += "<TR id = 'day'>";

	for (dayIndex = 0; dayIndex < (new Date(year, month - 1, 1)).getDay(); dayIndex++) {
		editMsg += defTD("&nbsp;", "white");
	}

	for (i = 1; i <= last_date[month - 1]; i++) {
		if (i != 1 && dayIndex == 0) {
			editMsg += "<TR id = 'day'>";
		}
		if (i == date) {
			editMsg += defTD(i, "orange");
		} else {
			switch (dayIndex) {
			case 0:
				editMsg += defTD(i, "red");
				break;
			case 6:
				editMsg += defTD(i, "blue");
				break;
			default:
				editMsg += defTD(i, "black");
				break;
			}
		}
		if (dayIndex == 6) {
			editMsg += "</TR>\n";
		}
		dayIndex++;
		dayIndex %= 7;
	}
	if (dayIndex != 7) {
		editMsg += "</TR>\n";
	}
	editMsg += "</TABLE>\n";
	document.getElementById("carenda").innerHTML = editMsg;
}
function defTD(str, iro) {
	return "<TD  display = 'block' ><B><FONT size='2' color='" + iro + "'>"
			+ str + "</FONT></B></TD>";
}

var logout = document.querySelector("div#logout");
logout.addEventListener("click", onClick);

function onClick() {


	document.location = "index05.html";

}
