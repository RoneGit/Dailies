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
import java.sql.*;

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
                login(request, response);
                break;
        }
    }

    private void login(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            response.setContentType("text/html;charset=UTF-8");
            Class.forName("org.sqlite.JDBC");
            String url = ServletUtils.getDbPath();
            // create a connection to the database
            con = DriverManager.getConnection(url);
            String userEmailFromParameter = request.getParameter(Constants.USERNAME);
            String userPassFromParameter = request.getParameter(Constants.USERPASS);
            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM UserData"
                    + " WHERE email='" + userEmailFromParameter + "' AND password='" + userPassFromParameter + "'";
            rs = stmt.executeQuery(SELECT);
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
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { stmt.close(); } catch (Exception e) {  e.printStackTrace(); }
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
