class Api::V1::IdeasController < Api::ApiController
  respond_to :json

  def index
    respond_with Idea.order(:created_at)
  end

  def create
    @idea = Idea.create(idea_params)
    respond_with @idea, location: -> { api_v1_ideas_path(@idea) }
  end

  def destroy
    @idea = Idea.find(params["id"])
    respond_with @idea.destroy
  end

  private
    def idea_params
      params.permit('title', 'body')
    end
end
