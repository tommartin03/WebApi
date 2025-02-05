"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c;
function fetchPeople(lastname, firstname, age, deleteFlag) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("http://localhost:8000/api/people");
            if (!response.ok)
                throw new Error(`Erreur: ${response.status}`);
            const data = yield response.json();
            const peopleArray = data.member;
            // Filter people based on the given arguments
            let filteredPeople = peopleArray;
            if (lastname) {
                filteredPeople = filteredPeople.filter(person => person.lastname === lastname);
            }
            if (firstname) {
                filteredPeople = filteredPeople.filter(person => person.firstname === firstname);
            }
            if (age !== undefined) {
                filteredPeople = filteredPeople.filter(person => person.age === age);
            }
            // If no people found, display a message
            if (filteredPeople.length === 0) {
                console.log("Aucune personne trouvée avec ces critères.");
                return;
            }
            // If --delete flag is passed, delete the selected people
            if (deleteFlag) {
                for (const person of filteredPeople) {
                    yield deletePerson(person); // Delete person instead of updating
                }
                console.log(`Les personnes sélectionnées ont été supprimées.`);
            }
            else {
                // Otherwise, update the people (increment age)
                for (const person of filteredPeople) {
                    if (!person.id || person.age === undefined) {
                        console.log("Personne invalide :", person);
                        continue;
                    }
                    person.age += 1; // Update the person's age
                    console.log("Mise à jour de :", person);
                    yield updatePerson(person); // Update age instead of deleting
                }
            }
        }
        catch (error) {
            console.error("Erreur :", error);
        }
    });
}
function updatePerson(person) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://localhost:8000/api/people/${person.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json"
                },
                body: JSON.stringify({ age: person.age })
            });
            if (response.ok) {
                console.log(`Les données de ${person.lastname} ont été mises à jour avec succès !`);
            }
            else {
                const errorText = yield response.text();
                console.error(`Erreur lors de la mise à jour des données de ${person.lastname} :`, errorText);
            }
        }
        catch (error) {
            console.error("Erreur lors de la requête PATCH :", error);
        }
    });
}
function deletePerson(person) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://localhost:8000/api/people/${person.id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                console.log(`La personne ${person.firstname} ${person.lastname} a été supprimée avec succès !`);
            }
            else {
                const errorText = yield response.text();
                console.error(`Erreur lors de la suppression de ${person.firstname} ${person.lastname} :`, errorText);
            }
        }
        catch (error) {
            console.error("Erreur lors de la requête DELETE :", error);
        }
    });
}
// Example of how to use the function
const args = process.argv.slice(2); // Get command-line arguments
const lastname = (_a = args.find(arg => arg.startsWith('--lastname='))) === null || _a === void 0 ? void 0 : _a.split('=')[1];
const firstname = (_b = args.find(arg => arg.startsWith('--firstname='))) === null || _b === void 0 ? void 0 : _b.split('=')[1];
const age = args.find(arg => arg.startsWith('--age=')) ? parseInt((_c = args.find(arg => arg.startsWith('--age='))) === null || _c === void 0 ? void 0 : _c.split('=')[1]) : undefined;
const deleteFlag = args.includes('--delete'); // Check if --delete option is passed
fetchPeople(lastname, firstname, age, deleteFlag);
