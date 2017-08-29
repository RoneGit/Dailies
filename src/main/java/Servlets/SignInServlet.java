package Servlets;

import Utils.ServletUtils;
import com.google.gson.Gson;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

/**
 * Created by OferMe on 12-Apr-17.
 */
@WebServlet(name = "SignInServlet", urlPatterns = {"/signIn"})
public class SignInServlet extends javax.servlet.http.HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            Class.forName("org.sqlite.JDBC");
            String url = ServletUtils.getDbPath();
            // create a connection to the database
            con = DriverManager.getConnection(url);
            String fname = request.getParameter("fname");
            String lname = request.getParameter("lname");
            String email = request.getParameter("email");
            String password = request.getParameter("password");
            stmt = con.createStatement();
            String SELECT = "SELECT *"
                    + " FROM UserData"
                    + " WHERE email='" + email + "'";
            rs = stmt.executeQuery(SELECT);
            int flag = 0;
            while (rs.next()) {
                //user exists
                flag = 1;
                ServletUtils.returnJson(request, response, flag);
            }
            try (PrintWriter out = response.getWriter()) {
                String sql = "INSERT INTO UserData(fname,lname,email, password ) " +
                        "VALUES('" + fname + "','" + lname + "' , '" + email + "' ,'" + password + "')";
                PreparedStatement pstmt = con.prepareStatement(sql);
                pstmt.executeUpdate();
                ServletUtils.returnJson(request, response, flag);
            }
        } catch (SQLException e) {
            System.out.println("couldent connect db");
            System.out.println(e.getErrorCode());
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } finally {
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
    }

    @Override
    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */
    @Override
    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        processRequest(request, response);
    }
}
