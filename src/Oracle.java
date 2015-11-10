

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Oracle {
    private Connection mConnection;
	public Oracle()
	{
		try {
			Class.forName("oracle.jdbc.driver.OracleDriver");
		} catch (ClassNotFoundException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		}
	}
	//接続
    public boolean connect(String host,String id,String pass)
    {
        try {
            //データベースに接続
            mConnection = DriverManager.getConnection("jdbc:oracle:thin:@"
                    + host, id, pass);
            return true;
        } catch (SQLException e) {
            // TODO 自動生成された catch ブロック
            e.printStackTrace();
            return false;
        }
    }
	//切断
    public boolean close()
    {
        try {
            if(mConnection != null)
            {
                mConnection.close();
                return true;
            }
        } catch (SQLException e) {
            // TODO 自動生成された catch ブロック
            e.printStackTrace();
        }
        return false;
    }
	//SQL実行用
    public boolean execute(String sql)
    {
        Statement pstm = null;
        try {
            //SQLの実行領域の作成
            pstm = mConnection.createStatement();
            //データの挿入
            pstm.execute(sql);
            return true;
        } catch (SQLException e) {
            //失敗メッセージの表示
            System.err.println(e.getMessage());
            return false;
        }
        finally
        {
            try {
				//SQLの実行領域の解放
				if(pstm != null)
				    pstm.close();
			} catch (SQLException e) {
				return false;
			}
        }
    }
    //select系SQLの実行用
    public ResultSet query(String sql) {
        if (mConnection == null)
            return null;
        Statement pstm = null;
        ResultSet rset = null;
        try {
            // SQLの実行領域の作成
            pstm = mConnection.createStatement();
            // データの抽出
            rset = pstm.executeQuery(sql);
            return rset;

        } catch (SQLException e) {
            // 失敗メッセージの表示
            System.err.println(e.getMessage());
            try {
				// SQLの実行領域の解放
				if (pstm != null)
				    pstm.close();
			} catch (Exception e1) {
				// TODO 自動生成された catch ブロック
				e1.printStackTrace();
			}
            return null;
        }   
    }
    //取得したデータの解放
    public boolean closeResult(ResultSet rset)
    {
    	if(rset == null)
    		return false;
    	try {
        	Statement pstm = rset.getStatement();
			rset.close();
			pstm.close();
			return true;
		} catch (SQLException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		}
    	return false;
    }
    //テーブルの存在確認
    public boolean isTable(String tableName)
    {
        if (mConnection == null)
            return false;
        ResultSet rset = query(String.format("SELECT table_name FROM user_tables where table_name='%s'",tableName.toUpperCase()));
		try
		{
			return rset.next();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally
		{
			closeResult(rset);
		}
		return false;
    }
    //SQLインジェクション対策
	public static String STR(String str)
	{
		//シングルクオートをシングルクオート二つにエスケーブ
		return str.replaceAll("'", "''");
	}

}
