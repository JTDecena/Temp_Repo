import secrets
import os
from flask import current_app, session
from flask import Blueprint, render_template, url_for, flash, redirect, request, jsonify
from BookingSystem import db, bcrypt, mail
from BookingSystem.forms import TravelerLoginForm, TravelerRegistrationForm, TravelerRequestResetForm, TravelerResetPasswordForm, UpdateAccountForm
from BookingSystem.models import User, TourOperator , send_confirmation_email
from flask_login import login_user, current_user, logout_user, login_required 
from werkzeug.utils import secure_filename
from BookingSystem.models import Availability
from werkzeug.security import check_password_hash, generate_password_hash
from BookingSystem.models import ReviewsRating, ReviewImages  #!!!!!
from sqlalchemy import func   #!!!!!
from BookingSystem.models import User, TourOperator, TourGuide, TourPackage, EstimatedPrice, Inclusion, Exclusion, Itinerary


#from flask_mail import Message


main = Blueprint('main', __name__)  # Ensure the 'main' blueprint is set


@main.route('/')
@main.route('/home')
def home():
    return render_template('home.html')



# TRAVELER LOGIN

@main.route('/traveler_login', methods=['GET', 'POST'])
def traveler_login():
    # If someone is already logged in, log them out to avoid session conflicts
    if current_user.is_authenticated:
        logout_user()
        print(f"Previous user logged out. Current user (should be anonymous): {current_user}")

    # form = TravelerLoginForm()
    # if form.validate_on_submit():
    #     user = (
    #         UserAdmin.query.filter_by(email=form.email.data).first() or
    #         UserTourOperator.query.filter_by(email=form.email.data).first() or
    #         UserTraveler.query.filter_by(email=form.email.data).first() or
    #         UserTourGuide.query.filter_by(email=form.email.data).first()
    #     )
        
    form = TravelerLoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user:
            if user.role == 'Admin':
            # Process as Admin
                pass  # Replace with actual logic
            elif user.role == 'TourOperator':
            # Process as Tour Operator
                pass  # Replace with actual logic
            elif user.role == 'Traveler':
            # Process as Traveler
                pass  # Replace with actual logic
            elif user.role == 'TourGuide':
            # Process as Tour Guide
                pass  # Replace with actual logic
        

        if user:
            print(f"User found: {user.email}, Role: {user.role}")

            if bcrypt.check_password_hash(user.password, form.password.data):
                # Log out any previous session
                logout_user()
                print(f"Logged out previous user. Current user: {current_user}")
                
                # Log in the current user
                login_user(user)
                print(f"Logged in user: {user.email}, Role: {user.role}, Session: {session}")

                # Handle role-based redirection
                role_redirects = {
                    'admin': 'admin.admin_dashboard',
                    'touroperator': 'touroperator.touroperator_dashboard',
                    'traveler': 'main.traveler_dashboard',
                    'tourguide': 'tourguide.tourguide_dashboard',
                }

                redirect_url = url_for(role_redirects.get(user.role, 'main.home'))
                print(f"Redirecting to: {redirect_url}") 
                return redirect(redirect_url)
                
            else:
                flash('Invalid password. Please try again.', 'danger')
        else:
            flash('No account found with that email.', 'danger')

    return render_template('traveler_login.html', title='Traveler Login', form=form)




# TRAVELER REGISTER 
@main.route('/traveler_register', methods=['GET', 'POST'])
def traveler_register():
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    form = TravelerRegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        new_traveler = User(
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            nationality=form.nationality.data,
            email=form.email_address.data,
            password=hashed_password,
            profile_img='default.jpg',
            role='traveler',
             
        )
        db.session.add(new_traveler)
        db.session.commit()
        send_confirmation_email(new_traveler)
        flash('Registration successful! Please confirm your email to complete the process.', 'info')
        return redirect(url_for('main.pending_confirmation'))
    else:
        print(form.errors)
    return render_template('traveler_register.html', title='Traveler Register', form=form)


@main.route('/pending_confirmation')
def pending_confirmation():
    return render_template('pending_confirmation.html') 







