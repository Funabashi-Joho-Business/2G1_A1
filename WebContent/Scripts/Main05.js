//ページ読み込みイベントに登録
//document.addEventListener("DOMContentLoaded",onJson(data), false);

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



	function Func(req) {
		output.innerHTML = req.responseText;
	}

	//AFL.sendJson("Test01", {}, onJson);
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



