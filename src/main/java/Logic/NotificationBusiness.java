package Logic;

import Utils.ServletUtils;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class NotificationBusiness {
    public enum Type {
        USER_NOTIFICATION,
        BUSINESS_NOTIFICATION
    }

    public Integer id;
    public Integer sender_id;
    public String sender_name;
    public Integer reciver_id;
    public String reciver_name;
    public Integer type;
    public Integer business_id;
    public String business_name;
    public String business_profile_pic;
    public Boolean isRead;
    public Boolean isApproved;
    public Integer job_id;
    public String job_name;
    public Integer apply_id;
    public Integer isPending;

    public NotificationBusiness(ResultSet rs) {
        try {
            id = rs.getInt("id");
            sender_id = rs.getInt("sender_id");
            reciver_id = rs.getInt("reciver_id");
            type = rs.getInt("type");
            business_id = rs.getInt("business_id");
            isRead = rs.getInt("is_read") == 1;
            isApproved = rs.getInt("is_approved") == 1;
            job_id = rs.getInt("job_id");
            apply_id = rs.getInt("apply_id");
            isPending=rs.getInt("is_pending");
        } catch (SQLException e) {
            e.printStackTrace();
        }
        UserData user = UserData.getUserInfoFromDbById(sender_id.toString());
        sender_name = user.fname + " " + user.lname;
        user = UserData.getUserInfoFromDbById(reciver_id.toString());
        reciver_name = user.fname + " " + user.lname;
        Bussiness business = Bussiness.getBusinessInfoById(business_id.toString());
        business_name = business.name;
        business_profile_pic = business.profilePicUrl;
        JobOffer job = JobOffer.getJobOfferByIdFromDB(job_id);
        job_name = job.name;

    }

    public static ArrayList<NotificationBusiness> getUserNotificationsByUserIdFromDb(Integer userId) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            stmt = con.createStatement();

            String SELECT = " SELECT *" +
                    " FROM notifications" +
                    " WHERE reciver_id='" + userId + "' ";

            rs = stmt.executeQuery(SELECT);
            ArrayList<NotificationBusiness> notificationsList = new ArrayList<>();
            ArrayList<Integer> notificationsToMakeRead = new ArrayList<>();
            while (rs.next()) {
                NotificationBusiness n = new NotificationBusiness(rs);
                notificationsList.add(n);

                notificationsToMakeRead.add(n.id);
            }
            for (Integer x : notificationsToMakeRead) {
                String UPDATE = "UPDATE notifications SET" +
                        " is_read = 1" +
                        " WHERE id = " + x + ";";
                stmt.addBatch(UPDATE);
            }
            stmt.executeBatch();
            return notificationsList;
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
}
