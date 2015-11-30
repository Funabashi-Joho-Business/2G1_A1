var textIndex = 0;
var dayCount = 0;
var textIndex = 0;
var month;
var year;
var textCount = 0;

// 受信処理
function onLoad(datas) {
	var tIndex;
	var output;
	for ( var index in datas) {
		if (datas[index].flag == "0") {
			tIndex = "#b" + datas[index].index;
			output = document.querySelector(tIndex);
			output.innerHTML += datas[index].value+'\n';
		} else {
			tIndex = "#a" + datas[index].index;
			output = document.querySelector(tIndex);
			output.value = datas[index].value;

		}

	}
}

// スケジュール送信処理
function save(textarea) {
	var Jsondata = {};
	Jsondata.id = textarea.id;
	Jsondata.value = textarea.value;
	Jsondata.cmd = "write";
	if(Jsondata.value!=""){
		AFL.sendJson("Calendar", Jsondata, function(){});
	}

}

// カレンダー作成処理
function carenda(num) {
	var now = new Date();
	var dValue = document.getElementById("dValue");
	var date;
	switch (parseInt(num)) {

	// デフォルト
	case 0:
		textIndex = 0;
		year = now.getFullYear();
		month = now.getMonth() + 1;
		date = now.getDate();
		dayCount = 0;
		// 受信要求
		var sendData = {
			"cmd" : "read",
			"c_index" : year + "-" + month + "-"
		};
		AFL.sendJson("Calendar", sendData, onLoad);
		break;

	// 月-1
	case 1:
		textIndex = 0;
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
		var sendData = {
			"cmd" : "read",
			"c_index" : year + "-" + month + "-"
		};
		AFL.sendJson("Calendar", sendData, onLoad);
		dayCount = 0;
		break;

	// 月+1
	case 2:
		textIndex = 0;
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
		var sendData = {
			"cmd" : "read",
			"c_index" : year + "-" + month + "-"
		};
		AFL.sendJson("Calendar", sendData, onLoad);
		dayCount = 0;
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
		editMsg += defTD(" ", "white");
		textCount++;
	}

	for (i = 1; i <= last_date[month - 1]; i++) {
		if (i != 1 && dayIndex == 0) {
			editMsg += "<TR id = 'day'> ";

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
			editMsg += "</TR>\n ";
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

	if (dayCount < 7 || str == " ") {
		dayCount++;
		return "<TD  display = 'block' ><B><FONT size='2' color='" + iro + "'>"
				+ str + "</FONT></B></TD>";
	} else {
		textIndex++;
		return "<TD display = 'block'>"
				+ "<B><FONT size='2' color='"
				+ iro
				+ "'>"
				+ str
				+ "  <span id='b"
				+ year
				+ "-"
				+ ("0" + month).slice(-2)
				+ "-"
				+ ("0" + textIndex).slice(-2)
				+ "'"
				+ "</span>"
				+ "</FONT></B><div id ='textarea'>"
				+ "<textarea  onblur='save(this)' id='a"
				+ year
				+ "-"
				+ ("0" + month).slice(-2)
				+ "-"
				+ ("0" + textIndex).slice(-2)
				+ "'"
				+ "rows='3' cols='13'onMouseover=this.style.backgroundColor='#fff7cc' onMouseout=this.style.backgroundColor='white'>"
				+ "</textarea></div></TD>";
	}

}