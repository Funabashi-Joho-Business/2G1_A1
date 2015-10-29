package jp.ac.chibafjb.teamA;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;

class UserInfo
{
    //戻り値 ユーザが所属するグループ
    //学生   "domain users"
    //教員   "teacher"
    //失敗   null
    public static String getGroup(String userName,String userPass)
    {
        try {
            URL url=new URL("http://ux4/~oikawa/auth/");
            HttpURLConnection con =  (HttpURLConnection)url.openConnection();
            con.setConnectTimeout(500);
            con.setReadTimeout(3000);
            con.setRequestMethod("POST");
            con.setDoOutput(true);
            con.setInstanceFollowRedirects(false);
            String parameterString = String.format("user=%s&pass=%s",userName,userPass);
            PrintWriter printWriter = new PrintWriter(con.getOutputStream());
            printWriter.print(parameterString);
            printWriter.close();
            con.connect();

            BufferedInputStream bis = new BufferedInputStream( con.getInputStream());
            ByteArrayOutputStream  byteBuffer = new ByteArrayOutputStream();
            byte[] buff = new byte[1000];
            int size;
            while((size = bis.read(buff))>= 0)
            {
                byteBuffer.write(buff, 0,size);
            }
            con.disconnect();
            bis.close();

            String[] datas = byteBuffer.toString().split("\n");
            if(datas.length < 2)
                return null;
            if(!datas[0].equals("1"))
                return null;
            return datas[1];

        } catch (Exception e) {
            return null;
        }
    }
}