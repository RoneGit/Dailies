package Servlets;

import Logic.*;
import Utils.ServletUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.*;

/**
 * Created by Ron on 27-Aug-17.
 */

@WebServlet(name = "notificationsPageServlet", urlPatterns = {"/notificationsPageServlet"})
public class NotificationsPageServlet extends javax.servlet.http.HttpServlet {

    protected void processRequest(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        String requestType = request.getParameter("request_type");
        switch (requestType) {
            case "getUserNotifications":
                getUserNotifications(request, response);
                break;
            /*case "handleHireRequest":
                handleHireRequest(request, response);
                break;
            case "handleRejectRequest":
                handleRejectRequest(request, response);
                break;*/
            case "handleHireRejectRequest":
                handleHireRejectRequest(request, response);
                break;
            case "getUnreadNotifications":
                getUnreadNotifications(request, response);
                break;
        }
    }

    private void getUnreadNotifications(HttpServletRequest request, HttpServletResponse response) {
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
        UserData reciver = UserData.getUserDataByEmail(userEmail);

        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            con = ServletUtils.getConnection();
            stmt = con.createStatement();
            String SELECT = "SELECT COUNT(id) " +
                    " FROM notifications " +
                    " WHERE reciver_id=" + reciver.id +
                    " And is_read=0 " +
                    " GROUP BY reciver_id";

            rs = stmt.executeQuery(SELECT);
            Integer res = null;
            if (rs.next()) {
                res = rs.getInt(1);
            }

            ServletUtils.returnJson(request, response, res);
        } catch (SQLException e) {
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

    private void handleHireRejectRequest(HttpServletRequest request, HttpServletResponse response) {

        String notId = request.getParameter("not_id");
        String applyId = request.getParameter("apply_id");
        String isHire = request.getParameter("is_hire").equals("true") ? "1" : "0";

        Connection con = null;
        Statement stmt = null;
        try {
            con = ServletUtils.getConnection();
            stmt = con.createStatement();

            String UPDATE = "UPDATE apply SET" +
                    " is_hired =" + isHire + ", isPending=0" +
                    " WHERE id = " + Integer.parseInt(applyId) + ";";
            stmt.executeUpdate(UPDATE);

            UPDATE = "UPDATE notifications SET" +
                    " is_approved= " + isHire + ", is_pending=0" +
                    " WHERE id = " + Integer.parseInt(notId) + ";";
            stmt.executeUpdate(UPDATE);

            sendNotificationBackToSender(stmt, notId);
            ServletUtils.returnJson(request, response, true);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
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

    private void sendNotificationBackToSender(Statement stmt, String notId) {
        ResultSet rs = null;
        try {
            String SELECT = "SELECT * " +
                    " FROM notifications " +
                    " WHERE id=" + notId;

            rs = stmt.executeQuery(SELECT);
            NotificationBusiness n;
            if (rs != null) {
                n = new NotificationBusiness(rs);
                rs.close();
                String INSERT = "INSERT INTO notifications (type, business_id,is_read, is_approved, job_id, apply_id, is_pending, reciver_id, sender_id) " +
                        "VALUES('" + Constants.NOTIFICATION_TYPE_RESPOSE_TO_USER + "','" + n.business_id + "' , '" + 0 + "' ,'" + 0 + "' ,'" + n.job_id + "' ,'" + n.apply_id + "' ,'" + n.isPending + "' ,'" +  n.sender_id + "' ,'" + n.reciver_id + "')";
                stmt.executeUpdate(INSERT);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    /*private void handleRejectRequest(HttpServletRequest request, HttpServletResponse response) {

        String notId = request.getParameter("not_id");
        String applyId = request.getParameter("apply_id");
        Connection con = null;
        Statement stmt = null;
        try {
            Class.forName("org.sqlite.JDBC");
            String url = ServletUtils.getDbPath();
            con = DriverManager.getConnection(url);
            stmt = con.createStatement();

            String UPDATE = "UPDATE apply SET" +
                    " is_hired = 0" +
                    " WHERE id = " + Integer.parseInt(applyId) + ";";
            stmt.executeUpdate(UPDATE);

            UPDATE = "UPDATE notifications SET" +
                    " is_approved= 0, is_pending=1" +
                    " WHERE id = " + Integer.parseInt(notId) + ";";
            stmt.executeUpdate(UPDATE);

            ServletUtils.returnJson(request, response, true);
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } finally {
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

    private void handleHireRequest(HttpServletRequest request, HttpServletResponse response) {

        String notId = request.getParameter("not_id");
        String applyId = request.getParameter("apply_id");
        Connection con = null;
        Statement stmt = null;
        try {
            Class.forName("org.sqlite.JDBC");
            String url = ServletUtils.getDbPath();
            con = DriverManager.getConnection(url);
            stmt = con.createStatement();

            String UPDATE = "UPDATE apply SET" +
                    " is_hired = 1" +
                    " WHERE id = " + Integer.parseInt(applyId) + ";";
            stmt.executeUpdate(UPDATE);

            UPDATE = "UPDATE notifications SET" +
                    " is_approved= 1, is_pending=1" +
                    " WHERE id = " + Integer.parseInt(notId) + ";";
            stmt.executeUpdate(UPDATE);

            ServletUtils.returnJson(request, response, true);
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } finally {
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


    }*/

    private void getUserNotifications(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
        UserData user = UserData.getUserDataByEmail(userEmail);
        ServletUtils.returnJson(request, response, NotificationBusiness.getUserNotificationsByUserIdFromDb(user.id));
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
