package Logic;

import Utils.ServletUtils;

import java.sql.*;
import java.util.ArrayList;


public class JobOffer {
    public Integer jobId;
    public Integer business_id;
    public String name;
    public String details;
    public Date startDate;
    public Date endDate;
    public String jobLocation;
    public String startTime;
    public String endTime;
    public String requirements;
    public Date postDate;
    public String postTime;

    public JobOffer(int _jobId, int _businessId, String _name, String _details, Date _startDate, String _startTime, Date _endDate,
                    String _endTime, String _jobLocation, String _requirements, Date _postDate, String _postTime) {
        jobId = _jobId;
        business_id = _businessId;
        name = _name;
        details = _details;
        startDate = _startDate;
        endDate = _endDate;
        jobLocation = _jobLocation;
        startTime = _startTime;
        endTime = _endTime;
        requirements = _requirements;
        postDate = _postDate;
        postTime = _postTime;
    }

    public Integer getBusinessId() {
        return business_id;
    }

    static public ArrayList<JobOffer> getJobOffersFromDB(Integer id) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            Class.forName("org.sqlite.JDBC");
            String url = ServletUtils.getDbPath();
            // create a connection to the database
            con = DriverManager.getConnection(url);
            String businessId = id.toString();

            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM job_offers"
                    + " WHERE business_id='" + businessId + "'";
            rs = stmt.executeQuery(SELECT);

            ArrayList<JobOffer> jobOffers = new ArrayList<JobOffer>();
            int index = 0;
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
                                rs.getDate("post_date"),
                                rs.getString("post_time")));
            }
            return jobOffers;
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

    static public JobOffer getJobOfferByIdFromDB(Integer _jobId) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        JobOffer jobOffer = null;
        try {
            Class.forName("org.sqlite.JDBC");
            String url = ServletUtils.getDbPath();
            // create a connection to the database
            con = DriverManager.getConnection(url);
            String jobId = _jobId.toString();

            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM job_offers"
                    + " WHERE id='" + jobId + "'";
            rs = stmt.executeQuery(SELECT);
            int index = 0;
            while (rs.next()) {
                jobOffer = new JobOffer(
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
                        rs.getDate("post_date"),
                        rs.getString("post_time"));
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
        return jobOffer;
    }

    public static void updateJobOffer(JobOffer job) {
        Connection con = null;
        Statement stmt = null;

        try {
            Class.forName("org.sqlite.JDBC");
            String url = ServletUtils.getDbPath();
            // create a connection to the database
            con = DriverManager.getConnection(url);

            stmt = con.createStatement();
            String UPDATE = " UPDATE job_offers" +
                    " SET " +
                    "id='" + job.jobId.toString() + "', " +
                    "business_id='" + job.business_id.toString() + "', " +
                    "details='" + job.details + "', " +
                    "start_date='" + job.startDate.getTime()    + "', " +
                    "end_date='" + job.endDate.getTime()       + "', " +
                    "location='" + job.jobLocation + "', " +
                    "start_time='" + job.startTime + "', " +
                    "end_time='" + job.endTime + "', " +
                    "requirements='" + job.requirements + "', " +
                    "name='" + job.name + "', " +
                    "post_date='" + job.postDate.getTime()      + "', " +
                    "post_time='" + job.postTime + "' " +
                    "WHERE id='" + job.jobId.toString() + "' ";


            int res = stmt.executeUpdate(UPDATE);


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
}
