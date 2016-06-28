class Api::V1::IdeasController < Api::ApiController
  respond_to :json

  def index
    respond_with Idea.order(:created_at)
  end

  def create
    respond_with Idea.create(idea_params), location: nil
  end

  def destroy
    respond_with Idea.find(params["id"]).destroy
  end

  def update
    @idea = Idea.find(params["id"])
    respond_with @idea.update_attributes(quality: params["quality"])
  end

  private
    def idea_params
      params.permit('title', 'body')
    end
end
