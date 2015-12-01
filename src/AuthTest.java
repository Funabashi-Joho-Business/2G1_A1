

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.arnx.jsonic.JSON;

/**
 * Servlet implementation class AuthTest
 */
@WebServlet("/AuthTest")
public class AuthTest extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public AuthTest() {
        super();
        // TODO Auto-generated constructor stub
    }

    //要求時JSON形式
    //UserName=ユーザ名
    //UserPass=パスワード

    //戻りJSON形式
    //code=0:認証失敗 1:認証成功
    //group=グループ名
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HashMap<String,String> data = JSON.decode(request.getInputStream());
        //data.get("UserName");

        HashMap<String,String> retData = new HashMap<String,String>();

        String userName = data.get("UserName");
        String userPass = data.get("UserPass");
        if(userName == null || userPass == null)
        {
            retData.put("code","0");
        }
        else
        {
            String group = UserInfo.getGroup(userName, userPass);
            if(group == null)
                retData.put("code","0");
            else
            {
                retData.put("code","1");
                retData.put("group",group);
            }
        }

         //出力ストリームの作成
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/plain; charset=UTF-8");
        PrintWriter out = response.getWriter();
        //JSONデータの作成
        String json = JSON.encode(retData);
        //出力
        out.println(json);
    }

}
