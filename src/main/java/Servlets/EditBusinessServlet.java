package Servlets;

import Logic.*;
import Utils.ServletUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;
import java.sql.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.sql.Date;
import java.util.Map;

import static Utils.ServletUtils.returnJson;

@WebServlet(name = "EditBusinessServlet", urlPatterns = {"/editBusinessServlet"})
@MultipartConfig
public class EditBusinessServlet extends javax.servlet.http.HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {

        //Map<String,String[]> map =request.getParameterMap();

        String requestContentType = request.getContentType();
        if (requestContentType.contains("multipart/form-data")) {
            registerBusiness(request, response);
        } else {
            String requestType = request.getParameter("request_type");
            switch (requestType) {

                case "deleteBusinessById":
                    deleteBusiness(request, response);
                    break;
                case "redirectToEditBusinessById":
                    redirectToEditBusinessById(request, response);
                    break;
                /*case "registerBusinessTexts":
                    registerBusinessTexts(request, response, urls.get("profilePic"));
                    break;*/
                case "updateJob":
                    updateJobOffer(request, response);
                    break;
                case "deleteJobById":
                    deleteJobById(request, response);
                    break;
                case "addJobOffer":
                    addJobOffer(request, response);
                    break;
                /*case "addNewBusiness":
                    addNewBusiness(request, response);
                    break;*/
            }

        }
    }

    /*private void addNewBusiness(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        PreparedStatement stmt = null;
        try {
            Class.forName("org.sqlite.JDBC");

            UserManager userManager = ServletUtils.getUserManager(getServletContext());
            String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
            UserData user =UserData.getUserDataByEmail(userEmail);

            String url = ServletUtils.getDbPath();
            con = DriverManager.getConnection(url);
            String name = request.getParameter("name");
            String city = request.getParameter("city");
            String street = request.getParameter("street");
            String number = request.getParameter("number");
            String email = request.getParameter("email");
            String phone = request.getParameter("phone");
            String about = request.getParameter("about");
            String profileUrl = "";


            String sql = "INSERT INTO businesses (owner_id ,name, city, street, number, email, phone, aout, profilePic) " +
                    "VALUES('" + user.getId() + "' , '"+ name + "' , '" + city + "' , '" + street + "' ,'" + number + "','" + email + "','" + phone + "','" + about + "','"  + profileUrl + "')";


            stmt = con.prepareStatement(sql);
            stmt.executeUpdate();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
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
    }*/


    private void addJobOffer(HttpServletRequest request, HttpServletResponse response) {
        response.setContentType("text/html;charset=UTF-8");
        String businessId = request.getParameter("business_id");
        String businessName = request.getParameter("business_name");
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));

        if (!Bussiness.doesUserOwnBusiness(UserData.getUserDataByEmail(userEmail).getId().toString(), businessId)) {
            try {
                response.sendRedirect("/Error.html");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        DateFormat format = new SimpleDateFormat("YYYY-MM-DD");
        Integer busId = Integer.parseInt(businessId);
        String name = request.getParameter("title");
        String location = request.getParameter("jobLocation");
        Long startDate = Date.valueOf(request.getParameter("startDate")).getTime();
        String startTime = request.getParameter("startTime");
        String time = request.getParameter("endDate");
        Date endDate = time.equals("") ? null : Date.valueOf(request.getParameter("endDate"));
        String endTime = request.getParameter("endTime");
        String details = request.getParameter("details");
        String requirements = request.getParameter("requirements");

        Date postDate = new Date(Calendar.getInstance().getTimeInMillis());
        DateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
        String postTime = dateFormat.format(postDate);

        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            Class.forName("org.sqlite.JDBC");
            String url = ServletUtils.getDbPath();
            // create a connection to the database
            con = DriverManager.getConnection(url);

            String sql = "INSERT INTO job_offers(business_id ,name,location, start_date,start_time,/*end_date,*/end_time,details,requirements,post_date,post_time) " +
                    "VALUES('" + busId + "','" + name + "' , '" + location + "' ,'" + startDate + "' ,'" + startTime + "' ,'" + /*endDate + "' ,'" + */endTime + "' ,'" + details + "' ,'" + requirements +
                    "' ,'" + postDate.getTime() + "' ,'" + postTime + "')";


            pstmt = con.prepareStatement(sql);
            pstmt.executeUpdate();

            if (!time.equals("")){
                sql = "INSERT INTO job_offers(end_date) " +
                        "VALUES('" + endDate.getTime() + "')";
                pstmt = con.prepareStatement(sql);
                pstmt.executeUpdate();
            }

            try {
                response.sendRedirect("/editJobs.html?business_id=" + busId + "&business_name=" + businessName);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                rs.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            try {
                pstmt.close();
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

    private void deleteJobById(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        Statement stmt = null;

        try {
            String id = request.getParameter("job_id");
            Class.forName("org.sqlite.JDBC");
            String url = ServletUtils.getDbPath();
            // create a connection to the database
            con = DriverManager.getConnection(url);
            stmt = con.createStatement();

            String DELETE = " DELETE "
                    + " FROM job_offers"
                    + " WHERE id='" + id + "' ";

            int flag = stmt.executeUpdate(DELETE);
            returnJson(request, response, flag);
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

    private void updateJobOffer(HttpServletRequest request, HttpServletResponse response) {
        response.setContentType("text/html;charset=UTF-8");
        String businessId = request.getParameter("business_id");
        String businessName = request.getParameter("business_name");
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));

        if (!Bussiness.doesUserOwnBusiness(UserData.getUserDataByEmail(userEmail).getId().toString(), businessId)) {
            try {
                response.sendRedirect("/Error.html");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        DateFormat format = new SimpleDateFormat("YYYY-MM-DD");
        Integer id = Integer.parseInt(request.getParameter("jobId"));
        Integer busId = Integer.parseInt(businessId);
        String name = request.getParameter("title");
        String location = request.getParameter("jobLocation");
        Date startDate = Date.valueOf(request.getParameter("startDate"));
        String startTime = request.getParameter("startTime");
        Date endDate = Date.valueOf(request.getParameter("endDate"));
        String endTime = request.getParameter("endTime");
        String details = request.getParameter("details");
        String requirements = request.getParameter("requirements");

        Date postDate = new Date(Calendar.getInstance().getTimeInMillis());
        DateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
        String postTime = dateFormat.format(postDate);

        JobOffer job = new JobOffer(id, busId, name, details, startDate, startTime, endDate, endTime, location, requirements, postDate, postTime);
        JobOffer.updateJobOffer(job);

        try {
            response.sendRedirect("/editJobs.html?business_id=" + busId + "&business_name=" + businessName);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }


    private void registerBusiness(HttpServletRequest request, HttpServletResponse response) {
        try {

            Part profilePic = request.getPart("profilePic");
            ArrayList<Part> parts= new ArrayList<>();
            parts.add(profilePic);
            Map<String, String> urls =ServletUtils.uploadUserFiles(parts);
            String enc =urls.get("profilePic");
            request.setCharacterEncoding("UTF-8");
            registerBusinessTexts(request,response,urls.get("profilePic"));



        } catch (ServletException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    private void registerBusinessTexts(HttpServletRequest request, HttpServletResponse response, String profilePicUrl) {
        Connection con = null;
        Statement stmt = null;
        try {
            Class.forName("org.sqlite.JDBC");
            String dbPath = ServletUtils.getDbPath();
            con = DriverManager.getConnection(dbPath);

            String name = request.getParameter("name");
            String city = request.getParameter("city");
            String street = request.getParameter("street");
            String number = request.getParameter("number");
            String email = request.getParameter("email");
            String phone = request.getParameter("phone");
            String about = request.getParameter("about");
            String requestType=request.getParameter("request_type");
            stmt = con.createStatement();
            String sql;
            if(requestType.equals("registerAllUpdates")) {
                String id = request.getParameter("id");
                 sql = "UPDATE businesses " +
                        "SET " +
                        "name='" + name + "', " +
                        "city='" + city + "', " +
                        "street='" + street + "', " +
                        "number='" + number + "', " +
                        "email='" + email + "', " +
                        "phone='" + phone + "', " +
                        "aout='" + about + "', " +
                        "profilePic='" + profilePicUrl + "' " +
                        "WHERE id='" + id + "' ";


            }
            else {
                UserManager userManager = ServletUtils.getUserManager(getServletContext());
                String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
                UserData user =UserData.getUserDataByEmail(userEmail);
                sql = "INSERT INTO businesses (owner_id ,name, city, street, number, email, phone, aout, profilePic) " +
                        "VALUES('" + user.getId() + "' , '"+ name + "' , '" + city + "' , '" + street + "' ,'" + number + "','" + email + "','" + phone + "','" + about + "','"  + profilePicUrl + "')";

            }
            stmt.executeUpdate(sql);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
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

    private void redirectToEditBusinessById(HttpServletRequest request, HttpServletResponse response) {
        String businessId = request.getParameter("business_id");
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
        UserData user = UserData.getUserDataByEmail(userEmail);
        if (Bussiness.doesUserOwnBusiness(user.getId().toString(), businessId)) {
            returnJson(request, response, true);
        } else {
            returnJson(request, response, true);
        }


    }

    private void deleteBusiness(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        Statement stmt = null;

        try {
            String id = request.getParameter("business_id");
            Class.forName("org.sqlite.JDBC");
            String url = ServletUtils.getDbPath();
            // create a connection to the database
            con = DriverManager.getConnection(url);
            stmt = con.createStatement();

            String DELETE = " DELETE "
                    + " FROM businesses"
                    + " WHERE id='" + id + "' ";

            int flag = stmt.executeUpdate(DELETE);
            //con.close();//close
            returnJson(request, response, flag);
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } finally {
            /*try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }*/
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
