package fr.univorleans.webapis;

import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

class Phone {
    private String number;
    private String type;

    public Phone(String number, String type) {
        this.number = number;
        this.type = type;
    }

    public String getNumber() {
        return number;
    }

    public String getType() {
        return type;
    }

    @Override
    public String toString() {
        return type + ": " + number;
    }

    // Factory method to create a Phone from a JSONObject
    public static Phone fromJson(JSONObject json) {
        return new Phone(
                json.getString("number"),
                json.optString("type", "unknown") // Default type if missing
        );
    }
}

