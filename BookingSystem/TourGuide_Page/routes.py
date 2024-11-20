from flask import render_template, redirect, url_for, flash, request, session, jsonify, current_app
from flask_login import login_required, current_user, logout_user, login_user
from BookingSystem.TourOperator_Page import touroperator
from . import tourguide  
from BookingSystem.TourOperator_Page.form import UserTourGuideForm
from BookingSystem import bcrypt, db
from werkzeug.security import check_password_hash, generate_password_hash
from BookingSystem.models import User, Characteristic, Skill, Availability, TourGuide, TourPackage, Booking
from .form import PasswordConfirmationForm
from datetime import datetime
from decimal import Decimal
from werkzeug.utils import secure_filename
import os
import re
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy import func  #!!!!!
from BookingSystem.models import ReviewsRating, ReviewImages   #!!!!!



@tourguide.route('/upload_profile_picture', methods=['POST'])
@login_required
def upload_profile_picture():
    if 'profile_picture' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400

    file = request.files['profile_picture']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'}), 400

    # Secure the filename and save it to the profile_pics directory
    filename = secure_filename(f"{current_user.id}_{file.filename}")
    filepath = os.path.join(current_app.root_path, 'static/profile_pics', filename)
    file.save(filepath)

    # Update the user's profile with the new image filename
    current_user.profile_img = filename
    db.session.commit()

    # Return the URL of the saved image
    file_url = url_for('static', filename=f'profile_pics/{filename}')
    return jsonify({'success': True, 'url': file_url})


@tourguide.route('/update_price', methods=['POST'])
@login_required
def update_price():
    data = request.get_json()
    try:
        # Convert to Decimal to match the db.Numeric type
        new_price = Decimal(data.get('price'))
        print("New price received:", new_price)  # Debugging print
    except (TypeError, ValueError):
        print("Invalid price format received.")  # Debugging log
        return jsonify({'success': False, 'error': 'Invalid price format'}), 400

    if new_price < 0:
        print("Negative price received, rejecting.")  # Debugging log
        return jsonify({'success': False, 'error': 'Price must be positive'}), 400

    # Get the tour guide instance for the current user
    tour_guide = current_user.tour_guide  # Adjust this line if accessing via other methods
    if not tour_guide:
        return jsonify({'success': False, 'error': 'Tour guide profile not found'}), 404

    # Update and commit the price
    tour_guide.price = new_price
    db.session.commit()
    print("Price saved to database for tour guide:", tour_guide.price)  # Debugging print

    # Verify the update by reloading the value directly from the database
    db.session.refresh(tour_guide)
    print("Verified price in database:", tour_guide.price)  # Confirm that the price was saved

    return jsonify({'success': True})



@tourguide.route('/update_email', methods=['POST'])
@login_required
def update_email():
    data = request.get_json()
    new_email = data.get('email')

    # Basic email format validation
    if not new_email or not re.match(r"[^@]+@[^@]+\.[^@]+", new_email):
        return jsonify({'success': False, 'error': 'Invalid email format.'}), 400

    # Check if email is already in use
    existing_user = User.query.filter_by(email=new_email).first()
    if existing_user:
        return jsonify({'success': False, 'error': 'Email is already in use.'}), 400

    # Update email in the database
    current_user.email = new_email
    db.session.commit()

    return jsonify({'success': True})




# Route to view the profile of a specific tour guide
@tourguide.route('/view_tourguide/<int:guide_id>', methods=['GET'])
@login_required
def view_tourguide(guide_id):
    guide = User.query.get_or_404(guide_id)
    return render_template('tourguide_dashboard.html', guide=guide)



# Route to save profile changes made by the tour guide
@tourguide.route('/save_profile', methods=['POST'])
@login_required
def save_profile():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data received.'}), 400

        # Update the current user's profile fields
        current_user.first_name = data.get('first_name') or current_user.first_name
        current_user.last_name = data.get('last_name') or current_user.last_name
        current_user.email = data.get('email') or current_user.email
        
         # Update the contact number in the TourGuide model


        # Commit changes to the database
        db.session.commit()

        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error saving profile: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500




# # Tour guide dashboard route
# @tourguide.route('/tourguide_dashboard')
# @login_required
# def tourguide_dashboard():
#     print(f"Current user in dashboard: {current_user.email}, Role: {current_user.role}")
#     tour_guide = current_user.tour_guide
#     if not tour_guide:
#         flash("Tour guide profile not found.", "error")
#     # Fetch reviews for the logged-in tour guide
#     page = request.args.get('page', 1, type=int)
#     per_page = 2  # Number of reviews per page

#     paginated_reviews = ReviewsRating.query.filter_by(tour_guide_id=tour_guide.id) \
#                                            .order_by(ReviewsRating.datetime.desc()) \
#                                            .paginate(page=page, per_page=per_page, error_out=False)
    
#     # Calculate the total number of reviews for this tour guide
#     total_reviews = ReviewsRating.query.filter_by(tour_guide_id=tour_guide.id).count()
    
#     # Prepare reviews for rendering
#     reviews_data = []
#     for review in paginated_reviews.items:
#         reviews_data.append({
#             "traveler_name": f"{review.user.first_name} {review.user.last_name}",
#             "traveler_profile": url_for('static', filename=f"profile_pics/{review.user.profile_img}"),
#             "rating": review.rating,
#             "comment": review.comment,
#             "review_date": review.datetime.strftime('%b. %d, %Y'),
#             "tour_image": url_for('static', filename='tour_images/sample.jpg')  # Adjust image path as needed
#         })

