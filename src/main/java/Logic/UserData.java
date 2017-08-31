package Logic;

import Utils.ServletUtils;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import java.io.File;
import java.io.IOException;
import java.sql.*;
import java.util.List;
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

    public UserData(List<Object> row) {
        id = (Integer) row.get(0);
        fname = (String) row.get(1);
        lname = (String) row.get(2);
        email = (String) row.get(3);
        address = (String) row.get(5);
        skills = (String) row.get(6);
        about = (String) row.get(7);
        CV = (String) row.get(8);
        profilePic = (String) row.get(9);
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

    public static String getUserEmailById(String userId) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try{
            con = ServletUtils.getConnection();
            stmt = con.createStatement();

            String SELECT = " SELECT email"
                    + " FROM UserData"
                    + " WHERE id='" + userId + "'";
            rs = stmt.executeQuery(SELECT);
            if (rs.next()) {
                return rs.getString("email");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            try {
                rs.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            try {
                stmt.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            try {
                con.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return null;
    }
}
