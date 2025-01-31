package fr.univorleans.webapis;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import org.json.JSONArray;
import org.json.JSONObject;

public class App {
    public static void main(String[] args) {
        try {
            HttpClient httpClient = HttpClient.newBuilder()
                    .version(HttpClient.Version.HTTP_1_1)
                    .build();

            // 1. Récupérer la liste des personnes
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:8000/api/people"))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new Exception("Erreur lors de la récupération des personnes.");
            }

            JSONObject json = new JSONObject(response.body());
            JSONArray array = json.getJSONArray("member");

            // 2. Parcourir chaque personne et incrémenter l'âge
            for (int i = 0; i < array.length(); i++) {
                JSONObject personJson = array.getJSONObject(i);
                // Créer un objet Person à partir du JSON
                Person person = Person.fromJson(personJson);

                // Incrémenter l'âge
                int newAge = person.getAge() + 1;

                // 3. Mettre à jour l'âge de la personne
                JSONObject updatedPerson = new JSONObject();
                updatedPerson.put("age", newAge);

                // 4. Envoyer la requête PATCH pour mettre à jour l'âge
                String personId = "/api/people/" + person.getId();
                HttpRequest updateRequest = HttpRequest.newBuilder()
                        .uri(URI.create("http://localhost:8000" + personId))
                        .header("Content-Type", "application/merge-patch+json")
                        .method("PATCH", HttpRequest.BodyPublishers.ofString(updatedPerson.toString()))
                        .build();

                HttpResponse<String> updateResponse = httpClient.send(updateRequest, BodyHandlers.ofString());

                if (updateResponse.statusCode() == 200) {
                    System.out.println("Âge mis à jour pour: " + person.getLastname() +
                            ", " + person.getFirstname() + " -> Nouvel âge: " + newAge);
                } else {
                    System.out.println("Échec de la mise à jour pour: " + person.getLastname());
                    System.out.println("Réponse serveur: " + updateResponse.body());
                }
            }
        } catch (Exception e) {
            System.out.println("Le serveur n'a pas répondu correctement.");
            e.printStackTrace();
        }
    }
}