#     # Prepare pagination data
#     pagination_data = {
#         "current_page": paginated_reviews.page,
#         "total_pages": paginated_reviews.pages,
#         "has_next": paginated_reviews.has_next,
#         "has_prev": paginated_reviews.has_prev,
#         "next_page": paginated_reviews.next_num,
#         "prev_page": paginated_reviews.prev_num
#     }

#     # Fetch additional profile details for the dashboard
#     characteristics = [c.characteristic for c in tour_guide.characteristics]
#     skills = [s.skill for s in tour_guide.skills]

#     return render_template(
#         'tourguide_dashboard.html',
#        profile={
#         "pagination": pagination_data  # Add pagination to the profile dictionary
#         },
#         bio=tour_guide.bio,
#         characteristics=characteristics,
#         skills=skills,
#         reviews=reviews_data,
#         pagination=pagination_data,
#         total_reviews=total_reviews  # Pass total reviews to the template
#     )

@tourguide.route('/tourguide_dashboard')
@login_required
def tourguide_dashboard():
    print(f"Current user in dashboard: {current_user.email}, Role: {current_user.role}")

    # Get the tour guide profile for the logged-in user
    tour_guide = current_user.tour_guide
    if not tour_guide:
        flash("Tour guide profile not found.", "error")
        return redirect(url_for('main.home'))  # Redirect if no profile exists

    # Calculate the total number of reviews for this tour guide
    total_reviews = ReviewsRating.query.filter_by(tour_guide_id=tour_guide.id).count()

    # Fetch the total tours handled by this guide
    total_tours = Booking.query.filter_by(tour_guide_id=tour_guide.id).count()

    # Fetch the average rating and review count
    average_rating, review_count = db.session.query(
        func.coalesce(func.avg(ReviewsRating.rating), 0).label('average_rating'),
        func.count(ReviewsRating.id).label('review_count')
    ).filter(ReviewsRating.tour_guide_id == tour_guide.id).first()

    # Paginate the reviews
    page = request.args.get('page', 1, type=int)
    per_page = 2  # Number of reviews per page

    paginated_reviews = ReviewsRating.query.filter_by(tour_guide_id=tour_guide.id) \
                                           .order_by(ReviewsRating.datetime.desc()) \
                                           .paginate(page=page, per_page=per_page, error_out=False)

    # Prepare reviews for rendering
    reviews_data = []
    for review in paginated_reviews.items:
        review_image = ReviewImages.query.filter_by(rr_id=review.id).first()
        tour_image_path = f"review_pics/{review_image.img}" if review_image else 'default.jpg'
        reviews_data.append({
            "traveler_name": f"{review.user.first_name} {review.user.last_name}",
            "traveler_profile": url_for('static', filename=f"profile_pics/{review.user.profile_img}"),
            "rating": review.rating,
            "comment": review.comment,
            "review_date": review.datetime.strftime('%b. %d, %Y'),
            "tour_guide_name": f"{tour_guide.user.first_name} {tour_guide.user.last_name}",
            "tour_image": url_for('static', filename=tour_image_path)  # Ensure correct image path
        })

    # Prepare pagination data
    pagination_data = {
        "current_page": paginated_reviews.page,
        "total_pages": paginated_reviews.pages,
        "has_next": paginated_reviews.has_next,
        "has_prev": paginated_reviews.has_prev,
        "next_page": paginated_reviews.next_num,
        "prev_page": paginated_reviews.prev_num
    }

    # Fetch additional profile details for the dashboard
    characteristics = [c.characteristic for c in tour_guide.characteristics]
    skills = [s.skill for s in tour_guide.skills]

    return render_template(
        'tourguide_dashboard.html',
        profile={
            "pagination": pagination_data  # Add pagination to the profile dictionary
        },
        bio=tour_guide.bio,
        characteristics=characteristics,
        skills=skills,
        reviews=reviews_data,
        total_reviews=total_reviews,  # Total number of reviews
        average_rating=round(average_rating, 1),  # Average rating rounded to 1 decimal
        review_count=review_count or 0,  # Total number of reviews
        total_tours=total_tours  # Include total tours
    )


# @tourguide.route('/tourguide_profile')
# @login_required
# def tourguide_profile():
#     tour_guide = current_user.tour_guide
#     if not tour_guide:
#         flash("Tour guide profile not found.", "error")
#         return redirect(url_for('main.index'))  # Redirect to an appropriate page

#     # Fetch reviews for the logged-in tour guide
#     page = request.args.get('page', 1, type=int)
#     per_page = 2  # Number of reviews per page

#     paginated_reviews = ReviewsRating.query.filter_by(tour_guide_id=tour_guide.id) \
#                                            .order_by(ReviewsRating.datetime.desc()) \
#                                            .paginate(page=page, per_page=per_page, error_out=False)

#     # Prepare reviews for rendering
#     reviews_data = []
#     for review in paginated_reviews.items:
#         reviews_data.append({
#             "traveler_name": f"{review.user.first_name} {review.user.last_name}",
#             "traveler_profile": url_for('static', filename=f"profile_pics/{review.user.profile_img}"),
#             "rating": review.rating,
#             "comment": review.comment,
#             "review_date": review.datetime.strftime('%b. %d, %Y'),
#             "tour_image": url_for('static', filename='tour_images/sample.jpg')  # Adjust image path as needed
#         })

