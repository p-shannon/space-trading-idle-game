class UsersController < ApiController
	before_action :require_login, except: [:create]

	def create
		user = User.create!(user_params)
		render json: { token: user.auth_token }
	end

	def profile 
		user = User.find_by_auth_token!(request.headers[:token])
		render json: {user: {username: user.username, data: user.data}}
	end

	private
	def user_params
		params.require(:user).permit(:username, :password)
	end

end
