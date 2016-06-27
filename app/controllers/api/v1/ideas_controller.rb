class Api::V1::IdeasController < Api::ApiController
  respond_to :json

  def index
    @ideas = Idea.order(:created_at)
    respond_with @ideas
  end

  def create
    @idea = Idea.create(idea_params)
    respond_with @idea, location: -> { api_v1_ideas_path(@idea) }
  end

  private
    def idea_params
      params.permit('title', 'body')
    end
end