#     # Prepare pagination data
#     pagination_data = {
#         "current_page": paginated_reviews.page,
#         "total_pages": paginated_reviews.pages,
#         "has_next": paginated_reviews.has_next,
#         "has_prev": paginated_reviews.has_prev,
#         "next_page": paginated_reviews.next_num,
#         "prev_page": paginated_reviews.prev_num
#     }

#     # Fetch additional profile details for the dashboard
#     characteristics = [c.characteristic for c in tour_guide.characteristics]
#     skills = [s.skill for s in tour_guide.skills]

#     return render_template(
#         'tourguide_dashboard.html',
#         bio=tour_guide.bio,
#         characteristics=characteristics,
#         skills=skills,
#         reviews=reviews_data,
#         pagination=pagination_data,
#         total_reviews=len(reviews_data)  # Total number of reviews
#     )

    






@tourguide.route('/confirm-password', methods=['POST'])
@login_required
def confirm_password():
    data = request.get_json()
    password = data.get('password')

    # Check if the entered password matches the user's current password
    if password and bcrypt.check_password_hash(current_user.password, password):
        return jsonify({'success': True}), 200
    return jsonify({'success': False, 'error': 'Incorrect password'}), 401



# Logout route
@tourguide.route('/logout')
@login_required
def logout():
    logout_user()
    session.clear()
    flash('Logged out successfully.', 'success')
    return redirect(url_for('main.home'))







@tourguide.route('/verify_password', methods=['POST'])
@login_required
def verify_password():
    data = request.get_json()
    password = data.get('password')

    # Check if password is provided
    if not password:
        return jsonify({"success": False, "message": "Password is required for verification."}), 400

    # Verify the password
    if hasattr(current_user, 'check_password'):
        password_is_correct = current_user.check_password(password)
    else:
        password_is_correct = check_password_hash(current_user.password, password)
    
    # Respond based on password verification result
    if password_is_correct:
        return jsonify({
            "success": True,
            "message": "Password verified successfully. You may proceed with editing."
        }), 200
    else:
        return jsonify({
            "success": False,
            "message": "Incorrect password. Please try again."
        }), 401


# @tourguide.route('/get_contact/<int:tour_guide_id>', methods=['GET'])
# def get_contact(tour_guide_id):
#     try:
#         tour_guide = TourGuide.query.get_or_404(tour_guide_id)
#         contact_info = {
#             "name": f"{tour_guide.user.first_name} {tour_guide.user.last_name}",
#             "contact_number": tour_guide.contact_num
#         }
#         return jsonify(contact_info)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@tourguide.route('/get_contact/<int:tour_guide_id>', methods=['GET'])
def get_contact(tour_guide_id):
    try:
        tour_guide = TourGuide.query.get_or_404(tour_guide_id)
        contact_info = {
            "name": f"{tour_guide.user.first_name} {tour_guide.user.last_name}",
            "contact_number": tour_guide.contact_num,
            "price": float(tour_guide.price)  # Convert to float for JSON serialization
        }
        return jsonify(contact_info)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@tourguide.route('/update_contact_number', methods=['POST'])
@login_required
def update_contact_number():
    data = request.get_json()
    new_contact_number = data.get('contact_number')

    # Validate that a contact number is provided and is in the correct format
    if not new_contact_number:
        return jsonify({'success': False, 'error': 'Contact number is required.'}), 400
    if not new_contact_number.isdigit() or len(new_contact_number) < 7:
        return jsonify({'success': False, 'error': 'Invalid contact number format. Please enter a valid number.'}), 400

    try:
        # Assuming the `TourGuide` model is related to the `User` model with `tour_guide` relationship
        tour_guide = current_user.tour_guide
        if not tour_guide:
            return jsonify({'success': False, 'error': 'Tour guide profile not found.'}), 404

        # Update the contact number and commit to the database
        tour_guide.contact_num = new_contact_number
        db.session.commit()
        return jsonify({'success': True, 'message': 'Contact number updated successfully.'}), 200

    except Exception as e:
        db.session.rollback()  # Rollback in case of an error
        print(f"Error updating contact number: {e}")  # Log error for debugging
        return jsonify({'success': False, 'error': 'An error occurred while updating the contact number. Please try again later.'}), 500






# @tourguide.route('/tourguide_profile')
# @login_required
# def tourguide_profile():
#     tour_guide = current_user.tour_guide
#     if not tour_guide:
#         flash("Tour guide profile not found.", "error")
#         return redirect(url_for('main.index'))  # Redirect to an appropriate page

#     # Fetch reviews for the logged-in tour guide
#     page = request.args.get('page', 1, type=int)
#     per_page = 2  # Number of reviews per page

#     paginated_reviews = ReviewsRating.query.filter_by(tour_guide_id=tour_guide.id) \
#                                            .order_by(ReviewsRating.datetime.desc()) \
#                                            .paginate(page=page, per_page=per_page, error_out=False)

#     # Prepare reviews for rendering
#     reviews_data = []
#     for review in paginated_reviews.items:
#         reviews_data.append({
#             "traveler_name": f"{review.user.first_name} {review.user.last_name}",
#             "traveler_profile": url_for('static', filename=f"profile_pics/{review.user.profile_img}"),
#             "rating": review.rating,
#             "comment": review.comment,
#             "review_date": review.datetime.strftime('%b. %d, %Y'),
#             "tour_image": url_for('static', filename='tour_images/sample.jpg')  # Adjust image path as needed
#         })