#CONFIRMATION EMAIL FOR TRAVELER
@main.route('/confirm_email/<token>')
def confirm_email(token):
    user = User.verify_confirmation_token(token)
    if not user:
        user = User.verify_confirmation_token(token)
    if user is None:
        flash('The confirmation link is invalid or has expired.', 'warning')
        return redirect(url_for('main.home'))
    user.confirmed = True
    db.session.commit()
    flash('Your email has been confirmed! You can now log in.', 'success')
    if isinstance(user, User):
        return redirect(url_for('main.traveler_login'))
    else:
        return redirect(url_for('main.tourguide_login'))
    

    


# RESET PASSWORD FOR TRAVELER
@main.route('/traveler_reset_password', methods=['GET', 'POST'])
def traveler_reset_request():
    form = TravelerRequestResetForm()
    
    if form.validate_on_submit():
        traveler = User.query.filter_by(email=form.email.data).first()
        if traveler:
            traveler.send_reset_email()
            flash('An email has been sent with instructions to reset your password.', 'info')
            return redirect(url_for('main.traveler_login'))
        else:
            flash('There is no account with that email. Please register first.', 'warning')
            return redirect(url_for('main.traveler_register'))
    
    return render_template('traveler_reset_request.html', title='Reset Password', form=form)



@main.route('/traveler_reset_password/<token>', methods=['GET', 'POST'])
def traveler_reset_token(token):
    traveler = User.verify_reset_token(token)  # Verify the token first
    if traveler is None:
        flash('That is an invalid or expired token', 'warning')
        return redirect(url_for('main.traveler_reset_request')) 

    form = TravelerResetPasswordForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        traveler.password = hashed_password
        db.session.commit()
        flash('Your password has been updated! You are able to log in now.', 'success')
        return redirect(url_for('main.traveler_login'))
    return render_template('traveler_reset_token.html', title='Reset Password', form=form)






# TRAVELER PROFILE
def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(current_app.root_path, 'static/profile_pics', picture_fn)
    form_picture.save(picture_path)
    print(f"Picture saved to: {picture_path}")  # Debugging print statement
    return picture_fn

@main.route('/logout')
@login_required
def logout():
    logout_user()
    # Clear all session data
    session.clear()
    flash('You have been logged out successfully.', 'success')
    return redirect(url_for('main.home'))



    
@main.route('/account', methods=['GET', 'POST'])
@login_required
def account():
    form = UpdateAccountForm()
    if form.picture.data:
        profile_img = save_picture(form.picture.data)
        current_user.profile_img = picture_file
        db.session.commit()  # Save the new image file name to the database
    
    # Use a default image if no image file is set
    profile_img_name = current_user.profile_img if current_user.profile_img else 'default.jpg'
    print(f"Current image file: {profile_img_name}")  # Debugging print statement
    profile_img = url_for('static', filename='profile_pics/' + profile_img_name)
    
    return render_template('account.html', title='Account', profile_img=profile_img, form=form)



@main.route('/booking')
def booking():
    return render_template('booking.html')

@main.route('/tourguide_form')
def tourguideform():
    return render_template('tourguide_form.html')

@main.route('/traveler_dashboard')
def traveler_dashboard():
    # Fetch up to 4 tour packages to display on the homepage
    packages = TourPackage.query.limit(4).all()
    return render_template('traveler_dashboard.html',packages=packages)

@main.route('/tour_package')
def tour_package():
    return render_template('tour_package.html')

# @main.route('/traveler_dashboard')
# def traveler_dashboard():
#     return render_template('traveler_dashboard.html')



