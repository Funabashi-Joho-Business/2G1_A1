import static java.util.Calendar.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.GregorianCalendar;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.arnx.jsonic.JSON;

/**
 * Servlet implementation class Test01
 */
@WebServlet("/Test01")
public class Test01 extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Oracle mOracle;
	String lA = Login.logA;
	String lB = Login.logB;
	String uid;

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
//			ServletContext context = getServletConfig().getServletContext();
//			URL resource = context.getResource("/WEB-INF/db.txt");
//			InputStream stream = resource.openStream();
//			Scanner sc = new Scanner(stream);
//
//			String id = sc.next();
//			String pass = sc.next();
//			sc.close();
//			stream.close();

			mOracle = new Oracle();
			mOracle.connect("ux4", "x14g008", "+((1Ee9");


//			String ssc[][] = { { "2015-04-10", "入学式" },
//					{ "2015-04-19", "基本情報" }, { "2015-05-09", "学校見学会" },
//					{ "2015-06-06", "学校見学会" }, { "2015-06-13", "学校見学会" },
//					{ "2015-06-13", "漢字検定" }, { "2015-06-28", "午前免除試験" },
//					{ "2015-07-05", "ジョブパス" }, { "2015-07-11", "学校見学会" },
//					{ "2015-07-16", "前期試験１日目" }, { "2015-07-17", "前期試験２日目" },
//					{ "2015-07-18", "学校見学会" }, { "2015-07-21", "前期試験３日目" },
//					{ "2015-07-22", "前期試験４日目" }, { "2015-07-29", "成績発表" },
//					{ "2015-08-03", "学校見学会" }, { "2015-08-06", "学校見学会" },
//					{ "2015-08-18", "学校見学会" }, { "2015-08-26", "学校見学会" },
//					{ "2015-08-28", "学校見学会" }, { "2015-09-12", "学校見学会" },
//					{ "2015-09-25", "体育祭" }, { "2015-09-26", "学校見学会" },
//					{ "2015-10-03", "学校見学会" }, { "2015-10-18", "基本情報" },
//					{ "2015-10-24", "若幸祭初日" }, { "2015-10-25", "若幸祭最終日" },
//					{ "2015-10-26", "若幸祭振替休日" }, { "2015-10-27", "若幸祭振替休日" },
//					{ "2015-10-31", "漢字検定" }, { "2015-10-25", "若幸祭最終日" },
//					{ "2015-11-06", "ひろえば船橋" }, { "2015-11-07", "学校見学会" },
//					{ "2015-11-21", "学校見学会" }, { "2015-12-05", "学校見学会" },
//					{ "2015-12-19", "学校見学会" }, { "2016-01-09", "学校見学会" },
//					{ "2016-02-06", "学校見学会" }, { "2016-02-10", "卒業研究発表会" },
//					{ "2016-02-18", "卒業生成績発表" }, { "2016-02-19", "在校生成績発表" },
//					{ "2016-02-20", "学校見学会" }, { "2016-03-05", "学校見学会" },
//					{ "2016-03-11", "卒業式" }, { "2016-03-18", "終業式" } };
			String jc[][] = { { "1", "月", "1", "テスト技法" },
					{ "2", "月", "2", "システム開発" }, { "3", "月", "3", "就職講座" },
					{ "4", "火", "1", "DBA" }, { "5", "火", "2", "システム開発" },
					{ "6", "火", "3", "やってみなはれ演習" },
					{ "7", "水", "1", "システム開発" }, { "8", "水", "2", "office応用" },
					{ "9", "水", "3", "Linux" }, { "10", "木", "1", "システム開発" },
					{ "11", "木", "2", "UML" }, { "12", "木", "3", "Linux" },
					{ "13", "金", "1", "就職講座" }, { "14", "金", "2", "検定対策" },
					{ "15", "金", "3", "なし" } };

//			mOracle.execute("create sequence seq_scheduleId");
//			mOracle.execute("create table t_yotei(scheduleID number,y date,"
//					+ "flag number,naiyou varchar2(100))");
//			mOracle.execute("create table T_JIKANWARI(id number,day varchar2(50),period number,naiyo varchar2(100))");

			String us = String.format(
					"select ID from t_user where name = '%s' and pass = '%s'",
					lA, lB);
			ResultSet userid = mOracle.query(us);

			while (userid.next()) {
				uid = userid.getString(1);
			}

//			for (int i = 0; i < 45; i++) {
//				String sql = String.format(
//						"insert into t_yotei values(seq_scheduleID.nextval,"
//								+ "to_date('%s','yyyy/mm/dd'),0,'%s')",
//						ssc[i][0], ssc[i][1]);
//				mOracle.execute(sql);
//			}
			if (Login.flag == 1) {
				for (int i = 0; i < 15; i++) {
					String sql = String.format(
							"insert into t_jikanwari values(%s,'%s',%s,'%s')",
							uid, jc[i][1], jc[i][2], jc[i][3]);
					mOracle.execute(sql);
				}
			}

		} catch (Exception e) {
			System.err.println("db.txtにユーザ情報が設定されてない、もしくは認証に失敗しました");
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

	class AjaxData2 {
		public String value;
		public int a;
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
			String s = String
					.format("select NAIYO from T_JIKANWARI WHERE DAY = '%s' and id =%s ORDER BY PERIOD",
							getDay(),uid);
			ResultSet res = mOracle.query(s);
			s = "";
			res.next();
			for (int a = 1; a <= 3; a++) {
				s += String.format("%d限　<span id = \"ID%d\">%s</span><br>", a,
						a, res.getString(1));
				res.next();
			}
			String s1 = String.format(
					"select NAIYOU from T_YOTEI WHERE Y ='%s' and (scheduleId = %s or scheduleId = 0)", getDate(),uid);
			res = mOracle.query(s1);
			s1 = "";
			while (res.next()) {
				s1 += String.format("%s<br>", res.getString(1));
			}
			if (s1 == "")
				s1 = "今日の予定はありません";

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

		// データ受け取り処理
		try {
			AjaxData2 data2 = JSON.decode(request.getInputStream(),
					AjaxData2.class);
			String tt = String
					.format("update t_jikanwari set naiyo='%s' where period=%d and day = '%s'",
							data2.value, data2.a, getDay());
			mOracle.query(tt);
		} catch (Exception e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		}

		// 終了部分
		// 出力終了
		out.close();

	}

	public static String getDay() {
		Calendar cal = Calendar.getInstance();
		switch (cal.get(Calendar.DAY_OF_WEEK)) {
		case Calendar.SUNDAY:
			return "日";
		case Calendar.MONDAY:
			return "月";
		case Calendar.TUESDAY:
			return "火";
		case Calendar.WEDNESDAY:
			return "水";
		case Calendar.THURSDAY:
			return "木";
		case Calendar.FRIDAY:
			return "金";
		case Calendar.SATURDAY:
			return "土";
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
}