#     # Prepare pagination data
#     pagination_data = {
#         "current_page": paginated_reviews.page,
#         "total_pages": paginated_reviews.pages,
#         "has_next": paginated_reviews.has_next,
#         "has_prev": paginated_reviews.has_prev,
#         "next_page": paginated_reviews.next_num,
#         "prev_page": paginated_reviews.prev_num
#     }

#     # Fetch additional profile details for the dashboard
#     characteristics = [c.characteristic for c in tour_guide.characteristics]
#     skills = [s.skill for s in tour_guide.skills]

#     return render_template(
#         'tourguide_dashboard.html',
#         bio=tour_guide.bio,
#         characteristics=characteristics,
#         skills=skills,
#         reviews=reviews_data,
#         pagination=pagination_data,
#         total_reviews=len(reviews_data)  # Total number of reviews
#     )



@tourguide.route('/tourguide_profile')
@login_required
def tourguide_profile():
    tour_guide = current_user.tour_guide
    if not tour_guide:
        flash("Tour guide profile not found.", "error")
        return redirect(url_for('tourguide.tourguide_dashboard'))  # Redirect to an appropriate page

    characteristics = [c.characteristic for c in tour_guide.characteristics]
    skills = [s.skill for s in tour_guide.skills]
    return render_template(
        'tourguide_dashboard.html',
        bio=tour_guide.bio,
        characteristics=characteristics,
        skills=skills
    )



# Update Bio
@tourguide.route('/update_about_me', methods=['POST'])
@login_required
def update_about_me():
    data = request.get_json()
    bio = data.get('bio')

    if not bio:
        return jsonify({"success": False, "message": "Bio is required."}), 400

    tour_guide = current_user.tour_guide
    if not tour_guide:
        return jsonify({"success": False, "message": "Tour guide profile not found."}), 404

    try:
        tour_guide.bio = bio
        db.session.commit()
        return jsonify({"success": True, "message": "Bio updated successfully."})
    except Exception as e:
        db.session.rollback()
        print(f"Error updating bio: {e}")
        return jsonify({"success": False, "message": "Failed to update bio due to a database error."}), 500

# Update Characteristics
@tourguide.route('/update_characteristics', methods=['POST'])
@login_required
def update_characteristics():
    data = request.get_json()
    characteristics = data.get('characteristics', [])

    tour_guide = current_user.tour_guide
    if not tour_guide:
        return jsonify({"success": False, "message": "Tour guide profile not found."}), 404

    try:
        # Clear existing characteristics and add new ones
        tour_guide.characteristics = [
            Characteristic(tguide_id=tour_guide.id, characteristic=char)
            for char in characteristics
        ]
        db.session.commit()
        return jsonify({"success": True, "message": "Characteristics updated successfully."})
    except Exception as e:
        db.session.rollback()
        print(f"Error updating characteristics: {e}")
        return jsonify({"success": False, "message": "Failed to update characteristics due to a database error."}), 500

# Update Skills
@tourguide.route('/update_skills', methods=['POST'])
@login_required
def update_skills():
    data = request.get_json()
    skills = data.get('skills', [])

    tour_guide = current_user.tour_guide
    if not tour_guide:
        return jsonify({"success": False, "message": "Tour guide profile not found."}), 404

    try:
        # Clear existing skills and add new ones
        tour_guide.skills = [
            Skill(tguide_id=tour_guide.id, skill=skill)
            for skill in skills
        ]
        db.session.commit()
        return jsonify({"success": True, "message": "Skills updated successfully."})
    except Exception as e:
        db.session.rollback()
        print(f"Error updating skills: {e}")
        return jsonify({"success": False, "message": "Failed to update skills due to a database error."}), 500


@tourguide.route('/get_profile_data', methods=['GET'])
@login_required
def get_profile_data():
    tour_guide = current_user.tour_guide
    if not tour_guide:
        return jsonify({"success": False, "message": "Tour guide profile not found."}), 404

    try:
        profile_data = {
            "about_me": tour_guide.bio,
            "characteristics": [char.characteristic for char in tour_guide.characteristics],
            "skills": [skill.skill for skill in tour_guide.skills]
        }
        return jsonify({"success": True, "profile_data": profile_data})
    except Exception as e:
        print(f"Error fetching profile data: {e}")
        return jsonify({"success": False, "message": "Failed to fetch profile data due to a database error."}), 500







@tourguide.route('/activate_profile', methods=['POST'])
@login_required
def activate_profile():
    tour_guide = current_user.tour_guide
    
    # Check if all required fields are filled
    if not tour_guide.bio or not tour_guide.characteristics or not tour_guide.skills or not tour_guide.contact_num or not tour_guide.price:
        return jsonify({"success": False, "message": "Complete all required fields."}), 400
    
    tour_guide.active = True
    db.session.commit()
    return jsonify({"success": True, "message": "Profile activated successfully."}), 200

@tourguide.route('/deactivate_profile', methods=['POST'])
@login_required
def deactivate_profile():
    tour_guide = current_user.tour_guide
    tour_guide.active = False
    db.session.commit()
    return jsonify({"success": True, "message": "Profile deactivated successfully."}), 200

