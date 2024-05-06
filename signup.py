from flask import Flask, request, redirect, url_for, render_template
from flask_sqlalchemy import SQLAlchemy
from flask import jsonify


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root123@localhost/bmi_calculator'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username

class UserDetails(db.Model):
    __tablename__ = 'user_details'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    height = db.Column(db.Float, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    bmi_score = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<UserDetails {self.username}>'


@app.route('/signup', methods=['POST'])
def signup():
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']

    # Check if the username or email already exists
    if User.query.filter_by(username=username).first() is not None:
        return 'Username already exists'
    if User.query.filter_by(email=email).first() is not None:
        return 'Email already exists'

    # Create a new User object
    new_user = User(username=username, email=email, password=password)

    # Add the new user to the database session
    db.session.add(new_user)

    # Commit the session to save the changes to the database
    db.session.commit()

    return 'Sign Up Successful'

@app.route('/signin', methods=['POST'])
def signin():
    username = request.form['username']
    password = request.form['password']

    # Check if the user exists and the password matches
    user = User.query.filter_by(username=username).first()
    if user is None or user.password != password:
        return 'Invalid username or password'

    # Redirect to the home page or any other page upon successful sign-in
    return render_template('index.html', username=username)

@app.route('/save_bmi', methods=['POST'])
def save_bmi():
    # Check if the request contains JSON data
    if request.is_json:
        data = request.get_json()

        # Extract data from JSON payload
        username = data.get('username')
        height = float(data.get('height'))
        weight = float(data.get('weight'))
        bmi_score = calculate_bmi(height, weight)

        # Save BMI data to the database
        new_bmi_data = UserDetails(username=username, height=height, weight=weight, bmi_score=bmi_score)
        db.session.add(new_bmi_data)
        db.session.commit()

        return jsonify({'message': 'BMI data saved successfully'})
    else:
        return jsonify({'error': 'Invalid request format'}), 400

@app.route('/delete_user', methods=['POST'])
def delete_user():
    # Check if the request contains JSON data
    if request.is_json:
        data = request.json  # Get JSON data directly
        print("JSON data received:", data)

        # Extract username from JSON payload
        username = data.get('username')

        # Check if the user exists
        user = User.query.filter_by(username=username).first()
        if user:
            # Delete the user details first
            UserDetails.query.filter_by(username=username).delete()

            # Delete the user
            db.session.delete(user)
            db.session.commit()

            return jsonify({'message': 'User and details deleted successfully'})
        else:
            return jsonify({'error': 'User does not exist'}), 404
    else:
        return jsonify({'error': 'Invalid request format'}), 400


def calculate_bmi(height, weight):
    # Calculate BMI score
    bmi_score = weight / (height ** 2)
    return bmi_score

@app.route('/')
@app.route('/home.html')
def home():
    # Render the home page template
    return render_template('index.html')


@app.route('/about.html')
def about():
    return render_template('about.html')

@app.route('/contact.html')
def contact():
    return render_template('contact.html')

@app.route('/consult.html')
def consult():
    return render_template('consult.html')

@app.route('/calorie.html')
def calorie():
    return render_template('calorie.html')

@app.route('/learn.html')
def learn():
    return render_template('learn.html')

if __name__ == '__main__':
    app.run(debug=True)
