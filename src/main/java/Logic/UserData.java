package Logic;

import Utils.ServletUtils;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import java.io.File;
import java.io.IOException;
import java.sql.*;
import java.util.Map;

/**
 * Created by Ron on 06-Aug-17.
 */
public class UserData {
    public Integer id;
    public String fname;
    public String lname;
    public String email;
    public String address;
    public String skills;
    public String about;
    public String CV;
    public String profilePic;

    public UserData(String _id, String _fname, String _lname, String _email, String _address, String _skills, String _about, String _CV, String _profilePic) {
        id = Integer.parseInt(_id);
        fname = _fname;
        lname = _lname;
        email = _email;
        address = _address;
        skills = _skills;
        about = _about;
        CV = _CV;
        profilePic = _profilePic;
    }

    //added
    public Integer getId() {
        return id;
    }

    public static UserData getUserDataByEmail(String emailToFind){
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        UserData userData = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM UserData"
                    + " WHERE email='" + emailToFind + "'";
            rs = stmt.executeQuery(SELECT);
            while (rs.next()) {
                userData = createUserFromResultSet(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { stmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
        }
        return userData;
    }


    public static UserData getUserInfoFromDbById(String userId) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        UserData userData = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM UserData"
                    + " WHERE id='" + userId + "'";
            rs = stmt.executeQuery(SELECT);
            if (rs.next()) {
                userData = createUserFromResultSet(rs);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { stmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
        }
        return userData;
    }

    static public UserData createUserFromResultSet(ResultSet rs) {
        UserData userData = null;
        try {
            String id = rs.getString("id");
            String fname = rs.getString("fname");
            String lname = rs.getString("lname");
            String email = rs.getString("email");
            String address = rs.getString("address");
            String skills = rs.getString("skills");
            String about = rs.getString("about");
            String CV = rs.getString("CV");
            String profilePic = rs.getString("profilePic");
            userData = new UserData(id, fname, lname, email, address, skills, about, CV, profilePic);

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return userData;
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
}