@tourguide.route('/get_profile_status', methods=['GET'])
@login_required
def get_profile_status():
    tour_guide = current_user.tour_guide
    return jsonify({"active": tour_guide.active})







# @tourguide.route('/profile/<int:tour_guide_id>')
# def profile(tour_guide_id):
#     page = request.args.get('page', 1, type=int)
#     per_page = 2  # Number of reviews per page

#     # Fetch the tour guide's profile
#     tour_guide = TourGuide.query.get_or_404(tour_guide_id)
    
#     # Fetch the average rating and review count
#     average_rating, review_count = db.session.query(
#         func.coalesce(func.avg(ReviewsRating.rating), 0).label('average_rating'),
#         func.count(ReviewsRating.id).label('review_count')
#     ).filter(ReviewsRating.tour_guide_id == tour_guide_id).first()

#     # Paginate reviews
#     paginated_reviews = ReviewsRating.query.filter_by(tour_guide_id=tour_guide_id) \
#                                            .order_by(ReviewsRating.datetime.desc()) \
#                                            .paginate(page=page, per_page=per_page, error_out=False)

#     # Prepare reviews for rendering
#     reviews_data = []
#     for review in paginated_reviews.items:
#         reviews_data.append({
#             "traveler_name": f"{review.user.first_name} {review.user.last_name}",
#             "traveler_profile": url_for('static', filename=f"profile_pics/{review.user.profile_img}"),
#             "rating": review.rating,
#             "comment": review.comment,
#             "review_date": review.datetime.strftime('%b. %d, %Y'),
#             "tour_guide_name": f"{tour_guide.user.first_name} {tour_guide.user.last_name}",
#             "tour_image": url_for('static', filename='tour_images/sample.jpg')  # Adjust image path as needed
#         })

#     # Prepare pagination data
#     pagination_data = {
#         "current_page": paginated_reviews.page,
#         "total_pages": paginated_reviews.pages,
#         "has_next": paginated_reviews.has_next,
#         "has_prev": paginated_reviews.has_prev,
#         "next_page": paginated_reviews.next_num,
#         "prev_page": paginated_reviews.prev_num
#     }

#     # Prepare profile data
#     profile_data = {
#         "name": f"{tour_guide.user.first_name} {tour_guide.user.last_name}",
#         "profile_picture": url_for('static', filename=f"profile_pics/{tour_guide.user.profile_img}", _external=True),
#         "bio": tour_guide.bio,
#         "price": tour_guide.price,
#         "characteristics": [char.characteristic for char in tour_guide.characteristics],
#         "skills": [skill.skill for skill in tour_guide.skills],
#         "average_rating": round(average_rating, 1),
#         "review_count": review_count or 0,
#         "reviews": reviews_data,
#         "pagination": pagination_data
#     }

#     return render_template('tourguide_form.html', profile=profile_data)








# @tourguide.route('/profile/<int:tour_guide_id>')  Latest and working
# def profile(tour_guide_id):
#     page = request.args.get('page', 1, type=int)
#     per_page = 2  # Number of reviews per page

#     # Fetch the tour guide's profile
#     tour_guide = TourGuide.query.get_or_404(tour_guide_id)
    
#     # Fetch the average rating and review count
#     average_rating, review_count = db.session.query(
#         func.coalesce(func.avg(ReviewsRating.rating), 0).label('average_rating'),
#         func.count(ReviewsRating.id).label('review_count')
#     ).filter(ReviewsRating.tour_guide_id == tour_guide_id).first()

#     # Paginate reviews
#     paginated_reviews = ReviewsRating.query.filter_by(tour_guide_id=tour_guide_id) \
#                                            .order_by(ReviewsRating.datetime.desc()) \
#                                            .paginate(page=page, per_page=per_page, error_out=False)

#     # Prepare reviews for rendering
#     reviews_data = []
#     for review in paginated_reviews.items:
#         reviews_data.append({
#             "traveler_name": f"{review.user.first_name} {review.user.last_name}",
#             "traveler_profile": url_for('static', filename=f"profile_pics/{review.user.profile_img}"),
#             "rating": review.rating,
#             "comment": review.comment,
#             "review_date": review.datetime.strftime('%b. %d, %Y'),
#             "tour_guide_name": f"{tour_guide.user.first_name} {tour_guide.user.last_name}",
#             "tour_image": url_for('static', filename='tour_pics/{filename}')  # Adjust image path as needed
#         })

#     # Prepare pagination data
#     pagination_data = {
#         "current_page": paginated_reviews.page,
#         "total_pages": paginated_reviews.pages,
#         "has_next": paginated_reviews.has_next,
#         "has_prev": paginated_reviews.has_prev,
#         "next_page": paginated_reviews.next_num,
#         "prev_page": paginated_reviews.prev_num
#     }

#     # Fetch tour packages from the tour operator associated with this guide
#     tour_packages = TourPackage.query.filter_by(toperator_id=tour_guide.toperator_id).all()

#     # Prepare profile data
#     profile_data = {
#         "name": f"{tour_guide.user.first_name} {tour_guide.user.last_name}",
#         "profile_picture": url_for('static', filename=f"profile_pics/{tour_guide.user.profile_img}", _external=True),
#         "bio": tour_guide.bio,
#         "price": tour_guide.price,
#         "characteristics": [char.characteristic for char in tour_guide.characteristics],
#         "skills": [skill.skill for skill in tour_guide.skills],
#         "average_rating": round(average_rating, 1),
#         "review_count": review_count or 0,
#         "reviews": reviews_data,
#         "pagination": pagination_data,
#         "tour_packages": [
#             {
#                 "id": package.id,
#                 "name": package.name
#             }
#             for package in tour_packages
#         ]  # Include tour packages for the dropdown
#     }

