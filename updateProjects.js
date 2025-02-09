// updateProjects.js
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function updateCollaboratorsField() {
	try {
		const projectsSnapshot = await db.collection('projects').get();

		projectsSnapshot.forEach(async (doc) => {
			const data = doc.data();

			if (!data.hasOwnProperty('collaborators')) {
				const ownerUid = data.owner;
				console.log(
					`Updating project ${doc.id}: Adding collaborators field with owner UID ${ownerUid}`
				);

				await doc.ref.update({
					collaborators: [ownerUid],
				});
			}
		});

		console.log('All applicable projects updated.');
	} catch (error) {
		console.error('Error updating projects:', error);
	}
}

updateCollaboratorsField();
