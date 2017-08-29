package Servlets;

import Logic.Bussiness;
import Logic.JobOffer;
import Logic.UserData;
import Logic.UserManager;
import Utils.ServletUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Map;

/**
 * Created by Ron on 27-Aug-17.
 */

@WebServlet(name = "notificationsPageServlet", urlPatterns = {"/notificationsPageServlet"})
public class NotificationsPageServlet  extends javax.servlet.http.HttpServlet {

    protected void processRequest(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException
    {
        String requestType = request.getParameter("request_type");
        switch (requestType) {
            case "getUserNotifications":
                getUserNotifications(request,response);
                break;
        }
    }

    private void getUserNotifications(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException
    {
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
        UserData user = UserData.getUserDataByEmail(userEmail);
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try{

            Class.forName("org.sqlite.JDBC");
            String url = ServletUtils.getDbPath();
            con = DriverManager.getConnection(url);
            stmt = con.createStatement();

            String SELECT = " SELECT id, name"
                    + " FROM businesses"
                    + " WHERE owner_id='" + user.getId() + "' ";
            rs = stmt.executeQuery(SELECT);



        }catch (SQLException e) {
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
