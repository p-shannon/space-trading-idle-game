Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
	post 	 "/login"		 => "sessions#create"
	delete "/logout"	 => "sessions#destroy"
	get		 "/profile"	 => "users#profile"
	post	 "/game/test"=> "game#update_data"
	resources :users
end
