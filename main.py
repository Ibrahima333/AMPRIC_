from flask import Flask ,render_template , request,url_for,redirect,flash
from flask_mail import Mail, Message
import pymysql
from dotenv import load_dotenv
import os



# Charger les variables d'environnement
load_dotenv()
mail = Mail()

app = Flask(__name__)
app.secret_key = os.urandom(24)
#connection a mysql
def mysql():
    try:
        return pymysql.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
            cursorclass=pymysql.cursors.DictCursor
        )
    except Exception as e:
        print("ERREUR MYSQL:", e)
        raise

#configuration de Flask-Mail
def configure_mail(app):
    app.config['MAIL_SERVER'] = os.getenv("MAIL_SERVER")
    app.config['MAIL_PORT'] = int(os.getenv("MAIL_PORT"))
    app.config['MAIL_USE_TLS'] = os.getenv("MAIL_USE_TLS") == "True"
    app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
    app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")

    mail.init_app(app)

configure_mail(app) 

#verification_doublons numero de telephone 
def check_duplicate_number(tel) :
    connexion= mysql()
    cursor = connexion.cursor()
    query = """ select telephone from utilisateurs where telephone = %s"""
    cursor.execute(query,(tel))
    resultat = cursor.fetchone() 
    cursor.close()
    connexion.close()
    if resultat :
        return True
    else :
        return False
    
def check_duplicate_email(email) :
    connexion= mysql()
    cursor = connexion.cursor()
    query = """select email from utilisateurs where email = %s"""
    cursor.execute(query,(email))
    resultat = cursor.fetchone() 
    cursor.close()
    connexion.close()
    if resultat :
        return True
    else :
        return False
    
    
@app.route('/',methods=["POST","GET"])
def home():
    if request.method =='POST' :
        nom = request.form.get("nom")
        prenom = request.form.get("prenom")
        email = request.form.get("email")
        comment =request.form.get("message")
        tel = request.form.get("tel")
        
        if check_duplicate_number(tel) :
            erreur = "Ce numéro est déjà utilisé. Veuillez saisir un autre."
            return render_template("index.html", erreur=erreur)
        
        if check_duplicate_email(email) :
            erreur = "Cet email est déjà utilisé. Veuillez saisir un autre."
            return render_template("index.html", erreur=erreur)
            
        conexion = mysql()
        cursor = conexion.cursor()
        query = """insert into utilisateurs (nom,prenom,telephone,email,comment) values(%s,%s,%s,%s,%s)"""
        cursor.execute(query,(nom,prenom,tel,email,comment))
        conexion.commit()
        cursor.close()
        conexion.close()
        flash("Vos informations ont été enregistrées avec succès. Notre équipe vous contactera dans les plus brefs délais." , "success")
        return redirect(url_for("home"))
    
    else:
        return render_template("index.html")
    
# route pour la page d'objectifs
@app.route('/objectifs')
def objectifs():
    return render_template("objectifs.html")


# route pour la page de contact
@app.route('/contact',methods=["POST","GET"])
def contact():
    if request.method == "POST" :
        nom = request.form.get("nom")
        email = request.form.get("email")
        message = request.form.get("message")
        
        msg = Message(
            subject=f"Message de {nom}",
            sender=email,
            recipients=["keitasoryibrahima1234@gmail.com"]
        )
        msg.body = f"Message de {nom} : {message}"
        mail.send(msg)
        flash("Votre message a été envoyé avec succès.", "success")
    return render_template("contact.html") 

@app.route('/dashboard')
def dashboard():
    connexion = mysql()
    cursor = connexion.cursor()
    query = "SELECT id, nom, prenom, telephone, email, comment FROM utilisateurs"
    cursor.execute(query)
    utilisateurs = cursor.fetchall()
    cursor.close()
    connexion.close()

    colonnes = ["id", "nom", "prenom", "telephone", "email", "comment"]
    print(utilisateurs)
    return render_template("dashbord.html", users=utilisateurs, columns=colonnes)
    
if __name__ == "__main__":
    app.run(debug=True)
