import static java.util.Calendar.*;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URL;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Scanner;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.arnx.jsonic.JSON;


class AjaxData
{
	public String A;
}

/**
 * Servlet implementation class Test01
 */
@WebServlet("/Test01")
public class Test01 extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Oracle mOracle;

	// タグの無効化
	public static String CONVERT(String str) {
		return str.replaceAll("&", "&amp;").replaceAll(">", "&gt;")
				.replaceAll("<", "&lt;").replaceAll("\n", "<br>");
	}

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public Test01() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Override
	public void init() throws ServletException {
		// TODO 自動生成されたメソッド・スタブ
		super.init();

		try {
			ServletContext context = getServletConfig().getServletContext();
			URL resource = context.getResource("/WEB-INF/db.txt");
			InputStream stream = resource.openStream();
			Scanner sc = new Scanner(stream);
			String id = sc.next();
			String pass = sc.next();
			sc.close();
			stream.close();

			mOracle = new Oracle();
			mOracle.connect("ux4", id, pass);

		} catch (Exception e) {
			System.err.println("db.txtにユーザ情報が設定されていない、もしくは認証に失敗しました");
		}
	}

	@Override
	public void destroy() {
		// DB切断
		mOracle.close();
		// TODO 自動生成されたメソッド・スタブ
		super.destroy();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		action(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		action(request, response);
	}

	class AjaxData {
		public String Name;
		public String Value;
	}

	protected void action(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// 要求文字コードのセット(Javaプログラムからはき出す文字コード)
		response.setCharacterEncoding("UTF-8");
		// 応答文字コードのセット(クライアントに通知する文字コードとファイルの種類)
		response.setContentType("text/html; charset=UTF-8");

		// 出力ストリームの取得

		PrintWriter out = response.getWriter();
		// データの抽出
		try {
<<<<<<< HEAD
			String s = String
					.format("select NAIYO from T_JIKANWARI WHERE DAY = '%s' ORDER BY PERIOD",
							getDay());
			ResultSet res = mOracle.query(s);
			s = "";
			res.next();
			for (int a = 1; a <= 3; a++) {
				s += String.format("%d限　<span id = \"ID%d\">%s</span><br>",a, a, res.getString(1));
=======
			String s;
			String s2 = "";
			ResultSet res;
			if (getDay() != 999) {
				s = String
						.format("select NAIYO from T_JIKANWARI where ID >= %d ORDER BY ID",getDay());
				res = mOracle.query(s);
>>>>>>> origin/K
				res.next();
				for (int a = 1; a < 4; a++) {
					s2 += String.format("%d限　%s<br>", a, res.getString(1));
					res.next();
				}
			}else{
				s2 = "授業はありません<br>";
			}
			s = "<hr><div onclick=\"obj=document.getElementById('j').style; obj.display=(obj.display=='none')?'block':'none';\"><div class=\"t\"><a style=\"cursor: pointer;\">";
			if (getTime() >= 1510) {
				s += "明日の時間割";
			} else {
				s += "今日の時間割";
			}
			s += "</a></div></div><div id=\"j\" style=\"display: none; clear: both;\">";
			s += s2;
			s += "</div></div>";
			String s1 = String.format(
					"select NAIYOU from T_YOTEI WHERE Y ='%s'", getDate());
			res = mOracle.query(s1);
			s1 = "";
			while (res.next()) {
				s1 += String.format("%s<br>", res.getString(1));
			}
<<<<<<< HEAD
			if(s1=="")
				s1="今日の予定はありません";
=======
			if (s1 == "")
				s1 = "今日の予定はありません";
			s1 += "　　明日の予定は";
			String s3 = String.format(
					"select NAIYOU from T_YOTEI WHERE Y ='%s'", getNextDate());
			res = mOracle.query(s3);
			s3 = "";
			while (res.next()) {
				s3 += String.format("<br>　　%s", res.getString(1));
			}
			if (s3 == "")
				s3 = "ありません";
			s1+=s3;
>>>>>>> origin/K

			PrintWriter output = response.getWriter();
			// 送信データの作成
			AjaxData data = new AjaxData();
			data.Name = s;
			data.Value = s1;
			// JSON形式に変換
			String json = JSON.encode(data);
			// 出力
			output.println(json);

		} catch (SQLException e) {
			System.err.println("error");
		}

		// 終了部分
		// 出力終了
		out.close();


		//データ受け取り処理
		AjaxData data = JSON.decode(request.getInputStream(),AjaxData.class);




	}

	public static int getDay() {
		Calendar cal = Calendar.getInstance();
		switch (cal.get(Calendar.DAY_OF_WEEK)) {
		case Calendar.SUNDAY:
			return 999;
		case Calendar.MONDAY:
			return 1;
		case Calendar.TUESDAY:
			return 4;
		case Calendar.WEDNESDAY:
			return 7;
		case Calendar.THURSDAY:
			return 10;
		case Calendar.FRIDAY:
			return 13;
		case Calendar.SATURDAY:
			return 999;
		}
		throw new IllegalStateException();
	}

	public static String getDate() {
		GregorianCalendar today = new GregorianCalendar();
		String d = String.format("%04d/%02d/%d", today.get(YEAR), // 年
				today.get(MONTH) + 1, // 月
				today.get(DATE)); // 日
		return d;
	}
	public static String getNextDate() {
		GregorianCalendar today = new GregorianCalendar();
		String d = String.format("%04d/%02d/%d", today.get(YEAR), // 年
				today.get(MONTH) + 1, // 月
				today.get(DATE) + 1); // 日
		return d;
	}

	public static int getTime() {
		Calendar now = Calendar.getInstance();

		int h = now.get(Calendar.HOUR_OF_DAY);
		int m = now.get(Calendar.MINUTE);
		int time = h * 100 + m;
		return time;
	}
}