#     return render_template('tourguide_form.html', profile=profile_data,  tour_guide=tour_guide  )





@tourguide.route('/profile/<int:tour_guide_id>')
def profile(tour_guide_id):
    page = request.args.get('page', 1, type=int)
    per_page = 2  # Number of reviews per page

    # Fetch the tour guide's profile
    tour_guide = TourGuide.query.get_or_404(tour_guide_id)
    
    # Fetch the average rating and review count
    average_rating, review_count = db.session.query(
        func.coalesce(func.avg(ReviewsRating.rating), 0).label('average_rating'),
        func.count(ReviewsRating.id).label('review_count')
    ).filter(ReviewsRating.tour_guide_id == tour_guide_id).first()

    # Paginate reviews
    paginated_reviews = ReviewsRating.query.filter_by(tour_guide_id=tour_guide_id) \
                                           .order_by(ReviewsRating.datetime.desc()) \
                                           .paginate(page=page, per_page=per_page, error_out=False)

    # Prepare reviews for rendering
    reviews_data = []
    for review in paginated_reviews.items:
        review_image = ReviewImages.query.filter_by(rr_id=review.id).first()
        tour_image_path = f"review_pics/{review_image.img}" if review_image else 'default.jpg'
        reviews_data.append({
            "traveler_name": f"{review.user.first_name} {review.user.last_name}",
            "traveler_profile": url_for('static', filename=f"profile_pics/{review.user.profile_img}"),
            "rating": review.rating,
            "comment": review.comment,
            "review_date": review.datetime.strftime('%b. %d, %Y'),
            "tour_guide_name": f"{tour_guide.user.first_name} {tour_guide.user.last_name}",
            "tour_image": url_for('static', filename=tour_image_path)  # Ensure correct image path
        })

    # Prepare pagination data
    pagination_data = {
        "current_page": paginated_reviews.page,
        "total_pages": paginated_reviews.pages,
        "has_next": paginated_reviews.has_next,
        "has_prev": paginated_reviews.has_prev,
        "next_page": paginated_reviews.next_num,
        "prev_page": paginated_reviews.prev_num
    }

    # Fetch tour packages from the tour operator associated with this guide
    tour_packages = TourPackage.query.filter_by(toperator_id=tour_guide.toperator_id).all()

    # Prepare profile data
    profile_data = {
        "name": f"{tour_guide.user.first_name} {tour_guide.user.last_name}",
        "profile_picture": url_for('static', filename=f"profile_pics/{tour_guide.user.profile_img}", _external=True),
        "bio": tour_guide.bio,
        "price": tour_guide.price,
        "characteristics": [char.characteristic for char in tour_guide.characteristics],
        "skills": [skill.skill for skill in tour_guide.skills],
        "average_rating": round(average_rating, 1),
        "review_count": review_count or 0,
        "reviews": reviews_data,
        "pagination": pagination_data,
        "tour_packages": [
            {
                "id": package.id,
                "name": package.name
            }
            for package in tour_packages
        ]  # Include tour packages for the dropdown
    }

    return render_template('tourguide_form.html', profile=profile_data, tour_guide=tour_guide)
















# @tourguide.route('/tourpackage/details/<int:package_id>', methods=['GET'])
# def get_tour_package_details(package_id):
#     try:
#         package = TourPackage.query.get_or_404(package_id)
#         data = {
#             "name": package.name,
#             "description": package.description,
#             "image": url_for('static', filename=f"tour_pics/{package.package_img}") if package.package_img else None,
#             "estimated_prices": [f"{price.description}: ₱{price.estimated_price}" for price in package.estimated_prices],
#             "inclusions": [item.inclusion for item in package.inclusions],
#             "exclusions": [item.exclusion for item in package.exclusions],
#             "itinerary": [{"title": item.title, "subtitle": item.subtitle} for item in package.itineraries],
#         }
#         return jsonify(data)
#     except Exception as e:
#         print(f"Error fetching package {package_id}: {e}")
#         return jsonify({"error": str(e)}), 500


    

# @tourguide.route('/profile/<int:tour_guide_id>')
# def profile(tour_guide_id):
#     # Fetch the tour guide's profile
#     tour_guide = TourGuide.query.get_or_404(tour_guide_id)
    
#     # Fetch the average rating and review count
#     average_rating, review_count = db.session.query(
#         func.coalesce(func.avg(ReviewsRating.rating), 0).label('average_rating'),
#         func.count(ReviewsRating.id).label('review_count')
#     ).filter(ReviewsRating.tour_guide_id == tour_guide_id).first()
    
#     # Prepare the profile data for the template
#     profile_data = {
#         "name": f"{tour_guide.user.first_name} {tour_guide.user.last_name}",
#         "profile_picture": url_for('static', filename=f"profile_pics/{tour_guide.user.profile_img}", _external=True),
#         "bio": tour_guide.bio,
#         "characteristics": [char.characteristic for char in tour_guide.characteristics],
#         "skills":[skill.skill for skill in tour_guide.skills],
#         "average_rating": round(average_rating, 1),
#         "review_count": review_count
#     }
    
