class Article < ApplicationRecord
  has_many_attached :images

  validates :topic, presence: true, length: { maximum: 150 }
  validates :body, presence: true, length: { maximum: 5000 }
  validates :images, presence: true
end
