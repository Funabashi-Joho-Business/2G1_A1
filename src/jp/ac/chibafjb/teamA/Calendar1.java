package jp.ac.chibafjb.teamA;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.arnx.jsonic.JSON;

class RecvData {
	public String c_index;
	public String d_index;
	public String cmd;
	public String value;
	public String id;

}

class SendData {
	public String flag;
	public String index;
	public String value;
}

/**
 * Servlet implementation class Ajax10
 */
@WebServlet("/Calendar")
public class Calendar1 extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private jp.ac.chibafjb.teamA.Oracle mOracle;
	private final String DB_ID = "x14g023";
	private final String DB_PASS = "ha9shiba";

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public Calendar1() {
		super();
		// TODO Auto-generated constructor stub
	}

	public void init() throws ServletException {
		// TODO 自動生成されたメソッド・スタブ
		super.init();

		try {
			mOracle = new Oracle();
			mOracle.connect("ux4", DB_ID, DB_PASS);

			// テーブルが無ければ作成
			if (!mOracle.isTable("T_YOTEI")) {

				mOracle.execute("create table t_yotei(scheduleID number,y date,flag number,naiyou varchar2(100),)");
				mOracle.execute("create sequence seq_scheduleId;");
			}
		} catch (Exception e) {
			System.err.println("認証に失敗しました");
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

	private void action(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		// 出力ストリームの作成
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/plain; charset=UTF-8");
		PrintWriter out = response.getWriter();

		// データの受け取り処理
		try {
			RecvData recvData = JSON.decode(request.getInputStream(),
					RecvData.class);
			if ("write".equals(recvData.cmd)) {
				recvData.id = recvData.id.substring(1);
				String sql = String.format("delete t_YOTEI where y='%s'",
						recvData.id);
				// 書き込み処理
				mOracle.execute(sql);
				sql = String
						.format("insert into t_yotei values(seq_scheduleID.nextval,to_date('%s','yyyy/mm/dd'),1,'%s')",
								recvData.id, recvData.value);
				mOracle.execute(sql);
			} else {
				try {

					// データの送信処理
					ArrayList<SendData> list = new ArrayList<SendData>();

					// 文字列をdateに変換
					recvData.c_index+="01";
					SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd");
					Date month = date.parse(recvData.c_index);

					// 翌月のDate型取り出し
					Calendar nextMonth = Calendar.getInstance();
					nextMonth.setTime(month);
					nextMonth.add(Calendar.MONTH,+1);
					String strMonth = date.format(month);
					String strNextMonth = date.format(nextMonth.getTime());

					// 翌月までの予定を取り出し
					String sql = String
							.format("select * from t_YOTEI where y >='%s' and y < '%s' order by y",
									strMonth, strNextMonth);
					ResultSet res = mOracle.query(sql);
					while (res.next()) {
						SendData sendData = new SendData();
						sendData.index = res.getString(2).substring(0, 10);
						sendData.flag = res.getString(3);
						sendData.value = res.getString(4);
						list.add(sendData);
					}
					// JSON形式に変換
					String json = JSON.encode(list);
					// 出力
					out.println(json);
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		} catch (Exception e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		}

	}
}
