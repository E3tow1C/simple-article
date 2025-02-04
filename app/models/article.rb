class Article < ApplicationRecord
  has_many_attached :images

  validates :topic, presence: true, length: { minimum: 1, maximum: 150 }
  validates :body, presence: true, length: { minimum: 1, maximum: 5000 }
  validates :images, presence: true
end