#     return render_template('tour_guide_profile.html', profile=profile_data)




# @tourguide.route('/active_tourguides', methods=['GET'])   #!!!!!
# def get_active_tourguides():
#     # Query for active tour guides with ratings
#     active_tourguides = db.session.query(
#         TourGuide,
#         func.coalesce(func.avg(ReviewsRating.rating), 0).label('average_rating'),
#         func.count(ReviewsRating.id).label('review_count')
#     ).outerjoin(ReviewsRating, ReviewsRating.tour_guide_id == TourGuide.id) \
#     .filter(TourGuide.active == True) \
#     .group_by(TourGuide.id) \
#     .all()
    
#     guides_data = []
    
#     for guide, average_rating, review_count in active_tourguides:
#         # Ensure the tour guide has an associated user and fetch necessary details
#         if guide.user:
#             guide_data = {
#                 "id": guide.id,
#                 "name": f"{guide.user.first_name} {guide.user.last_name}",
#                 "profile_picture": url_for('static', filename=f"profile_pics/{guide.user.profile_img}", _external=True),
#                 "price": guide.price,
#                 "average_rating": round(average_rating, 1),  # Round to 1 decimal place
#                 "review_count": review_count
#             }
#             guides_data.append(guide_data)
    
#     # Return the list as JSON
#     return jsonify(guides_data)


@tourguide.route('/active_tourguides', methods=['GET'])
def get_active_tourguides():
    # Query for active tour guides with ratings and total tours
    active_tourguides = db.session.query(
        TourGuide,
        func.coalesce(func.avg(ReviewsRating.rating), 0).label('average_rating'),
        func.count(ReviewsRating.id).label('review_count'),
        func.coalesce(func.count(Booking.id), 0).label('total_tours')  # Total tours from Bookings
    ).outerjoin(ReviewsRating, ReviewsRating.tour_guide_id == TourGuide.id) \
    .outerjoin(Booking, Booking.tour_guide_id == TourGuide.id) \
    .filter(TourGuide.active == True) \
    .group_by(TourGuide.id) \
    .all()

    guides_data = []

    for guide, average_rating, review_count, total_tours in active_tourguides:
        # Ensure the tour guide has an associated user and fetch necessary details
        if guide.user:
            guide_data = {
                "id": guide.id,
                "name": f"{guide.user.first_name} {guide.user.last_name}",
                "profile_picture": url_for('static', filename=f"profile_pics/{guide.user.profile_img}", _external=True),
                "price": guide.price,
                "average_rating": round(average_rating, 1),  # Round to 1 decimal place
                "review_count": review_count,
                "total_tours": total_tours  # Add total tours dynamically
            }
            guides_data.append(guide_data)

    # Return the list as JSON
    return jsonify(guides_data)


# @tourguide.route('/get_availability/<int:tour_guide_id>', methods=['GET'])   
# def get_availability(tour_guide_id):
#     try:
#         # Fetch all availability records for the specified tour guide
#         availabilities = Availability.query.filter_by(tguide_id=tour_guide_id).all()
        
#         # Format data to include all statuses (both "available" and "unavailable")
#         data = [
#             {
#                 "date": a.availability_date.strftime('%Y-%m-%d'),
#                 "status": a.status
#             } for a in availabilities
#         ]
        
#         print("Data being sent to frontend:", data)  # Debugging output
#         return jsonify(data)
#     except Exception as e:
#         print("Error fetching availability data:", e)
#         return jsonify({"error": "An error occurred"}), 500


# @tourguide.route('/set_availability', methods=['POST'])
# @login_required
# def set_availability():
#     data = request.get_json()
#     print("Received availability data:", data)

#     # Ensure the tour guide entry exists for the current user
#     tour_guide = TourGuide.query.filter_by(user_id=current_user.id).first()
    
#     if not tour_guide:
#         # Create a default tour guide entry if it doesn't exist
#         try:
#             tour_guide = TourGuide(
#                 user_id=current_user.id,
#                 bio="Default Bio",
#                 price=1200,
#                 active=False
#             )
#             db.session.add(tour_guide)
#             db.session.commit()
#         except Exception as e:
#             db.session.rollback()
#             print(f"Error creating new tour guide profile: {e}")
#             return jsonify({"success": False, "message": f"Failed to create tour guide: {str(e)}"}), 500

#     # Process each availability entry
#     try:
#         for entry in data:
#             date = entry.get('start')
#             status = entry.get('status')

#             # Debugging output for each entry
#             print(f"Processing entry - Date: {date}, Status: {status}")

#             if not date or not status:
#                 print(f"Skipping entry with missing date or status: {entry}")
#                 continue

#             # Find existing availability or create a new one
#             availability = Availability.query.filter_by(
#                 tguide_id=tour_guide.id,
#                 availability_date=date
#             ).first()

#             if availability:
#                 print(f"Updating existing availability for date: {date} with status: {status}")
#                 availability.status = status
#             else:
#                 print(f"Creating new availability for date: {date} with status: {status}")
#                 availability = Availability(
#                     tguide_id=tour_guide.id,
#                     availability_date=date,
#                     status=status
#                 )
#                 db.session.add(availability)

