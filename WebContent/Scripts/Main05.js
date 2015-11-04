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
	document.title = "サンプル05";
	// IDがoutputのインスタンスを抽出
	var output = document.querySelector("div#output");

	readFile("index.html", Func);

	function Func(req) {
		output.innerHTML = req.responseText;
	}

	output = document.querySelector("div#main");
	output.innerHTML = carenda

}
