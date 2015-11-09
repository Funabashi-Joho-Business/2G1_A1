//ページ読み込みイベントに登録
document.addEventListener("DOMContentLoaded", MainJS, false);

function MainJS()
{
	var j = document.querySelector("div#j");
	j.innerHTML = "<br>１限\n<span id=\"one\">システム開発！</span><br><br>２限\n<span id=\"two\">オフィス応用</span><br><br>３限\n<span id=\"three\">Linux</span><br>";


	//入力テキストエリアのインスタンスを取得
	var one = document.querySelector("#one");
	var two = document.querySelector("#two");
	var thr = document.querySelector("#three");
	one.addEventListener("click", onClick);

	//クリックイベント処理中かどうか判断するためのフラグ
	var flag = false;
	//クリックイベントの処理
	function onClick()
	{
		//多重処理していないか判定
		if(flag)
			return;
		flag = true;
		//元のデータを保存
		var text = one.innerHTML;
		//タグや改行をテキストに変換
		var rep = {
				"&nbsp;":" ",
				"&lt;":"<",
				"&gt;":">",
				"&amp;":"&",
				"<br>":"\n"};
		text = AFL.replaceText(text,rep);



		//内部をTextAreaに置き換え
		one.innerHTML = "<textarea>"+text+"</textarea>";
		//TextAreaのインスタンスを取得
		var textArea = one.querySelector("textarea");
		//TextAreaの初期値に元のテキストを設定
		textArea.value = text;
		//フォーカスを与える
		textArea.focus();
		//フォーカスを失った場合のイベント
		textArea.addEventListener("blur", onBlur);
		function onBlur()
		{
			var value = textArea.value;
			//タグや改行をHTMLに変換
			var rep = {
					" ":"&nbsp;",
					"&":"&amp;",
					"<":"&lt;",
					">":"&gt;",
					"\r\n":"<BR>",
					"\n":"<BR>"};
			value = AFL.replaceText(value,rep);
			//元に戻す
			one.innerHTML = value;
			flag = false;
		}
	}

}