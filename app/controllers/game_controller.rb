class GameController < ApiController
	before_action :require_login

	def update_data
		user = User.find_by_auth_token!(request.headers[:token])
		user.update(data: "something")
		render json: {
			status: "Update works",
			user: user
		}
	end
end
