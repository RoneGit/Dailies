package Utils;

import Logic.UserData;
import Logic.UserManager;
import Servlets.LoginServlet;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.io.IOUtils;

import javax.activation.MimetypesFileTypeMap;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.net.URISyntaxException;
import java.sql.*;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Ron on 19-May-17.
 */
public class ServletUtils {
    private static final String USER_MANAGER_ATTRIBUTE_NAME = "userManager";
    private static final String USER_MANAGER = "usermanager";

    //private static final String DbPath= "jdbc:sqlite:C:/Users/Ron/IdeaProjects/Dailies/users.db";
    private static String DbPath = "";
    //private static  String DbPath2= "jdbc:sqlite:C:/Users/OferMe/IdeaProjects/sadna/Dailies 10.8/Dailies/users.db";

    public enum NotificationType {
        jobRegistration(0);

        private final int value;
        private NotificationType(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    public static UserManager getUserManager(ServletContext servletContext) {
        if (servletContext.getAttribute(USER_MANAGER) == null) {
            servletContext.setAttribute(USER_MANAGER, new UserManager());
        }
        return (UserManager) servletContext.getAttribute(USER_MANAGER);
    }

    public static void setDbPath2()
    {
        String path = null;
        try {
            path = ServletUtils.class.getProtectionDomain().getCodeSource().getLocation().toURI().getPath();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }

        path += "Resources/users.db";
        DbPath = "jdbc:sqlite:" + path;
    }

    public static void setDbPath()
    {
        String path = null;
        try {
            path = ServletUtils.class.getProtectionDomain().getCodeSource().getLocation().toURI().getPath();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        StringBuilder sb = new StringBuilder(path);
        sb.delete(0, 1);
        for (int i = 0; i <= 4; i++) {
            int start = sb.lastIndexOf("/");
            int end = sb.length();
            sb = sb.delete(start, end);
        }

        path = sb.toString();
        path += "/users.db";
        DbPath = "jdbc:sqlite:" + path;
    }
    public static void setDbPath3()
    {
        String path = null;
        try {
            path = ServletUtils.class.getProtectionDomain().getCodeSource().getLocation().toURI().getPath();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        StringBuilder sb = new StringBuilder(path);
        sb.delete(0, 1);
        for (int i = 0; i <= 3; i++) {
            int start = sb.lastIndexOf("/");
            int end = sb.length();
            sb = sb.delete(start, end);
        }

        path = sb.toString();
        path += "/users.db";
        DbPath = "jdbc:sqlite:" + path;
    }

    public static String getDbPath() {
        return DbPath;
    }

    public static String getSessionId(HttpServletRequest request) {
        //do not delete
        String sessionId = request.getSession().getId();
        if (sessionId == null) {
            //if some one enters not from login page
        }
        return sessionId;
    }

    static public void returnJson(HttpServletRequest request, HttpServletResponse response, Object obj) {
        try (PrintWriter out = response.getWriter()) {
            response.setContentType("application/json");

            Gson gson = new Gson();
            String json = gson.toJson(obj);
            out.println(json);
            out.flush();
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }

    static public Map<String, String> uploadUserFiles(Collection<Part> parts) {
        Map<String, String> urls = null;
        urls = new HashMap<String, String>();
        for (Part part : parts) {
            if (part.getSubmittedFileName() != null) {
                File file = saveFile(part);
                urls.put(part.getName(), uploadFileToCloudinary(file, isPicture(file)));
            }
        }

        return urls;
    }

    static public File saveFile(Part part) {
        try {
            final Part filePart = part;
            String fileName = filePart.getSubmittedFileName();
            final File tempFile = new File(fileName);
            tempFile.deleteOnExit();
            InputStream in = filePart.getInputStream();
            try (FileOutputStream out = new FileOutputStream(tempFile)) {
                IOUtils.copy(in, out);
            }
            return tempFile;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    static private Boolean isPicture(File file) {
        String mimetype = new MimetypesFileTypeMap().getContentType(file);
        String type = mimetype.split("/")[0];
        if (type.equals("image")) {
            return true;
        }
        return false;
    }

    public static String uploadFileToCloudinary(File file, boolean picOrDoc) {
        String url = null;
        try {
            String Type;
            if (picOrDoc == true) Type = "image";
            else Type = "raw";
            Map map = ObjectUtils.asMap(
                    "cloud_name", "dailies",
                    "api_key", "385538641818241",
                    "api_secret", "_vtuycYvadSdGkpHAa3hSIgWoOg");
            Cloudinary cloudinary = new Cloudinary(map);
            Map uploadResult = cloudinary.uploader().upload(file, ObjectUtils.asMap(
                    "resource_type", Type));
            url = uploadResult.get("url").toString();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return url;
    }

    public static void addNotification(Integer userId, Integer busId ,Integer typeOfNot, String messege)
    {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {

            Class.forName("org.sqlite.JDBC");
            String url = ServletUtils.getDbPath();
            // create a connection to the database
            con = DriverManager.getConnection(url);
            String sql = "INSERT INTO notifications(user_Id,type,is_read, msg , business_id) " +
                    "VALUES('" + userId + "','" + typeOfNot + "' , '" + 0 + "' ,'" + messege + "' ,'" + busId + "')";
            pstmt = con.prepareStatement(sql);
            pstmt.executeUpdate();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { pstmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
        }
    }
}
