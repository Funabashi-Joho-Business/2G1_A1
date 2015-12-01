import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.arnx.jsonic.JSON;

/**
 * Servlet implementation class Login
 */
@WebServlet("/Login")
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Oracle mOracle;

	public static String logA;
	public static String logB;
	public static int flag = 0;


	class logData {
		public String A;
		public String B;
	}

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public Login() {
		super();
		// TODO Auto-generated constructor stub
	}

	public void init() throws ServletException {
		// TODO 自動生成されたメソッド・スタブ
		super.init();

		try {
//			ServletContext context = getServletConfig().getServletContext();
//			URL resource = context.getResource("/WEB-INF/db.txt");
//			InputStream stream = resource.openStream();
//			Scanner sc = new Scanner(stream);
//			String id = sc.next();
//			String pass = sc.next();
//			sc.close();
//			stream.close();

			mOracle = new Oracle();
			mOracle.connect("ux4", "x14g008", "+((1Ee9");

		} catch (Exception e) {
			System.err.println("db.txtにユーザ情報が設定されていない、もしくは認証に失敗しました");
		}
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		action(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		action(request, response);
	}

	protected void action(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		// 要求文字コードのセット(Javaプログラムからはき出す文字コード)
		response.setCharacterEncoding("UTF-8");
		// 応答文字コードのセット(クライアントに通知する文字コードとファイルの種類)
		response.setContentType("text/html; charset=UTF-8");

		// 出力ストリームの取得

		PrintWriter out = response.getWriter();

		try {
			logData logindata = JSON.decode(request.getInputStream(),
					logData.class);

			String check = String.format("select ID from t_user where name = '%s' and pass = '%s'",
					logindata.A,logindata.B);
			ResultSet res = mOracle.query(check);

			if (res.next()) {
				flag = 0;
			}else{
				String sql = String.format(
						"insert into t_user values(seq_scheduleID.nextval,'%s','%s')",
						logindata.A, logindata.B);
				mOracle.query(sql);
				flag = 1;
			}
			logA = logindata.A;
			logB = logindata.B;
			mOracle.close();
		} catch (Exception e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		}

	}
}
