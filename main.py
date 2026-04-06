from flask import Flask ,render_template , request,url_for,redirect,flash,session,abort
from flask_mail import Mail, Message
import pymysql
from dotenv import load_dotenv
import os
from math import ceil
from functools import wraps
import secrets

# Charger les variables d'environnement
load_dotenv()
mail = Mail()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", os.urandom(24))


def generate_csrf_token():
    token = session.get("_csrf_token")
    if not token:
        token = secrets.token_urlsafe(32)
        session["_csrf_token"] = token
    return token


def validate_csrf():
    session_token = session.get("_csrf_token")
    form_token = request.form.get("csrf_token", "")
    if not session_token or not form_token or not secrets.compare_digest(session_token, form_token):
        abort(400, description="Jeton CSRF invalide ou manquant.")


@app.before_request
def csrf_protect():
    if request.method == "POST":
        validate_csrf()


app.jinja_env.globals["csrf_token"] = generate_csrf_token

def get_admin_credentials():
    return {
        "username": os.getenv("ADMIN_USERNAME"),
        "password": os.getenv("ADMIN_PASSWORD"),
    }


def login_required(view_func):
    @wraps(view_func)
    def wrapped_view(*args, **kwargs):
        if not session.get("dashboard_authenticated"):
            flash("Veuillez vous connecter pour accéder au dashboard.", "error")
            return redirect(url_for("dashboard_login", next=request.path))
        return view_func(*args, **kwargs)

    return wrapped_view
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


@app.errorhandler(400)
def bad_request(error):
    description = getattr(error, "description", "")
    if "CSRF" in description:
        flash("La session du formulaire a expiré ou la requête est invalide. Veuillez réessayer.", "error")
        return redirect(request.referrer or url_for("home"))
    return description or "Requête invalide.", 400
 

#verification_doublons numero de telephone 
def check_duplicate_number(tel, exclude_id=None) :
    connexion= mysql()
    cursor = connexion.cursor()
    query = """select id from utilisateurs where telephone = %s"""
    params = [tel]
    if exclude_id is not None:
        query += " and id != %s"
        params.append(exclude_id)
    cursor.execute(query, tuple(params))
    resultat = cursor.fetchone() 
    cursor.close()
    connexion.close()
    if resultat :
        return True
    else :
        return False
    
def check_duplicate_email(email, exclude_id=None) :
    connexion= mysql()
    cursor = connexion.cursor()
    query = """select id from utilisateurs where email = %s"""
    params = [email]
    if exclude_id is not None:
        query += " and id != %s"
        params.append(exclude_id)
    cursor.execute(query, tuple(params))
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


@app.route('/activite')
def activite():
    return render_template("activite.html")

#route pour la page de dons
@app.route('/don')
def don():
    return render_template("don.html")


# route pour la page de contact
@app.route('/contact',methods=["POST","GET"])
def contact():
    if request.method == "POST" :
        nom = request.form.get("nom")
        email = request.form.get("email")
        message = request.form.get("message")
        
        msg = Message(
            subject=f"Message de {nom}",
            sender=app.config['MAIL_USERNAME'],
            recipients=["contactampric@gmail.com"]
        )
        msg.body = f"""
                    Nom: {nom}
                    Email: {email}

                    Message:
                    {message}
                    """
        mail.send(msg)
        flash("Votre message a été envoyé avec succès.", "success")
    return render_template("contact.html") 


@app.route('/admin/login', methods=["GET", "POST"])
def dashboard_login():
    if session.get("dashboard_authenticated"):
        return redirect(url_for("dashboard"))

    next_url = request.args.get("next", "")
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "").strip()
        next_url = request.form.get("next", "")
        credentials = get_admin_credentials()

        if username == credentials["username"] and password == credentials["password"]:
            session["dashboard_authenticated"] = True
            return redirect(next_url or url_for("dashboard"))

        flash("Identifiants incorrects.", "error")

    return render_template("dashboard_login.html", next_url=next_url)


@app.route('/admin/logout', methods=["POST"])
@login_required
def dashboard_logout():
    session.pop("dashboard_authenticated", None)
    flash("Déconnexion réussie.", "success")
    return redirect(url_for("dashboard_login"))


