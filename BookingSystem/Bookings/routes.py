from flask import render_template, redirect, url_for, flash, request, session, jsonify, current_app
from flask_login import login_required, current_user, logout_user, login_user
from BookingSystem.TourOperator_Page import touroperator
from . import booking
from BookingSystem.TourOperator_Page.form import UserTourGuideForm
from BookingSystem import bcrypt, db
from werkzeug.security import check_password_hash, generate_password_hash
from BookingSystem.models import User, Characteristic, Skill, Availability, TourGuide, TourPackage, Booking
# from .form import PasswordConfirmationForm
from datetime import datetime
from decimal import Decimal
from werkzeug.utils import secure_filename
import os
import re
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy import func  #!!!!!
from BookingSystem.models import ReviewsRating, ReviewImages   #!!!!!
from flask import Blueprint
from datetime import datetime, timedelta  # Ensure timedelta is imported



@booking.route('/create_booking', methods=['POST'])
@login_required
def create_booking():
    try:
        data = request.get_json()
        print("Incoming booking payload:", data)  # Debugging

        if not data:
            return jsonify({"error": "Invalid input"}), 400

        # Extract required fields
        tour_guide_id = data.get('tour_guide_id')
        package_id = data.get('package_id')
        date_start = data.get('date_start')
        date_end = data.get('date_end') or date_start  # Default to date_start if not provided
        traveler_quantity = data.get('traveler_quantity')
        special_notes = data.get('special_notes', '')
        price = data.get('price')

        # Validate input
        if not all([tour_guide_id, package_id, date_start, traveler_quantity, price]):
            return jsonify({"error": "Missing required fields"}), 400

        # Validate date formats
        try:
            date_start = datetime.strptime(date_start, '%Y-%m-%d').date()
            date_end = datetime.strptime(date_end, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Expected YYYY-MM-DD."}), 400

        # Calculate duration in days
        duration = (date_end - date_start).days + 1  # Inclusive of both dates

        # Check if the tour guide and package exist
        tour_guide = TourGuide.query.get(tour_guide_id)
        tour_package = TourPackage.query.get(package_id)

        if not tour_guide or not tour_package:
            return jsonify({"error": "Tour guide or package not found"}), 404

        # Create the booking
        booking = Booking(
            user_id=current_user.id,
            tour_guide_id=tour_guide_id,
            package_id=package_id,
            date_start=date_start,
            date_end=date_end,
            traveler_quantity=traveler_quantity,
            special_notes=special_notes,
            price=price,
            status='confirmed',  # Default status
            duration=timedelta(days=duration),  # Store as timedelta
        )

        db.session.add(booking)
        db.session.commit()

        print(f"Booking successfully created with ID {booking.id}")
        return jsonify({"message": "Booking confirmed", "booking_id": booking.id}), 201

    except Exception as e:
        print(f"Error in create_booking route: {e}")
        return jsonify({"error": "Server error"}), 500
