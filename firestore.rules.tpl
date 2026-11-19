rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function connecte() { return request.auth != null && request.auth.token.email != null; }
    function admin() { return connecte() && request.auth.token.email.lower() == "__ADMIN__"; }
    function membre() { return admin() || (connecte() && exists(/databases/$(database)/documents/membres/$(request.auth.token.email.lower()))); }

    match /formations/{id} { allow read, write: if membre(); }
    match /visites/{id}    { allow read, write: if membre(); }
    match /photos/{parent}/items/{id} { allow read, write: if membre(); }
    match /profils/{uid}   { allow read: if membre(); allow write: if membre() && request.auth.uid == uid; }
    match /membres/{email} {
      allow read: if admin() || (connecte() && request.auth.token.email.lower() == email);
      allow write: if admin();
    }
  }
}
