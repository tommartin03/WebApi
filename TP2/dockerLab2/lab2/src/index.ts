interface Person {
    id: number;
    firstname: string;
    lastname: string;
    age: number;
}

async function fetchPeople(
    lastname: string | undefined,
    firstname: string | undefined,
    age: number | undefined,
    deleteFlag: boolean
): Promise<void> {
    try {
        const response = await fetch("http://localhost:8000/api/people");
        if (!response.ok) throw new Error(`Erreur: ${response.status}`);

        const data = await response.json();
        const peopleArray: Person[] = data.member;

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
                await deletePerson(person); // Delete person instead of updating
            }
            console.log(`Les personnes sélectionnées ont été supprimées.`);
        } else {
            // Otherwise, update the people (increment age)
            for (const person of filteredPeople) {
                if (!person.id || person.age === undefined) {
                    console.log("Personne invalide :", person);
                    continue;
                }

                person.age += 1; // Update the person's age
                console.log("Mise à jour de :", person);

                await updatePerson(person); // Update age instead of deleting
            }
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}

async function updatePerson(person: Person): Promise<void> {
    try {
        const response = await fetch(`http://localhost:8000/api/people/${person.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/merge-patch+json"
            },
            body: JSON.stringify({ age: person.age })
        });

        if (response.ok) {
            console.log(`Les données de ${person.lastname} ont été mises à jour avec succès !`);
        } else {
            const errorText = await response.text();
            console.error(`Erreur lors de la mise à jour des données de ${person.lastname} :`, errorText);
        }
    } catch (error) {
        console.error("Erreur lors de la requête PATCH :", error);
    }
}

async function deletePerson(person: Person): Promise<void> {
    try {
        const response = await fetch(`http://localhost:8000/api/people/${person.id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            console.log(`La personne ${person.firstname} ${person.lastname} a été supprimée avec succès !`);
        } else {
            const errorText = await response.text();
            console.error(`Erreur lors de la suppression de ${person.firstname} ${person.lastname} :`, errorText);
        }
    } catch (error) {
        console.error("Erreur lors de la requête DELETE :", error);
    }
}

// Example of how to use the function
const args = process.argv.slice(2); // Get command-line arguments
const lastname = args.find(arg => arg.startsWith('--lastname='))?.split('=')[1];
const firstname = args.find(arg => arg.startsWith('--firstname='))?.split('=')[1];
const age = args.find(arg => arg.startsWith('--age=')) ? parseInt(args.find(arg => arg.startsWith('--age='))?.split('=')[1]!) : undefined;
const deleteFlag = args.includes('--delete'); // Check if --delete option is passed

fetchPeople(lastname, firstname, age, deleteFlag);
