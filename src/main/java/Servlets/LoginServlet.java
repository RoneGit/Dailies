package Servlets;

import Logic.UserManager;
import Utils.ServletUtils;

import javax.servlet.ServletContext;
import javax.servlet.annotation.WebServlet;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.net.URISyntaxException;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import static com.sun.org.apache.xml.internal.serialize.LineSeparator.Web;

/**
 * Created by Ron on 25-Nov-16.
 */

@WebServlet(name = "LoginServlet", urlPatterns = {"/login"})
public class LoginServlet extends javax.servlet.http.HttpServlet {
    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String requestType = request.getParameter("request_type");

        switch (requestType) {
            case "setDBPath":
                ServletUtils.setDbPath();
                break;
            case "Login":
                login(request,response);
                break;
        }
    }

    private void login(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            con = ServletUtils.getConnection();
            st = con.createStatement();
            // note that i'm leaving "date_created" out of this insert statement
            String userEmailFromParameter = request.getParameter(Constants.USERNAME);
            String userPassFromParameter = request.getParameter(Constants.USERPASS);
            String SELECT = " SELECT *"
                    + " FROM UserData"
                    + " WHERE email='" + userEmailFromParameter + "' AND password='" + userPassFromParameter + "'";

            rs = st.executeQuery(SELECT);
            int flag = 0;
            while (rs.next()) {
                flag = 1;
                ServletContext servletContext = getServletContext();
                UserManager UserManager = ServletUtils.getUserManager(servletContext);
                UserManager.addNewUserSession(rs.getString("email"), ServletUtils.getSessionId(request));
            }
            ServletUtils.returnJson(request, response, flag);
        } catch (SQLException e) {
            System.out.println("couldent connect db");
            System.out.println(e.getErrorCode());
            e.printStackTrace();
        } finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { st.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
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

    private void setMessageBack(HttpServletRequest request, HttpServletResponse response, String errorMessage,
                                String typeMessage, String webPage) throws ServletException, IOException {
        request.setAttribute(typeMessage, errorMessage);
        getServletContext().getRequestDispatcher(webPage).forward(request, response);
    }

}
