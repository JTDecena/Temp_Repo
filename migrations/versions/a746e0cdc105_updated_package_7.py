"""Updated Package 7

Revision ID: a746e0cdc105
Revises: 7719343488a1
Create Date: 2024-11-10 23:08:18.884913

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a746e0cdc105'
down_revision = '7719343488a1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('TourPackage', schema=None) as batch_op:
        batch_op.alter_column('package_img',
               existing_type=sa.VARCHAR(length=225),
               type_=sa.String(length=255),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('TourPackage', schema=None) as batch_op:
        batch_op.alter_column('package_img',
               existing_type=sa.String(length=255),
               type_=sa.VARCHAR(length=225),
               existing_nullable=True)

    # ### end Alembic commands ###
