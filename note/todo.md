# Todo List

1. Installe python 3.4.3

    sudo apt-get install python3

    Python 3 a déjà virtualenv inclu donc pas besoin de l'installer

2. Crée un virtualenv appelé "env" dans le dossier racine du projet s3s (là ou il y a aussi note, report, etc.)

    cd rootProjectFolder
    python3 -m venv env

3. Démarre ton virtualenv

    source env/bin/activate

4. Installe les packages de requirements.txt sur ton virtualenv avec la commande:

    pip install -r requirements.txt

5. Check si tout fonctionne

    cd s3sProject
    python manage.py runserver

    Normalement tu peux aller sur 

        http://127.0.0.1:8000/

    qui sera la page d'accueil, et tu peux aussi aller sur l'interface d'admin:

        http://127.0.0.1:8000/admin


