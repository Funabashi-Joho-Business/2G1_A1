// フィールドが変更された場合に処理する関数
function fieldChanged() {
	var userId = getField("user_id");
	var password = getField("password");
	var disabled = true;

	if (userId.value.length > 0 && password.value.length > 0) {
		disabled = false;

	}

	// // ログインボタンの有効化,無効化
	var login = getField("login");
	// if (disabled) {
	// login.setAttribute("disabled", "disabled");// 無効化
	// } else {
	// login.removeAttribute("disabled");// 有効化
	// }

	login.addEventListener("click", onClick);

	function onClick() {
		var logindata = {
			"A" : userId.value,
			"B" : password.value
		};
		AFL.sendJson("Login", logindata, onJson);
	}
}

function onJson(data) {
	document.location = "index05.html";
}

// フィールドを取得する関数
function getField(fieldName) {
	var field = document.getElementById(fieldName);
	if (field == undefined) {
		throw new Error("要素が見つかりません: " + fieldName);
	}
	return field;
}
