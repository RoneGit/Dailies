package Servlets;

import Logic.Bussiness;
import Logic.JobOffer;
import Logic.UserData;
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
 * Created by Daniel on 17/08/2017.
 */
@WebServlet(name = "FeedServlet", urlPatterns = {"/FeedServlet"})
public class FeedServlet extends javax.servlet.http.HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        Map<String, String[]> map = request.getParameterMap();
        String requestType = request.getParameter("request_type");
        switch (requestType) {
            case "getLatestJobs":
                getLatestJobs(request, response);
                break;
            case "getJobsByFilter":
                getJobsByFilter(request, response);
                break;
            case "getJobsTitleList":
                getJobTitlesList(request, response);
                break;
            case "applyToJob":
                applyToJob(request,response);
                break;

        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    private void getLatestJobs(HttpServletRequest request, HttpServletResponse response) {

        try {
            Class.forName("org.sqlite.JDBC");
            String url = ServletUtils.getDbPath();
            // create a connection to the database
            Connection con = DriverManager.getConnection(url);

            String d = GetCurentDate();
            Statement stmt = con.createStatement();
            String quary = " SELECT *"
                    + " FROM job_offers";
            ResultSet rs = stmt.executeQuery(quary);

            ArrayList<JobOffer> jobOffers = new ArrayList<>();
            while (rs.next()) {
                String res = rs.getDate("start_date").toString();
                if (res.equals(d)) {
                    jobOffers.add(
                            new JobOffer(
                                    rs.getInt("id"),
                                    rs.getInt("business_id"),
                                    rs.getString("name"),
                                    rs.getString("details"),
                                    rs.getDate("start_date"),
                                    rs.getString("start_time"),
                                    rs.getDate("end_date"),
                                    rs.getString("end_time"),
                                    rs.getString("location"),
                                    rs.getString("requirements"),
                                    rs.getDate(("post_date")),
                                    rs.getString("post_time")));
                }
            }
            ServletUtils.returnJson(request, response, jobOffers);

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }

    }

    private void getJobsByFilter(HttpServletRequest request, HttpServletResponse response) {

        try {
            Class.forName("org.sqlite.JDBC");
            String url = ServletUtils.getDbPath();
            // create a connection to the database
            Connection con = DriverManager.getConnection(url);

            String[] jobFilters = request.getParameterValues("token_list[]");
            String startDate = request.getParameter("start_date");
            String endDate = request.getParameter("end_date");
            String jobLocation = request.getParameter("job_location");

            Date start = Date.valueOf(startDate);
            Date end = Date.valueOf(endDate);


            String quearyLine = getStringOfListVals(jobFilters, start, end, jobLocation);

            Statement stmt = con.createStatement();

            String quary = " SELECT *"
                    + " FROM job_offers"
                    + " WHERE " + quearyLine;
            ResultSet rs = stmt.executeQuery(quary);

            ArrayList<JobOffer> jobOffers = new ArrayList<>();
            while (rs.next()) {
                jobOffers.add(
                        new JobOffer(
                                rs.getInt("id"),
                                rs.getInt("business_id"),
                                rs.getString("name"),
                                rs.getString("details"),
                                rs.getDate("start_date"),
                                rs.getString("start_time"),
                                rs.getDate("end_date"),
                                rs.getString("end_time"),
                                rs.getString("location"),
                                rs.getString("requirements"),
                                rs.getDate(("post_date")),
                                rs.getString("post_time")));
            }

            ServletUtils.returnJson(request, response, jobOffers);
        } catch (
                ClassNotFoundException e)

        {
            e.printStackTrace();
        } catch (
                SQLException e)

        {
            e.printStackTrace();
        }

    }

    private String getStringOfListVals(String[] jobFilters, Date startDate, Date endDate, String jobLocation) {
        String result = new String("(");
        if(jobFilters!=null) {
            int size = jobFilters.length;
            result+="(";
            for (int i = 0; i < size - 1; i++) {
                result += "name='" + jobFilters[i] + "'" + " OR ";
            }
            result += "name='" + jobFilters[size-1] + "')";
        }
        if(!startDate.equals("0")){
            if(jobFilters!=null) {result += " AND ";}
            result+="(start_date >= '" + startDate.getTime() + "' AND start_date <='" + endDate.getTime() + "')";
        }
        if(!endDate.equals("0")) {
            if(!startDate.equals("0") || jobFilters!=null){result += " AND ";}
            result += "(end_date >= '" + startDate.getTime() + "' AND end_date <='" + endDate.getTime() + "')";
        }
        if(!jobLocation.equals("0")) {
            if(!endDate.equals("0") || !startDate.equals("0") || jobFilters!=null){result += " AND ";}
            result += "(location= '" + jobLocation + "')";
        }
        result+=") ORDER BY post_date";
        return result;
    }

    //can be util
    private void getJobTitlesList(HttpServletRequest request, HttpServletResponse response) {
        try {
            Class.forName("org.sqlite.JDBC");

            String url = ServletUtils.getDbPath();
            // create a connection to the database
            Connection con = DriverManager.getConnection(url);

            Statement stmt = con.createStatement();
            String quary = " SELECT *"
                    + " FROM jobTitles"
                    +" ORDER BY jobTitle";

            ResultSet rs = stmt.executeQuery(quary);

            ArrayList<String> jobsTypes = new ArrayList<String>();

            while (rs.next()) {
                jobsTypes.add(rs.getString("jobTitle"));
            }

            ServletUtils.returnJson(request, response, jobsTypes);

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public String getRowAsString(ResultSet rs) throws SQLException {
        StringBuilder sb = new StringBuilder();
        sb.append(rs.getString("details") + " ");
        sb.append(rs.getDate("start_date") + " ");
        sb.append(rs.getDate("end_date") + " ");
        sb.append(rs.getString("location") + " ");
        sb.append(rs.getString("requirements"));

        return sb.toString();

    }

    public String GetCurentDate() {
        java.util.Date date = Calendar.getInstance().getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(date);
    }

    private void applyToJob(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        PreparedStatement pstmt = null;
        String jobId = "";
        String apliedUserId = "";
        Date postDate = new Date(Calendar.getInstance().getTimeInMillis());
        DateFormat dateFormat = new SimpleDateFormat("HH:mm");
        String postTime = dateFormat.format(postDate);
        try {
            Class.forName("org.sqlite.JDBC");
            String url = ServletUtils.getDbPath();
            // create a connection to the database
            con = DriverManager.getConnection(url);

            jobId = request.getParameter("jobId");
            apliedUserId = request.getParameter("userId");

            String sql = "INSERT INTO apply(app_id, job_id , is_finished, app_date, app_time, is_hired) " +
                    "VALUES('" + apliedUserId + "','" + jobId + "','" + 0 + "','" + postDate.getTime() + "','" + postTime + "','" + 0 +"')";

            pstmt = con.prepareStatement(sql);
            pstmt.executeUpdate();
        } catch (
                ClassNotFoundException e)

        {
            e.printStackTrace();
        } catch (
                SQLException e)

        {
            e.printStackTrace();
        }
        finally {
            try { pstmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
        }
        addJobApliedNotification(jobId, apliedUserId);
    }

    private void addJobApliedNotification(String jobId, String apliedUserId)
    {
        JobOffer jobOffer = JobOffer.getJobOfferByIdFromDB(Integer.parseInt(jobId));
        Bussiness bussiness = Bussiness.getBusinessInfoById(Integer.toString(jobOffer.getBusinessId()));
        UserData apliedUserData = UserData.getUserInfoFromDbById(apliedUserId);
        String messege = "User " + apliedUserData.fname +" " + apliedUserData.lname + " has registered to job number " +jobOffer.jobId;
        ServletUtils.addNotification(bussiness.owner_id, bussiness.id ,ServletUtils.NotificationType.jobRegistration.getValue() , messege );
    }
}
