from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField, DecimalField, FormField, FieldList, FileField
from wtforms.validators import DataRequired, Email, EqualTo, ValidationError, Length, NumberRange
from BookingSystem.models import User
from wtforms.fields import FileField, DecimalField
from flask_wtf.file import FileField, FileAllowed


# # Sub-form for Estimated Price
# class EstimatedPriceForm(FlaskForm):
#     description = StringField('Price Description', validators=[DataRequired(), Length(max=100)])
#     estimated_price = DecimalField('Estimated Price', places=2, validators=[DataRequired()])

# # Sub-form for Inclusion
# class InclusionForm(FlaskForm):
#     inclusion = StringField('Inclusion', validators=[DataRequired(), Length(max=100)])

# # Sub-form for Exclusion
# class ExclusionForm(FlaskForm):
#     exclusion = StringField('Exclusion', validators=[DataRequired(), Length(max=100)])

# # Sub-form for Itinerary
# class ItineraryForm(FlaskForm):
#     title = StringField('Itinerary Title', validators=[DataRequired(), Length(max=100)])
#     subtitle = StringField('Itinerary Subtitle', validators=[DataRequired(), Length(max=100)])

# Main form for Tour Package
class TourPackageForm(FlaskForm):
    name = StringField('Package Name', validators=[DataRequired(), Length(max=50)])
    description = TextAreaField('Description', validators=[DataRequired()])
    package_img = FileField('Package Image', validators=[DataRequired()])



    submit_tour_package = SubmitField('Create Tour Package')

class UserTourGuideForm(FlaskForm):
    fname = StringField('First Name', validators=[DataRequired()])
    lname = StringField('Last Name', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    contact_number = StringField('Contact Number', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6, message="Password must be at least 6 characters long.")])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password', message="Passwords must match.")])
    submit_tour_guide = SubmitField('Create Account')

    def validate_email(self, email):
        # Check if the email is already used by a tour guide
        tour_guide = User.query.filter_by(email=email.data).first()
        if tour_guide:
            raise ValidationError('That email is already in use. Please choose a different one.')

