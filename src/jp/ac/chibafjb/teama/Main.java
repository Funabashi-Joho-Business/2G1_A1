package jp.ac.chibafjb.teama;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * Servlet implementation class Main
 */
@WebServlet("/Main")
public class Main extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public Main() {
        super();
        // TODO Auto-generated constructor stub
    }

//	public void init() throws ServletException {
//		// TODO 自動生成されたメソッド・スタブ
//		super.init();
//
//
//		try{
//			mOracle = new Oracle();
//			mOracle.connect("ux4", DB_ID, DB_PASS);
//
//			//テーブルが無ければ作成
//			if(!mOracle.isTable("db_exam10"))
//			{
//				mOracle.execute("create table db_exam10(id number,name varchar2(200),msg varchar2(200))");
//				mOracle.execute("create sequence db_exam10_seq");
//			}
//		} catch (Exception e) {
//			System.err.println("認証に失敗しました");
//		}
//	}
//
//	@Override
//	public void destroy() {
//		//DB切断
//		mOracle.close();
//		// TODO 自動生成されたメソッド・スタブ
//		super.destroy();
//	}


	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		action(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		action(request,response);
	}



	private void action(HttpServletRequest request, HttpServletResponse response) throws IOException {
		//出力ストリームの作成
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/plain; charset=UTF-8");
        PrintWriter out = response.getWriter();
	}


}
