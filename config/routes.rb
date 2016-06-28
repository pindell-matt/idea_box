Rails.application.routes.draw do
  root 'ideas#index'

  namespace :api do
    namespace :v1, defaults: { format: :json } do
      resources :ideas, only: [:index, :create, :destroy]
    end
  end

end
