# Todo

## Requirements

# No full user account management
C'est fait!

# Assume one principal user
C'est fait!

# Principal user can create temporary URLs to invite another user to deposit a file on the service

- Faire le bouton du lien d'upload
- Faire une alerte du lien d'upload (qui pointe vers /bucket?uuid())

# Invited user navigates to URL and sees customized page inviting him to upload file (no registration or authentication necessary)

- ça sera la page /bucket?uuid()

# Principal user is able to see status for each URL generated (file has been uploaded or not) and download the file

- Faire un bouton sur /admin pour télécharger le fichier

## TODOs

### Prioritaire
TODO: Utiliser la page /bucket?uuid=... 
TODO: rendre ça dynamique, il faudra mettre dans la var?
TODO: Créer un fichier plutôt que du texte
TODO: Lier la page bucket avec la fonction d'upload Ajax
TODO: Status
TODO: Préparer le déploiement
TODO: Préparer la présentation
TODO: Préparer la feuille de résumé
TODO: Prise en charge des liens expirés (status == expired)
TODO: Désactivation du bouton "Download file" lorsque le lien est expiré


DONE: Faire le bouton du lien d'upload - Pourrait être amélioré...
DONE: Faire un bouton sur /admin pour télécharger le fichier
DONE: Faire le bouton du lien d'upload
DONE: Faire une alerte du lien d'upload (qui pointe vers /bucket?uuid())
DONE: Faire page /bucket?uuid()

### Secondaire
TODO: Générer un bucket en Python (intégrer s3-script2.py)