@main.route('/view_package/<int:package_id>')
def view_package(package_id):
    try:
        package = TourPackage.query.get_or_404(package_id)
        package_data = {
            "name": package.name,
            "description": package.description,
            "package_img": package.package_img,
            "estimated_prices": [{"description": ep.description, "estimated_price": str(ep.estimated_price)} for ep in package.estimated_prices],
            "inclusions": [{"inclusion": inc.inclusion} for inc in package.inclusions],
            "exclusions": [{"exclusion": exc.exclusion} for exc in package.exclusions],
            "itineraries": [{"title": itin.title, "subtitle": itin.subtitle} for itin in package.itineraries],
        }
        return jsonify(package_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@main.route('/traveler_info', methods=['GET'])
@login_required
def traveler_info():
    user = current_user
    if not user:
        return jsonify({"error": "User not logged in"}), 401

    traveler_info = {
        "name": f"{user.first_name} {user.last_name}",
        "email": user.email,
        "profile_img": url_for('static', filename=f"profile_pics/{user.profile_img}")
    }
    return jsonify(traveler_info)




ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    """Check if the uploaded file is allowed based on its extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_picture(form_picture):
    """Save the picture to the server and return the filename."""
    filename = secure_filename(form_picture.filename)
    filepath = os.path.join(current_app.root_path, 'static/profile_pics', filename)
    form_picture.save(filepath)
    return filename

@main.route('/update_profile_picture', methods=['POST'])
@login_required
def update_profile_picture():
    # Check if a file is part of the request
    if 'profile_picture' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['profile_picture']
    
    # Validate file type
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    # Save file and update database
    try:
        filename = save_picture(file)
        current_user.profile_img = filename  # Update the user's profile image
        db.session.commit()  # Save the change in the database
        image_url = url_for('static', filename='profile_pics/' + filename)  # Generate the URL for the profile picture
        return jsonify({"image_url": image_url})  # Return the URL as JSON response
    except Exception as e:
        print("Error saving profile picture:", e)
        return jsonify({"error": "Failed to save profile picture"}), 500



# @main.route('/get_availability/<int:tour_guide_id>', methods=['GET'])
# def get_availability(tour_guide_id):
#     try:
#         print(f"Fetching availability for tour_guide_id: {tour_guide_id}")
#         availabilities = Availability.query.filter(Availability.tguide_id == tour_guide_id).all()

#         print("Availability records fetched:", availabilities)
#         if not availabilities:
#             print("No availability records found for this tour guide.")

#         data = [
#             {
#                 'date': a.availability_date.strftime('%Y-%m-%d'),
#                 'status': a.status
#             } for a in availabilities
#         ]

#         print("Formatted availability data to return:", data)
#         return jsonify(data)
#     except Exception as e:
#         print("Error in /get_availability route:", e)
#         return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# @main.route('/get_availability/<int:tour_guide_id>', methods=['GET'])
# def get_availability(tour_guide_id):
#     try:
#         print(f"Fetching availability for Tour Guide ID: {tour_guide_id}")
        
#         availabilities = Availability.query.filter_by(tguide_id=tour_guide_id).all()
#         print(f"Availability records: {availabilities}")

#         data = [
#             {
#                 "date": a.availability_date.strftime('%Y-%m-%d'),
#                 "status": a.status
#             } for a in availabilities
#         ]
#         print("Returning data:", data)
#         return jsonify(data)
#     except Exception as e:
#         print("Error:", e)
#         return jsonify({"error": f"An error occurred: {str(e)}"}), 500



@main.route('/update_password', methods=['POST'])
@login_required
def update_password():
    data = request.get_json()
    new_password = data.get('password')
    print("Received password update request")

    try:
        # Update the user's password (hash it if needed)
        current_user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        print("Error updating password:", e)
        return jsonify({"success": False, "message": "Failed to update password."}), 500
   

    
    
 
@main.route('/tour_package/details/<int:package_id>', methods=['GET'])
def get_tour_package_details(package_id):
    try:
        # Fetch package details based on package_id
        package = TourPackage.query.get_or_404(package_id)

        # Prepare the data to return
        package_data = {
            "name": package.name,
            "description": package.description,
            "estimated_prices": [
                {"description": price.description, "estimated_price": price.estimated_price}
                for price in package.estimated_prices
            ],
            "inclusions": [
                {"inclusion": inclusion.inclusion} for inclusion in package.inclusions
            ],
            "exclusions": [
                {"exclusion": exclusion.exclusion} for exclusion in package.exclusions
            ],
            "itineraries": [
                {"title": itinerary.title, "subtitle": itinerary.subtitle} for itinerary in package.itineraries
            ],
            "package_img": package.package_img
        }

        return jsonify(package_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# @main.route('/submit_review', methods=['POST'])
# def submit_review():
#     rating = request.form.get('rating')
#     comment = request.form.get('comment')
#     user_id = current_user.id  # Assuming the user is logged in
#     tour_guide_id = request.form.get('tour_guide_id')  # Pass this as hidden field

#     # Save the review to the database
#     review = ReviewsRating(
#         user_id=user_id,
#         tour_guide_id=tour_guide_id,
#         rating=rating,
#         comment=comment
#     )
#     db.session.add(review)
#     db.session.commit()

#     # Save the image if uploaded
#     if 'review_image' in request.files:
#         image = request.files['review_image']
#         review_image = ReviewImages(rr_id=review.id, img=image.read())
#         db.session.add(review_image)
#         db.session.commit()

#     return jsonify({"success": True})


# @main.route('/submit_review', methods=['POST'])        #!!!!!
# def submit_review():
#     try:
#         rating = float(request.form.get('rating'))
#         comment = request.form.get('comment')
#         tour_guide_id = request.form.get('tour_guide_id')  # Pass tour_guide_id in the form as a hidden input

#         # Ensure all required data is present
#         if not rating or not tour_guide_id:
#             return jsonify({"success": False, "message": "Missing rating or tour guide ID."}), 400

#         # Save the review to the database
#         review = ReviewsRating(
#             user_id=current_user.id,
#             tour_guide_id=tour_guide_id,
#             rating=rating,
#             comment=comment
#         )
#         db.session.add(review)
#         db.session.commit()

#         # Save the image if uploaded
#         if 'review_image' in request.files:
#             image = request.files['review_image']
#             review_image = ReviewImages(rr_id=review.id, img=image.read())
#             db.session.add(review_image)
#             db.session.commit()

#         return jsonify({"success": True, "message": "Review submitted successfully!"})
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500

# def get_average_rating(tour_guide_id):
#     avg_rating = db.session.query(func.avg(ReviewsRating.rating)).filter_by(tour_guide_id=tour_guide_id).scalar()
#     return round(avg_rating, 1) if avg_rating else None


# @main.route('/submit_review', methods=['POST'])
# def submit_review():
#     try:
#         # Retrieve form data
#         rating = float(request.form.get('rating'))
#         comment = request.form.get('comment')
#         tour_guide_id = request.form.get('tour_guide_id')  # Pass tour_guide_id in the form as a hidden input

#         # Validate input
#         if not rating or not tour_guide_id:
#             return jsonify({"success": False, "message": "Missing rating or tour guide ID."}), 400

#         # Save the review
#         review = ReviewsRating(
#             user_id=current_user.id,
#             tour_guide_id=tour_guide_id,
#             rating=rating,
#             comment=comment
#         )
#         db.session.add(review)
#         db.session.commit()

#         # Handle image upload
#         if 'review_image' in request.files:
#             image = request.files['review_image']
#             if image.filename != '':
#                 # Save the image to the specified folder
#                 filename = secure_filename(image.filename)
#                 upload_folder = os.path.join(current_app.root_path, 'static/tour_pics')
#                 os.makedirs(upload_folder, exist_ok=True)  # Create folder if it doesn't exist
#                 file_path = os.path.join(upload_folder, filename)
#                 image.save(file_path)

#                 # Save the relative file path to the database
#                 review_image = ReviewImages(rr_id=review.id, img=f'tour_pics/{filename}')
#                 db.session.add(review_image)
#                 db.session.commit()

#         return jsonify({"success": True, "message": "Review submitted successfully!"})

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500

@main.route('/submit_review', methods=['POST'])
def submit_review():
    try:
        # Retrieve form data
        rating = float(request.form.get('rating'))
        comment = request.form.get('comment')
        tour_guide_id = request.form.get('tour_guide_id')

        # Validate input
        if not rating or not tour_guide_id:
            return jsonify({"success": False, "message": "Missing rating or tour guide ID."}), 400

        # Save the review
        review = ReviewsRating(
            user_id=current_user.id,
            tour_guide_id=tour_guide_id,
            rating=rating,
            comment=comment
        )
        db.session.add(review)
        db.session.commit()

        # Handle image upload
        if 'review_image' in request.files:
            image = request.files['review_image']
            if image.filename != '':
                # Save the image to the specified folder
                filename = secure_filename(image.filename)
                upload_folder = os.path.join(current_app.root_path, 'static/review_pics')
                os.makedirs(upload_folder, exist_ok=True)  # Create folder if it doesn't exist
                file_path = os.path.join(upload_folder, filename)
                image.save(file_path)

                # Save the relative file path to the database
                review_image = ReviewImages(rr_id=review.id, img=filename)
                db.session.add(review_image)
                db.session.commit()

        return jsonify({"success": True, "message": "Review submitted successfully!"})

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500
