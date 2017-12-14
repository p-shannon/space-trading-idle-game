class GameController < ApiController
	before_action :require_login

	def initialize_data
		user = User.find_by_auth_token!(request.headers[:token])
		user.update(data: nil)
		render json: {
			status: "User's data reset!",
			user: {
				username: user.username,
				data: user.data
			}
		}
	end

	def save_data
		user = User.find_by_auth_token!(request.headers[:token])
		user.update(data: params[:data].to_json)
		render json: {
			status: "User's data saved!",
			user: {
				username: user.username,
				data: user.data
			}
		}
	end

	def load_data
		user = User.find_by_auth_token!(request.headers[:token])
		render json: {
			status: "Grabbed user's data!",
			user: {
				username: user.username,
				data: user.data
			}
		}
	end

end
