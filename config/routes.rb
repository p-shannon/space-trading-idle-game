Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
	post 	 "/login"		=> "sessions#create"
	delete   "/logout"	 	=> "sessions#destroy"
	get		 "/profile"	 	=> "users#profile"
	delete	 "/game/init"	=> "game#initialize_data"
	put 	 "/game/save" 	=> "game#save_data"
	get		 "/game/load"	=> "game#load_data"
	put "/game/occupy" => "game#occupy_region"
	put "/game/abandon" => "game#abandon_region"

	resources :users
	resources :regions 
end