#         # Commit all changes once after processing the entire batch
#         db.session.commit()
#         return jsonify({"success": True, "message": "Availability saved successfully."}), 200
#     except Exception as e:
#         db.session.rollback()
#         print(f"Error saving availability data: {e}")
#         return jsonify({"success": False, "message": f"Error saving availability: {str(e)}"}), 500














# @tourguide.route('/get_availability', methods=['GET'])
# @login_required
# def get_availability():
#     tour_guide = TourGuide.query.filter_by(user_id=current_user.id).first()
#     if not tour_guide:
#         return jsonify([])  # Return an empty list if no tour guide profile exists
#     availabilities = Availability.query.filter_by(tguide_id=tour_guide.id).all()
#     return jsonify([{"date": a.availability_date.strftime('%Y-%m-%d'), "status": a.status} for a in availabilities])

# @tourguide.route('/get_availability/<int:tour_guide_id>', methods=['GET'])
# def get_availability(tour_guide_id):
#     try:
#         # Fetch availability for the specified tour guide
#         availabilities = Availability.query.filter_by(tguide_id=tour_guide_id).all()
#         return jsonify([
#             {
#                 "date": a.availability_date.strftime('%Y-%m-%d'),
#                 "status": a.status
#             }
#             for a in availabilities
#         ])
#     except Exception as e:
#         print(f"Error fetching availability for Tour Guide ID {tour_guide_id}: {e}")
#         return jsonify({"error": f"An error occurred: {str(e)}"}), 500







# @tourguide.route('/get_availability', methods=['GET'])
# @login_required
# def get_availability():
#     """
#     Fetch availability for either the current logged-in tour guide or a specific tour guide by ID.
#     """
#     tour_guide_id = request.args.get('tour_guide_id', type=int)

#     try:
#         # If no specific tour guide ID is provided, default to the current user's tour guide profile
#         if not tour_guide_id:
#             tour_guide = TourGuide.query.filter_by(user_id=current_user.id).first()
#             if not tour_guide:
#                 return jsonify([])  # Return an empty list if no tour guide profile exists
#             tour_guide_id = tour_guide.id

#         # Fetch availability for the specified tour guide
#         availabilities = Availability.query.filter_by(tguide_id=tour_guide_id).all()
#         return jsonify([
#             {"date": a.availability_date.strftime('%Y-%m-%d'), "status": a.status}
#             for a in availabilities
#         ])
#     except Exception as e:
#         print(f"Error fetching availability for Tour Guide ID {tour_guide_id}: {e}")
#         return jsonify({"error": f"An error occurred: {str(e)}"}), 500







@tourguide.route('/get_availability', methods=['GET'])
@login_required
def get_current_user_availability():
    """
    Fetch availability for the current logged-in tour guide.
    """
    try:
        # Fetch the current user's tour guide profile
        tour_guide = TourGuide.query.filter_by(user_id=current_user.id).first()
        if not tour_guide:
            return jsonify([])  # Return an empty list if no tour guide profile exists
        
        # Fetch all availability records for the current user's tour guide profile
        availabilities = Availability.query.filter_by(tguide_id=tour_guide.id).all()
        return jsonify([
            {"date": a.availability_date.strftime('%Y-%m-%d'), "status": a.status}
            for a in availabilities
        ])
    except Exception as e:
        print(f"Error fetching availability for current user: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@tourguide.route('/get_availability/<int:tour_guide_id>', methods=['GET'])
def get_availability_for_tour_guide(tour_guide_id):
    """
    Fetch availability for a specific tour guide by their ID.
    """
    try:
        # Fetch availability for the specified tour guide
        availabilities = Availability.query.filter_by(tguide_id=tour_guide_id).all()
        return jsonify([
            {
                "date": a.availability_date.strftime('%Y-%m-%d'),
                "status": a.status
            }
            for a in availabilities
        ])
    except Exception as e:
        print(f"Error fetching availability for Tour Guide ID {tour_guide_id}: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@tourguide.route('/reset_availability', methods=['DELETE'])
@login_required
def reset_availability():
    try:
        tour_guide = TourGuide.query.filter_by(user_id=current_user.id).first()
        if not tour_guide:
            return jsonify({"error": "Tour guide profile not found"}), 404
        
        # Delete all availability records for the tour guide
        Availability.query.filter_by(tguide_id=tour_guide.id).delete()
        db.session.commit()

        return jsonify({"success": True, "message": "Availability reset successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500





@tourguide.route('/set_availability', methods=['POST'])
@login_required
def set_availability():
    try:
        data = request.get_json()
        tour_guide = TourGuide.query.filter_by(user_id=current_user.id).first()
        if not tour_guide:
            return jsonify({"error": "Tour guide profile not found"}), 404

        for entry in data:
            availability = Availability.query.filter_by(
                tguide_id=tour_guide.id, availability_date=entry['date']
            ).first()
            if availability:
                availability.status = entry['status']
            else:
                new_availability = Availability(
                    tguide_id=tour_guide.id,
                    availability_date=entry['date'],
                    status=entry['status'],
                )
                db.session.add(new_availability)

        db.session.commit()
        return jsonify({"success": True, "message": "Availability saved successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



@tourguide.route('/update_password', methods=['POST'])
def update_password():
    data = request.get_json()
    new_password = data.get('new_password')
    
    print("Received password update request")

    try:
        # Update the user's password (hash it if needed)
        current_user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        print("Error updating password:", e)
        return jsonify({"success": False, "message": "Failed to update password."}), 500
    
    
    
    