@app.route('/dashboard', methods=["GET", "POST"])
@login_required
def dashboard():
    if request.method == "POST":
        nom = request.form.get("nom", "").strip()
        prenom = request.form.get("prenom", "").strip()
        telephone = request.form.get("telephone", "").strip()
        email = request.form.get("email", "").strip()
        comment = request.form.get("comment", "").strip()

        if not all([nom, prenom, telephone, email]):
            flash("Les champs nom, prénom, téléphone et email sont obligatoires.", "error")
            return redirect(url_for("dashboard"))

        if check_duplicate_number(telephone):
            flash("Ce numéro est déjà utilisé.", "error")
            return redirect(url_for("dashboard"))

        if check_duplicate_email(email):
            flash("Cet email est déjà utilisé.", "error")
            return redirect(url_for("dashboard"))

        connexion = mysql()
        cursor = connexion.cursor()
        query = """
            insert into utilisateurs (nom, prenom, telephone, email, comment)
            values (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (nom, prenom, telephone, email, comment))
        connexion.commit()
        cursor.close()
        connexion.close()
        flash("Utilisateur ajouté avec succès.", "success")
        return redirect(url_for("dashboard"))

    search = request.args.get("search", "").strip()
    page = request.args.get("page", 1, type=int)
    page = max(page, 1)
    per_page = 7
    offset = (page - 1) * per_page
    search_clause = ""
    search_params = []

    if search:
        search_clause = """
            WHERE nom LIKE %s
            OR prenom LIKE %s
            OR telephone LIKE %s
            OR email LIKE %s
            OR comment LIKE %s
        """
        search_value = f"%{search}%"
        search_params = [search_value] * 5

    connexion = mysql()
    cursor = connexion.cursor()
    count_query = f"SELECT COUNT(*) AS total FROM utilisateurs {search_clause}"
    cursor.execute(count_query, tuple(search_params))
    total_users = cursor.fetchone()["total"]

    query = f"""
        SELECT id, nom, prenom, telephone, email, comment, date_inscription
        FROM utilisateurs
        {search_clause}
        ORDER BY id DESC
        LIMIT %s OFFSET %s
    """
    cursor.execute(query, tuple(search_params + [per_page, offset]))
    utilisateurs = cursor.fetchall()

    edit_id = request.args.get("edit", type=int)
    editing_user = None
    if edit_id:
        cursor.execute(
            """
            SELECT id, nom, prenom, telephone, email, comment
            FROM utilisateurs
            WHERE id = %s
            """,
            (edit_id,),
        )
        editing_user = cursor.fetchone()

    cursor.close()
    connexion.close()

    total_pages = max(ceil(total_users / per_page), 1)
    if page > total_pages:
        return redirect(url_for("dashboard", page=total_pages, search=search))

    return render_template(
        "dashbord.html",
        users=utilisateurs,
        editing_user=editing_user,
        current_page=page,
        total_pages=total_pages,
        per_page=per_page,
        total_users=total_users,
        search=search,
    )


@app.route('/dashboard/<int:user_id>/update', methods=["POST"])
@login_required
def update_user(user_id):
    nom = request.form.get("nom", "").strip()
    prenom = request.form.get("prenom", "").strip()
    telephone = request.form.get("telephone", "").strip()
    email = request.form.get("email", "").strip()
    comment = request.form.get("comment", "").strip()
    page = request.form.get("page", 1, type=int)
    search = request.form.get("search", "").strip()

    if not all([nom, prenom, telephone, email]):
        flash("Les champs nom, prénom, téléphone et email sont obligatoires.", "error")
        return redirect(url_for("dashboard", page=page, edit=user_id, search=search))

    if check_duplicate_number(telephone, exclude_id=user_id):
        flash("Ce numéro est déjà utilisé.", "error")
        return redirect(url_for("dashboard", page=page, edit=user_id, search=search))

    if check_duplicate_email(email, exclude_id=user_id):
        flash("Cet email est déjà utilisé.", "error")
        return redirect(url_for("dashboard", page=page, edit=user_id, search=search))

    connexion = mysql()
    cursor = connexion.cursor()
    query = """
        UPDATE utilisateurs
        SET nom = %s, prenom = %s, telephone = %s, email = %s, comment = %s
        WHERE id = %s
    """
    cursor.execute(query, (nom, prenom, telephone, email, comment, user_id))
    connexion.commit()
    cursor.close()
    connexion.close()
    flash("Utilisateur mis à jour avec succès.", "success")
    return redirect(url_for("dashboard", page=page, search=search))


@app.route('/dashboard/<int:user_id>/delete', methods=["POST"])
@login_required
def delete_user(user_id):
    page = request.form.get("page", 1, type=int)
    search = request.form.get("search", "").strip()
    connexion = mysql()
    cursor = connexion.cursor()
    cursor.execute("DELETE FROM utilisateurs WHERE id = %s", (user_id,))
    connexion.commit()
    cursor.close()
    connexion.close()
    flash("Utilisateur supprimé avec succès.", "success")
    return redirect(url_for("dashboard", page=page, search=search))
    
if __name__ == "__main__":
    app.run(debug=True)
