package fr.univorleans.webapis;

import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;

import org.json.JSONObject;

class Person {
    private int id;
    private String firstname;
    private String lastname;
    private int age;
    private boolean isAlive;
    private List<Phone> phoneNumbers;

    public Person(int id, String firstname, String lastname, int age, boolean isAlive, List<Phone> phoneNumbers) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.age = age;
        this.isAlive = isAlive;
        this.phoneNumbers = phoneNumbers;
    }

    public int getId() {
        return id;
    }

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public int getAge() {
        return age;
    }

    public boolean isAlive() {
        return isAlive;
    }

    public List<Phone> getPhoneNumbers() {
        return phoneNumbers;
    }

    @Override
    public String toString() {
        return firstname + " " + lastname + ", age: " + age + ", Alive: " + isAlive + ", Phones: " + phoneNumbers;
    }

    // Factory method to create a Person from a JSONObject
    public static Person fromJson(JSONObject json) {
        int id = json.optInt("id", -1); // ID par défaut si absent
        String firstname = json.getString("firstname");
        String lastname = json.getString("lastname");
        int age = json.getInt("age");
    
        // Vérifier la présence de "isAlive", si absent on utilise "false" comme valeur par défaut
        boolean isAlive = json.optBoolean("isAlive", false); // Valeur par défaut : false
    
        List<Phone> phones = new ArrayList<>();
        if (json.has("phoneNumbers")) {
            JSONArray phoneArray = json.getJSONArray("phoneNumbers");
            for (int i = 0; i < phoneArray.length(); i++) {
                phones.add(Phone.fromJson(phoneArray.getJSONObject(i)));
            }
        }
    
        return new Person(id, firstname, lastname, age, isAlive, phones);
    }
}
