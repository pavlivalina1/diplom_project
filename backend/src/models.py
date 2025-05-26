from sqlalchemy import Column, Integer, String
from sqlalchemy import LargeBinary

from src.database import Base


class History(Base):
    __tablename__ = 'history'

    id = Column(Integer, primary_key=True, index=True)
    image_data = Column(LargeBinary, nullable=False)
    type = Column(String, nullable=False)
    class_name = Column(String, nullable=False)
    recommendations = Column(String, nullable=False)
