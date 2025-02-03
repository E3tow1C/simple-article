json.extract! article, :id, :topic, :body, :created_at, :updated_at
json.url article_url(article, format: :json)
