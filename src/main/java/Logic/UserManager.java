package Logic;

import Utils.ServletUtils;

import java.sql.*;
import java.util.HashMap;

import java.util.Map;

/**
 * Created by Ron on 19-May-17.
 */
public class UserManager {
    private Map<String, String> SessionsUsersMap;

    public UserManager() {
        SessionsUsersMap = new HashMap<String, String>();
    }

    public void addNewUserSession(String userNameFromSession, String sessionId) {
        if (SessionsUsersMap.containsKey(sessionId) == false) {
            SessionsUsersMap.put(sessionId, userNameFromSession);
        }
    }

    public String getUserEmailFromSession(String sessionId)  {
        String email = SessionsUsersMap.get(sessionId);
        return email;
    }
}
