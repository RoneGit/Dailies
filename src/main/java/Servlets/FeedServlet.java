package Servlets;

import Logic.Bussiness;
import Logic.JobOffer;
import Logic.UserData;
import Logic.UserManager;
import Utils.ServletUtils;
//import javafx.util.Pair;
import org.apache.commons.lang3.tuple.Pair;

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

            case "getJobsByFilter":
                getJobsByFilter(request, response);
                break;
            case "getJobsTitleList":
                getJobTitlesList(request, response);
                break;
            case "applyToJob":
                applyToJob(request, response);
                break;

        }
    }

    private void applyToJob(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
        UserData user = UserData.getUserDataByEmail(userEmail);
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();

            String applicantId = user.id.toString();
            String jobId = request.getParameter("job_id");
            String businessId = request.getParameter("business_id");
            String ownerId = Bussiness.getBusinessInfoById(businessId).owner_id.toString();
            Date appDate = Date.valueOf(GetCurentDate());
            String appTime = GetCurrentTime();
            boolean flag = true;

            String sql = "INSERT INTO apply (applicant_id, job_id, app_date, app_time, is_hired, business_id, isPending, is_finished) " +
                    "VALUES('" + applicantId + "','" + jobId + "' , '" + appDate.getTime() + "' ,'" + appTime + "' ,'" + 0 + "' ,'" + businessId + "' ,'" + 0 + "' ,'"  + 0 + "')";

            pstmt = con.prepareStatement(sql);
            pstmt.executeUpdate();
            //-------getting the apply id of the apply you just insert
            //-------to send to UpdateNotifications
            sql = "SELECT id " +
                    " FROM apply" +
                    " WHERE applicant_id=" + applicantId +
                    " AND job_id=" + jobId +
                    " AND app_date=" + appDate.getTime() +
                    " AND app_time='" + appTime +"'"+
                    " AND business_id=" + businessId;

            Statement s = con.createStatement();
            rs = s.executeQuery(sql);
            String applyId = rs.getString(1);
            //------------------------------------------------
            UpdateNotifications(con, applicantId, ownerId, jobId, businessId, 0, 0, applyId, Constants.NOTIFICATION_TYPE_APPLY);

            ServletUtils.returnJson(request, response, flag);
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

    private void UpdateNotifications(Connection con, String senderID, String reciverID, String jobId, String businessId, int isRead, int isApproved, String applyId, int type) throws SQLException {
        PreparedStatement pstmt = null;

        String sql = "INSERT INTO notifications (type, business_id,is_read, is_approved, job_id, sender_id, reciver_id, apply_id,is_pending) " +
                "VALUES('" + type + "','" + businessId + "' , '" + isRead + "' ,'" + isApproved + "' ,'" + jobId + "' ,'" + senderID + "' ,'" + reciverID + "' ,'" + applyId + "' ,'" + 0 + "')";

        pstmt = con.prepareStatement(sql);
        pstmt.executeUpdate();
    }

    private String GetCurrentTime() {
        Date postDate = new Date(Calendar.getInstance().getTimeInMillis());
        DateFormat dateFormat = new SimpleDateFormat("HH:mm");
        String postTime = dateFormat.format(postDate);
        return postTime;
    }


    private void getJobsByFilter(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        Statement stmt = null;
        Statement lastIdStm = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();

            String[] jobFilters = request.getParameterValues("token_list[]");
            String[] jobLocation = request.getParameterValues("job_location[]");
            String startDate = request.getParameter("start_date");
            String endDate = request.getParameter("end_date");
            String quearyLine;
            Date lastPostDate = null;
            String lastPostTime = null;
            Date start = null;
            Date end = null;
            boolean isAllNull = (request.getParameter("flag").equals("true"));
            boolean isContinue = (request.getParameter("flagContinue").equals("true"));

            if (isContinue) {
                //LastPostDate = Date.valueOf(request.getParameter("lastPostDate"));
                String lastPostID = request.getParameter("lastPostId");
                String lastDateQuary = " SELECT *"
                        + " FROM job_offers" +
                        " WHERE id='" + lastPostID + "'";
                lastIdStm = con.createStatement();
                ResultSet lastIdRs = lastIdStm.executeQuery(lastDateQuary);
                lastPostDate = lastIdRs.getDate("post_date");
                lastPostTime = request.getParameter("lastPostTime");
            }

            if (!startDate.equals("0")) {
                start = Date.valueOf(startDate);
            }
            if (!endDate.equals("0")) {
                end = Date.valueOf(endDate);
            }
            if (!isContinue)
                quearyLine = getStringOfListVals(jobFilters, start, end, jobLocation, isAllNull);
            else
                quearyLine = getRestOfStringOfListVals(jobFilters, start, end, jobLocation, isAllNull, lastPostDate, lastPostTime);


            stmt = con.createStatement();

            String quary = " SELECT *, job_offers.id AS offer_id, businesses.name AS business_name"
                    + " FROM job_offers" +
                    " JOIN businesses" +
                    " ON job_offers.business_id = businesses.id"
                    + quearyLine;
            ResultSet rs = stmt.executeQuery(quary);

            ArrayList<Pair<JobOffer, Bussiness>> jobOffers = new ArrayList<>();
            int counter = 0;
            while (rs.next()) {
                jobOffers.add(Pair.of(
                        new JobOffer(
                                rs.getInt("offer_id"),
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
                                rs.getString("post_time")),
                        new Bussiness(
                                rs.getInt("business_id"),
                                rs.getString("business_name"),
                                rs.getString("city"),
                                rs.getString("street"),
                                rs.getInt("number"),
                                rs.getString("email"),
                                rs.getString("phone"),
                                rs.getString("aout"),
                                rs.getInt("owner_id"),
                                rs.getString("profilePic")
                        )));
                if (++counter == 5)
                    break;
            }
            java.util.Collections.reverse(jobOffers);
            ServletUtils.returnJson(request, response, jobOffers);
        } catch (
                SQLException e)

        {
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

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }


    private String getStringOfListVals(String[] jobFilters, Date startDate, Date endDate, String[] jobLocation, boolean allNull) {
        String result;
        if (!allNull) {
            result = new String(" WHERE (");
            if (jobFilters != null) {
                int size = jobFilters.length;
                result += "(";
                for (int i = 0; i < size - 1; i++) {
                    result += "job_offers.name='" + jobFilters[i] + "'" + " OR ";
                }
                result += "job_offers.name='" + jobFilters[size - 1] + "')";
            }
            if (startDate != null) {
                if (jobFilters != null) {
                    result += " AND ";
                }
                result += "(start_date >= '" + startDate.getTime() /*+ "' AND start_date <='" + endDate.getTime()*/ + "')";
            }
            if (endDate != null) {
                if (startDate != null || jobFilters != null) {
                    result += " AND ";
                }
                result += "(end_date <='" + endDate.getTime() + "')";
            }
            if (jobLocation != null) {
                if (endDate != null || startDate != null || jobFilters != null) {
                    result += " AND ";
                }
                int size = jobLocation.length;
                result += "(";
                for (int i = 0; i < size - 1; i++) {
                    result += "location='" + jobLocation[i] + "'" + " OR ";
                }
                result += "location='" + jobLocation[size - 1] + "')";
            }
            result += ") ORDER BY post_date DESC, post_time DESC";
        } else {
            result = " ORDER BY post_date DESC, post_time ASC";
        }
        return result;
    }

    private String getRestOfStringOfListVals(String[] jobFilters, Date startDate, Date endDate, String[] jobLocation, boolean allNull, Date lastPostDate, String lastPostTime) {
        String result;
        if (!allNull) {
            result = new String(" WHERE (");
            if (jobFilters != null) {
                int size = jobFilters.length;
                result += "(";
                for (int i = 0; i < size - 1; i++) {
                    result += "job_offers.name='" + jobFilters[i] + "'" + " OR ";
                }
                result += "job_offers.name='" + jobFilters[size - 1] + "')";
            }
            if (startDate != null) {
                if (jobFilters != null) {
                    result += " AND ";
                }
                result += "(start_date >= '" + startDate.getTime() /*+ "' AND start_date <='" + endDate.getTime()*/ + "')";
            }
            if (endDate != null) {
                if (startDate != null || jobFilters != null) {
                    result += " AND ";
                }
                result += "(end_date <='" + endDate.getTime() + "')";
            }
            if (jobLocation != null) {
                if (endDate != null || startDate != null || jobFilters != null) {
                    result += " AND ";
                }
                int size = jobLocation.length;
                result += "(";
                for (int i = 0; i < size - 1; i++) {
                    result += "location='" + jobLocation[i] + "'" + " OR ";
                }
                result += "location='" + jobLocation[size - 1] + "')";
            }
            result += " AND ((post_date<'" + lastPostDate.getTime() +
                    "') OR (post_date='" + lastPostDate.getTime() + "' AND post_time<'" + lastPostTime + "'))) ORDER BY post_date DESC, post_time ASC";
        } else {
            result = " WHERE ((post_date<'" + lastPostDate.getTime() +
                    "') OR (post_date='" + lastPostDate.getTime() + "' AND post_time<'" + lastPostTime + "')) ORDER BY post_date DESC, post_time ASC";
        }
        return result;
    }

    //can be util
    private void getJobTitlesList(HttpServletRequest request, HttpServletResponse response) {
        try {
            // create a connection to the database
            Connection con = ServletUtils.getConnection();

            Statement stmt = con.createStatement();
            String quary = " SELECT *"
                    + " FROM jobTitles"
                    + " ORDER BY jobTitle";

            ResultSet rs = stmt.executeQuery(quary);

            ArrayList<String> jobsTypes = new ArrayList<String>();

            while (rs.next()) {
                jobsTypes.add(rs.getString("jobTitle"));
            }

            ServletUtils.returnJson(request, response, jobsTypes);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    public String GetCurentDate() {
        java.util.Date date = Calendar.getInstance().getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(date);
    }


}
