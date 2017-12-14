class GameController < ApiController
	before_action :require_login

	def initialize_data
		user = User.find_by_auth_token!(request.headers[:token])
		user.update(data: nil)
		render json: {
			status: "User's data reset!",
			user: user
		}
	end

end
